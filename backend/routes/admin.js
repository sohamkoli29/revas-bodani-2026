import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import supabase from '../db/supabase.js'
import { verifyAdmin } from '../middleware/auth.js'
import { adminLoginLimiter, adminLimiter } from '../middleware/rateLimit.js'

const router = express.Router()

// Login
router.post('/login', adminLoginLimiter, async (req, res) => {
  const { password } = req.body
  if (!password)
    return res.status(400).json({ error: 'Password required' })

  const valid = password === process.env.ADMIN_PASSWORD
  if (!valid)
    return res.status(401).json({ error: 'Wrong password' })

  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.json({ token })
})

// Get all players (full data)
router.get('/players', adminLimiter, verifyAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('registered_at', { ascending: false })

  if (error)
    return res.status(500).json({ error: 'Failed to fetch' })

  res.json({ players: data, total: data.length })
})

// Export CSV
router.get('/export', adminLimiter, verifyAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('registered_at', { ascending: false })

  if (error)
    return res.status(500).json({ error: 'Failed to export' })

  const headers = [
    'full_name', 'team', 'category',
    'phone', 'payment_id', 'amount',
    'status', 'registered_at'
  ]

  const csv = [
    headers.join(','),
    ...data.map(p =>
      headers.map(h => `"${p[h] ?? ''}"`).join(',')
    )
  ].join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition',
    'attachment; filename="revas-bodani-players.csv"')
  res.send(csv)
})

export default router