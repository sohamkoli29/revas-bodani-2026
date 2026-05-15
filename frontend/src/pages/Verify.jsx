import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Verify() {
  const [params] = useSearchParams()
  const navigate  = useNavigate()
  const [status, setStatus] = useState('Verifying payment...')

  useEffect(() => {
    const verify = async () => {
      const order_id  = params.get('order_id')
      const full_name = params.get('full_name')
      const team      = params.get('team')
      const category  = params.get('category')
      const phone     = params.get('phone')

      if (!order_id) {
        setStatus('Invalid payment link.')
        return
      }

      try {
        await axios.post(`${API}/api/verify-payment`, {
          order_id, full_name, team, category, phone
        })
        navigate('/success', { state: { full_name, team } })
      } catch (err) {
        setStatus(err.response?.data?.error || 'Payment verification failed.')
      }
    }

    verify()
  }, [])

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-[#78716c]">{status}</p>
      </div>
    </div>
  )
}