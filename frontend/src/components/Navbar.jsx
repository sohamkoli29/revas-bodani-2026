import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/',         label: 'Home' },
    { to: '/register', label: 'नोंदणी' },
    { to: '/players',  label: 'खेळाडू' },
  ]

  return (
    <nav className="bg-[#1c1917] px-4 py-3 md:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-[#f5f0e8] font-bold text-sm md:text-base leading-tight">
          रेवस बोडणी प्रीमियर लीग <span className="text-[#d4a853]">2026</span>
        </span>
        <div className="flex gap-1 md:gap-2">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors
                ${pathname === l.to
                  ? 'bg-[#d4a853] text-[#1c1917] font-semibold'
                  : 'text-[#a8a29e] hover:text-[#f5f0e8]'
                }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}