import rateLimit from 'express-rate-limit'

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 20,                      // 20 requests per IP per hour
  message: { error: 'Too many attempts. Try again in an hour.' }
})

export const playersLimiter = rateLimit({
  windowMs: 60 * 1000,         // 1 minute
  max: 120,
  message: { error: 'Too many requests.' }
})

export const adminLoginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 5,
  message: { error: 'Too many login attempts.' }
})

export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,         // 1 minute
  max: 60,
  message: { error: 'Too many requests.' }
})