import express from 'express'
import supabase from '../db/supabase.js'

const router = express.Router()

router.get('/players', async (req, res) => {
  const { data, error } = await supabase
    .from('public_players')   // uses the view, hides phone + payment_id
    .select('*')

  if (error)
    return res.status(500).json({ error: 'Failed to fetch players' })

  res.json({ players: data, total: data.length })
})

export default router