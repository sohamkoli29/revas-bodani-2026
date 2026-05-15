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
  full_name: z.string().min(2).max(50),
  team:      z.string().min(2).max(30),
  category:  z.enum(['ऑल राउंडर', 'फलंदाज', 'गोलंदाज']),
  phone:     z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number')
})

router.post('/create-order', async (req, res) => {
  const result = schema.safeParse(req.body)
  if (!result.success)
    return res.status(400).json({ error: result.error.errors[0].message })

  const { full_name, team, category, phone } = result.data

  try {
    const orderData = {
      order_amount:   100,
      order_currency: 'INR',
      order_id:       `rbpl_${Date.now()}`,
      customer_details: {
        customer_id:    phone,
        customer_name:  full_name,
        customer_phone: phone,
        customer_email: 'noreply@revasbodani.com'
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/verify?order_id={order_id}&full_name=${encodeURIComponent(full_name)}&team=${encodeURIComponent(team)}&category=${encodeURIComponent(category)}&phone=${phone}`
      },
      order_note: `${team} - ${category}`
    }

    const response = await cashfree.PGCreateOrder(orderData)

    res.json({
      order_id:           response.data.order_id,
      payment_session_id: response.data.payment_session_id
    })

  } catch (err) {
    console.error('Cashfree error:', JSON.stringify(err?.response?.data || err?.message || err, null, 2))
    res.status(500).json({ error: 'Payment initiation failed' })
  }
})

export default router