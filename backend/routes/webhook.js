import express from 'express'
import crypto from 'crypto'
import supabase from '../db/supabase.js'

const router = express.Router()

router.post('/cashfree', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Step 1 — Verify webhook signature (security)
    const timestamp = req.headers['x-webhook-timestamp']
    const signature = req.headers['x-webhook-signature']
    const rawBody   = req.body.toString()

    const signedPayload = timestamp + rawBody
    const expectedSig   = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
      .update(signedPayload)
      .digest('base64')

    if (expectedSig !== signature) {
      console.error('Invalid webhook signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    // Step 2 — Parse the event
    const event = JSON.parse(rawBody)
    const { type, data } = event

    // Only handle successful payments
    if (type !== 'PAYMENT_SUCCESS_WEBHOOK') {
      return res.status(200).json({ received: true })
    }

    const payment   = data.payment
    const order     = data.order
    const orderTags = order.order_tags || {}

    const payment_id = payment.cf_payment_id.toString()

    // Get phone from order_tags first (most reliable)
    const phone = orderTags.phone
      || payment.customer_details?.customer_phone
      || payment.customer_details?.customer_id

    const full_name = decodeURIComponent(orderTags.full_name || '')
    const team      = decodeURIComponent(orderTags.team      || '')
    const category  = decodeURIComponent(orderTags.category  || 'ऑल राउंडर')

    console.log('Webhook data:', { full_name, team, category, phone, payment_id })

    // Step 3 — Check already saved (redirect may have already saved it)
    const { data: existing } = await supabase
      .from('players')
      .select('id')
      .eq('payment_id', payment_id)
      .single()

    if (existing) {
      console.log('Already saved via redirect:', payment_id)
      return res.status(200).json({ received: true })
    }

    // Step 4 — Save to Supabase
    const { error } = await supabase
      .from('players')
      .insert({
        full_name,
        team,
        category,
        phone,
        payment_id,
        amount: 100,
        status: 'paid'
      })

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'DB insert failed' })
    }

    console.log('✅ Webhook saved player:', full_name, phone)
    res.status(200).json({ received: true })

  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

export default router