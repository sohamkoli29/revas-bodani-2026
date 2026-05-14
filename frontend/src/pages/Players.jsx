import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

const CATEGORY_STYLE = {
  'ऑल राउंडर': 'bg-purple-50 text-purple-700',
  'फलंदाज':    'bg-blue-50 text-blue-700',
  'गोलंदाज':   'bg-emerald-50 text-emerald-700',
}

export default function Players() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('सर्व')

  useEffect(() => {
    fetchPlayers()
    const t = setInterval(fetchPlayers, 30000)
    return () => clearInterval(t)
  }, [])

  const fetchPlayers = async () => {
    const { data } = await supabase.from('public_players').select('*')
    if (data) setPlayers(data)
    setLoading(false)
  }

  const filtered = players.filter(p => {
    const matchSearch =
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.team.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'सर्व' || p.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1c1917]">नोंदणीकृत खेळाडू</h2>
            <p className="text-[#78716c] text-sm mt-0.5">दर 30 सेकंदांनी अपडेट होते</p>
          </div>
          <span className="bg-[#1c1917] text-[#f5f0e8] text-sm font-semibold px-4 py-1.5 rounded-full">
            {players.length} खेळाडू
          </span>
        </div>

        {/* Search */}
        <input
          placeholder="नाव किंवा टीम शोधा..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#e8e0d5] bg-white text-sm text-[#1c1917] focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] mb-3 transition"
        />

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['सर्व', 'ऑल राउंडर', 'फलंदाज', 'गोलंदाज'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${filter === cat
                  ? 'bg-[#1c1917] text-[#f5f0e8] border-[#1c1917]'
                  : 'bg-white text-[#78716c] border-[#e8e0d5] hover:border-[#b8ae9f]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-[#78716c] mt-20">लोड होत आहे...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[#78716c] mt-20">कोणी सापडले नाही</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p, i) => (
              <div key={i}
                className="bg-white border border-[#e8e0d5] rounded-xl px-5 py-4 flex items-center justify-between shadow-sm hover:border-[#d4a853] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0ebe3] flex items-center justify-center text-xs font-bold text-[#78716c]">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1c1917] text-sm">{p.full_name}</div>
                    <div className="text-[#78716c] text-xs mt-0.5">{p.team}</div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${CATEGORY_STYLE[p.category]}`}>
                  {p.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}