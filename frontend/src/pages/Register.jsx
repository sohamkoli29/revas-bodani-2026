import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { load } from '@cashfreepayments/cashfree-js'

const API = import.meta.env.VITE_API_URL

export default function Register() {
  const [form, setForm] = useState({
    full_name: '', team: '', category: '', phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.full_name.trim()) return toast.error('नाव टाका')
    if (!form.team.trim())      return toast.error('टीम टाका')
    if (!form.category)         return toast.error('कॅटेगरी निवडा')
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return toast.error('योग्य 10 अंकी फोन नंबर टाका')

    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/api/create-order`, form)

      const cashfree = await load({ mode: 'production' })

      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget:   '_top'
      })

    } catch (err) {
      toast.error(err.response?.data?.error || 'काहीतरी चुकले')
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
        <h2 className="text-2xl font-bold text-[#1c1917] mb-2">नोंदणी यशस्वी!</h2>
        <p className="text-[#78716c] mb-6">
  <span className="font-semibold text-[#1c1917]">{form.full_name}</span>, तुमची{' '}
  <span className="font-semibold text-[#d4a853]">रेवस बोडणी प्रीमियर लीग 2026</span>{' '}
  साठी नोंदणी झाली आहे.
</p>
        <a href="/players"
          className="inline-block bg-[#1c1917] text-[#f5f0e8] px-6 py-3 rounded-xl font-medium text-sm">
          सर्व खेळाडू पहा →
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-10">
      <div className="max-w-md mx-auto">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1c1917] mb-1">खेळाडू नोंदणी</h2>
          <p className="text-[#78716c] text-sm">सर्व माहिती भरा आणि ₹100 payment करा</p>
        </div>

        <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 shadow-sm space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#44403c] mb-1.5">
              खेळाडू पूर्ण नाव <span className="text-red-400">*</span>
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="type your full name"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e0d5] bg-[#faf7f2] text-[#1c1917] text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] transition"
            />
          </div>

          {/* Team */}
          <div>
            <label className="block text-sm font-medium text-[#44403c] mb-1.5">
              खेळाडू टीम <span className="text-red-400">*</span>
            </label>
            <input
              name="team"
              value={form.team}
              onChange={handleChange}
              placeholder="Type your team name"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e0d5] bg-[#faf7f2] text-[#1c1917] text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#44403c] mb-1.5">
              खेळाडू कॅटेगरी <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#e8e0d5] bg-[#faf7f2] text-[#1c1917] text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] transition"
            >
              <option value="">-- निवडा --</option>
              <option value="ऑल राउंडर">ऑल राउंडर</option>
              <option value="फलंदाज">फलंदाज</option>
              <option value="गोलंदाज">गोलंदाज</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#44403c] mb-1.5">
              फोन नंबर <span className="text-red-400">*</span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10 अंकी नंबर"
              maxLength={10}
              type="tel"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e0d5] bg-[#faf7f2] text-[#1c1917] text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] transition"
            />
          </div>

          {/* Fee notice */}
          <div className="bg-[#fef9ec] border border-[#f0d080] rounded-xl px-4 py-3 text-xs text-[#92680a]">
            नोंदणी शुल्क <strong>₹100</strong> — UPI / GPay / PhonePe / Paytm द्वारे payment केल्यावरच नोंदणी पूर्ण होईल.
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#1c1917] hover:bg-[#292524] disabled:opacity-60 text-[#f5f0e8] font-semibold py-4 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Processing...' : '₹100 भरा आणि नोंदणी करा'}
          </button>

        </div>
      </div>
    </div>
  )
}