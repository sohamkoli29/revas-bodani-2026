import { Link } from 'react-router-dom'

export default function Home() {
  const info = [
    { label: 'नोंदणी शेवट',  value: ' 01 June 2026' },
    { label: 'नोंदणी शुल्क', value: '₹100' },
    { label: 'ठिकाण',        value: 'रेवस बोडणी मैदान' },
    
  ]

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-10 md:py-16">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#d4a853]/20 text-[#92680a] text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            पर्व 1 • नोंदणी सुरू आहे
          </div>
            <div className="flex justify-center mb-4">
    <img
      src="/logo.png"
      alt="रेवस बोडणी प्रीमियर लीग"
      className="h-24 w-24 object-contain"
    />
  </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1c1917] leading-tight mb-3">
            रेवस बोडणी<br />
            <span className="text-[#d4a853]">प्रीमियर लीग 2026</span>
          </h1>
          <p className="text-[#78716c] text-sm md:text-base">
            तुमच्या टीमसह सहभागी व्हा आणि चॅम्पियन बना
          </p>
        </div>

        {/* Info card */}
        <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 mb-6 shadow-sm">
          {info.map((item, i) => (
            <div
              key={i}
              className={`flex justify-between items-center py-3 ${
                i !== info.length - 1 ? 'border-b border-[#f0ebe3]' : ''
              }`}
            >
              <span className="text-[#78716c] text-sm">{item.label}</span>
              <span className="font-semibold text-[#1c1917] text-sm">{item.value}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/register">
          <button className="w-full bg-[#1c1917] hover:bg-[#292524] text-[#f5f0e8] font-semibold py-4 rounded-xl text-base transition-colors mb-3">
            नोंदणी करा →
          </button>
        </Link>
        <Link to="/players">
          <button className="w-full bg-transparent border border-[#d6cfc4] hover:border-[#b8ae9f] text-[#78716c] hover:text-[#1c1917] font-medium py-3 rounded-xl text-sm transition-colors">
            नोंदणीकृत खेळाडू पहा
          </button>
        </Link>

      </div>
    </div>
  )
}