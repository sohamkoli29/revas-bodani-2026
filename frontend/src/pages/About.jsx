export default function About() {
  const details = [
    { label: 'Event Type',   value: 'Physical Cricket Tournament' },
   
    { label: 'Venue',        value: 'Revas Bodani Village Ground, Maharashtra' },
    
  
    { label: 'Entry Fee',    value: '₹100 per player' },
    { label: 'Tournament',   value: 'रेवस बोडणी प्रीमियर लीग 2026 - पर्व 1' },
  ]

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1c1917] mb-1">About the Tournament</h1>
          <p className="text-[#78716c] text-sm">रेवस बोडणी प्रीमियर लीग 2026</p>
        </div>

        <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-sm text-[#44403c] leading-relaxed mb-4">
            रेवस बोडणी प्रीमियर लीग 2026 is a local physical cricket tournament
            organized for players from Revas Bodani village 
            in Maharashtra, India. This is a real offline sporting event — all
            matches are played physically at the village cricket ground.
          </p>
          <p className="text-sm text-[#44403c] leading-relaxed">
            This website is used only for player registration and entry fee
            collection. It is not an online game, fantasy sports app, or
            betting platform of any kind.
          </p>
        </div>

        <div className="bg-white border border-[#e8e0d5] rounded-2xl overflow-hidden shadow-sm mb-6">
          {details.map((d, i) => (
            <div key={i}
              className={`flex justify-between items-center px-6 py-3 text-sm
                ${i !== details.length - 1 ? 'border-b border-[#f0ebe3]' : ''}
                ${i % 2 === 0 ? 'bg-white' : 'bg-[#faf7f2]'}`}>
              <span className="text-[#78716c]">{d.label}</span>
              <span className="font-medium text-[#1c1917] text-right">{d.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#fef9ec] border border-[#f0d080] rounded-2xl p-6 text-sm text-[#92680a]">
          <p className="font-semibold mb-1">Important Note</p>
          <p>
            This is a physical sporting event registration platform.
            No online gaming, gambling, or betting is involved.
            Entry fee covers tournament organization costs only.
          </p>
        </div>

      </div>
    </div>
  )
}