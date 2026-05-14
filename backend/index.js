import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { registerLimiter, playersLimiter } from './middleware/rateLimit.js'
import registerRoute from './routes/register.js'
import verifyRoute from './routes/verify.js'
import playersRoute from './routes/players.js'
import adminRoute from './routes/admin.js'

dotenv.config()

const app = express()

// Security headers
app.use(helmet())

// CORS — only your frontend can call this
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean)
}))

app.use(express.json())

// Health check (for UptimeRobot ping)
app.get('/api/health', async (req, res) => {
  const { error } = await supabase
    .from('players')
    .select('count')
    .limit(1)

  res.json({ 
    status: 'ok',
    db: error ? 'error' : 'connected'
  })
})

// Routes with rate limiters
app.use('/api', registerLimiter, registerRoute)
app.use('/api', registerLimiter, verifyRoute)
app.use('/api', playersLimiter, playersRoute)
app.use('/admin', adminRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})