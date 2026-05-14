import express from 'express'
import Razorpay from 'razorpay'
import { z } from 'zod'
import supabase from '../db/supabase.js'

const router = express.Router()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Validation schema
const schema = z.object({
  full_name: z.string()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .regex(/^[\u0900-\u097Fa-zA-Z\s]+$/, 'Invalid characters in name'),
  team: z.string()
    .min(2, 'Team name too short')
    .max(30, 'Team name too long'),
  category: z.enum(['ऑल राउंडर', 'फलंदाज', 'गोलंदाज'], {
    errorMap: () => ({ message: 'Invalid category' })
  }),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
})

router.post('/create-order', async (req, res) => {
  // Validate input
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors[0].message
    })
  }

  const { full_name, team, category, phone } = result.data

  // Check phone already registered


  // Create Razorpay order
  try {
    const order = await razorpay.orders.create({
      amount: 100 * 100,   // ₹100 in paise
      currency: 'INR',
      receipt: `receipt_${phone}`,
      notes: { full_name, team, category, phone }
    })

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (err) {
    console.error('Razorpay error:', err)
    res.status(500).json({ error: 'Payment initiation failed' })
  }
})

export default router