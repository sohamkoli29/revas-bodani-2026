import express from 'express'
import { z } from 'zod'
import { Cashfree, CFEnvironment } from 'cashfree-pg'
import supabase from '../db/supabase.js'

const router = express.Router()

const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
)

const schema = z.object({
  order_id:  z.string(),
  full_name: z.string(),
  team:      z.string(),
  category:  z.enum(['ऑल राउंडर', 'फलंदाज', 'गोलंदाज']),
  phone:     z.string().regex(/^[6-9]\d{9}$/)
})

router.post('/verify-payment', async (req, res) => {
  const result = schema.safeParse(req.body)
  if (!result.success)
    return res.status(400).json({ error: result.error.errors[0].message })

  const { order_id, full_name, team, category, phone } = result.data

  try {
    const response = await cashfree.PGOrderFetchPayments(order_id)
    const payments = response.data

    const successPayment = payments.find(p => p.payment_status === 'SUCCESS')
    if (!successPayment)
      return res.status(400).json({ error: 'Payment not completed' })

    const payment_id = successPayment.cf_payment_id.toString()

    const { data: duplicate } = await supabase
      .from('players')
      .select('id')
      .eq('payment_id', payment_id)
      .single()

    if (duplicate)
      return res.status(409).json({ error: 'Payment already used' })

    const { error } = await supabase
      .from('players')
      .insert({
        full_name, team, category, phone,
        payment_id,
        amount: 100,
        status: 'paid'
      })

    if (error)
      return res.status(500).json({ error: 'Registration failed' })

    res.json({ success: true, message: 'Registration successful!' })

  } catch (err) {
    console.error('Verify error:', JSON.stringify(err?.response?.data || err?.message || err, null, 2))
    res.status(500).json({ error: 'Verification failed' })
  }
})

export default router