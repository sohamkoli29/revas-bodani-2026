import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL

export default function Admin() {
  const [password, setPassword] = useState('')
  const [token, setToken]       = useState(localStorage.getItem('admin_token'))
  const [players, setPlayers]   = useState([])
  const [loading, setLoading]   = useState(false)

  const login = async () => {
    try {
      const { data } = await axios.post(`${API}/admin/login`, { password })
      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
      fetchPlayers(data.token)
      toast.success('Login successful')
    } catch {
      toast.error('Wrong password')
    }
  }

  const fetchPlayers = async (t = token) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/admin/players`, {
        headers: { Authorization: `Bearer ${t}` }
      })
      setPlayers(data.players)
    } catch {
      toast.error('Session expired')
      localStorage.removeItem('admin_token')
      setToken(null)
    }
    setLoading(false)
  }

  const exportCSV = async () => {
    const res = await fetch(`${API}/admin/export`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'revas-bodani-players.csv'
    a.click()
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
    setPlayers([])
  }

  if (!token) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e8e0d5] rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <h2 className="text-xl font-bold text-[#1c1917] mb-1">Admin Login</h2>
        <p className="text-[#78716c] text-sm mb-6">फक्त organizer साठी</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          className="w-full px-4 py-3 rounded-xl border border-[#e8e0d5] bg-[#faf7f2] text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] mb-4 transition"
        />
        <button
          onClick={login}
          className="w-full bg-[#1c1917] hover:bg-[#292524] text-[#f5f0e8] font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1c1917]">Admin Panel</h2>
            <p className="text-[#78716c] text-sm">एकूण {players.length} नोंदणी</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportCSV}
              className="px-4 py-2 rounded-lg border border-[#e8e0d5] bg-white text-sm text-[#44403c] hover:border-[#d4a853] transition-colors">
              CSV Export
            </button>
            <button onClick={() => fetchPlayers()}
              className="px-4 py-2 rounded-lg border border-[#e8e0d5] bg-white text-sm text-[#44403c] hover:border-[#d4a853] transition-colors">
              Refresh
            </button>
            <button onClick={logout}
              className="px-4 py-2 rounded-lg border border-red-200 bg-white text-sm text-red-500 hover:bg-red-50 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-[#78716c] mt-20">Loading...</div>
        ) : (
          <div className="bg-white border border-[#e8e0d5] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1c1917] text-[#f5f0e8]">
                    {['#', 'नाव', 'टीम', 'कॅटेगरी', 'Phone', 'Payment ID', '₹', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map((p, i) => (
                    <tr key={p.id}
                      className={`border-t border-[#f0ebe3] ${i % 2 === 0 ? 'bg-white' : 'bg-[#faf7f2]'}`}>
                      <td className="px-4 py-3 text-[#78716c]">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[#1c1917]">{p.full_name}</td>
                      <td className="px-4 py-3 text-[#44403c]">{p.team}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#f0ebe3] text-[#44403c] px-2 py-0.5 rounded-full text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#44403c]">{p.phone}</td>
                      <td className="px-4 py-3 text-[#78716c] text-xs font-mono">{p.payment_id}</td>
                      <td className="px-4 py-3 text-[#44403c]">₹{p.amount}</td>
                      <td className="px-4 py-3 text-[#78716c] text-xs">
                        {new Date(p.registered_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}