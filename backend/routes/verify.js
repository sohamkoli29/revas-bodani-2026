import express from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import supabase from '../db/supabase.js'

const router = express.Router()

const schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  full_name:           z.string(),
  team:                z.string(),
  category:            z.enum(['ऑल राउंडर', 'फलंदाज', 'गोलंदाज']),
  phone:               z.string().regex(/^[6-9]\d{9}$/)
})

router.post('/verify-payment', async (req, res) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors[0].message
    })
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    full_name, team, category, phone
  } = result.data

  // Verify Razorpay signature (scam-proof step)
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' })
  }

  // Check payment_id not already used
  const { data: duplicate } = await supabase
    .from('players')
    .select('id')
    .eq('payment_id', razorpay_payment_id)
    .single()

  if (duplicate) {
    return res.status(409).json({ error: 'Payment already used' })
  }

  // Save to Supabase
  const { error } = await supabase
    .from('players')
    .insert({
      full_name, team, category, phone,
      payment_id: razorpay_payment_id,
      amount: 100,
      status: 'paid'
    })



  res.json({ success: true, message: 'Registration successful!' })
})

export default router