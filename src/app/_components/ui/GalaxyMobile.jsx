import React from "react"

const Backgroundgalaxy = () => {
  return (
    <div>
      {/* 100% Realistic Milky Way Galaxy Background */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Deep space background - pure black */}
    <div className="absolute inset-0 bg-black" />
    
    {/* Dark vignette corners - top-left and bottom-right */}
    <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-to-br from-black via-black/80 to-transparent" />
    <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-gradient-to-tl from-black via-black/80 to-transparent" />
    
    {/* Subtle Milky Way galactic band - clean and minimal */}
    <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] transform rotate-[30deg] opacity-40">
      {/* Subtle galactic glow */}
      <div className="absolute inset-[30%] bg-gradient-to-br from-indigo-900/20 via-blue-900/15 to-purple-900/10 rounded-full blur-3xl" />
    </div>
    
    {/* Very subtle nebulae - minimal and clean */}
    <div className="absolute top-[30%] right-[20%] w-[300px] h-[200px] bg-gradient-radial from-blue-900/8 to-transparent rounded-full blur-2xl" />
    <div className="absolute bottom-[35%] left-[25%] w-[250px] h-[180px] bg-gradient-radial from-purple-900/6 to-transparent rounded-full blur-2xl" />
    
    {/* Clean, realistic star field - not messy */}
    <div className="absolute inset-0">
      {/* Bright focal stars - just a few key stars */}
      <div className="absolute top-[18%] left-[30%] w-2.5 h-2.5 bg-white rounded-full opacity-95" style={{boxShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)'}} />
      <div className="absolute top-[35%] right-[25%] w-2 h-2 bg-blue-50 rounded-full opacity-90" style={{boxShadow: '0 0 8px rgba(219,234,254,0.7), 0 0 16px rgba(219,234,254,0.3)'}} />
      <div className="absolute bottom-[28%] left-[40%] w-2 h-2 bg-white rounded-full opacity-88" style={{boxShadow: '0 0 8px rgba(255,255,255,0.7), 0 0 15px rgba(255,255,255,0.3)'}} />
      <div className="absolute top-[55%] right-[60%] w-1.5 h-1.5 bg-cyan-50 rounded-full opacity-85" style={{boxShadow: '0 0 6px rgba(240,249,255,0.6)'}} />
      <div className="absolute bottom-[42%] right-[35%] w-1.5 h-1.5 bg-white rounded-full opacity-82" style={{boxShadow: '0 0 6px rgba(255,255,255,0.6)'}} />
      
      {/* Medium stars - scattered naturally */}
      <div className="absolute top-[22%] left-[55%] w-1.5 h-1.5 bg-white/85 rounded-full" />
      <div className="absolute top-[48%] left-[25%] w-1.5 h-1.5 bg-blue-100/80 rounded-full" />
      <div className="absolute bottom-[35%] left-[68%] w-1.5 h-1.5 bg-white/80 rounded-full" />
      <div className="absolute top-[68%] right-[45%] w-1.5 h-1.5 bg-cyan-100/75 rounded-full" />
      <div className="absolute bottom-[18%] right-[72%] w-1.5 h-1.5 bg-white/78 rounded-full" />
      <div className="absolute top-[42%] right-[18%] w-1.5 h-1.5 bg-blue-50/75 rounded-full" />
      
      {/* Small stars - clean distribution */}
      <div className="absolute top-[12%] left-[45%] w-1 h-1 bg-white/70 rounded-full" />
      <div className="absolute top-[28%] left-[72%] w-1 h-1 bg-blue-100/65 rounded-full" />
      <div className="absolute top-[58%] left-[15%] w-1 h-1 bg-white/68 rounded-full" />
      <div className="absolute bottom-[52%] right-[28%] w-1 h-1 bg-cyan-100/65 rounded-full" />
      <div className="absolute bottom-[25%] right-[55%] w-1 h-1 bg-white/70 rounded-full" />
      <div className="absolute top-[75%] right-[20%] w-1 h-1 bg-blue-50/65 rounded-full" />
      <div className="absolute bottom-[62%] left-[82%] w-1 h-1 bg-white/68 rounded-full" />
      <div className="absolute top-[38%] left-[88%] w-1 h-1 bg-cyan-50/63 rounded-full" />
      
      {/* Tiny distant stars - minimal for depth */}
      <div className="absolute top-[32%] left-[62%] w-0.5 h-0.5 bg-white/55 rounded-full" />
      <div className="absolute top-[65%] left-[38%] w-0.5 h-0.5 bg-blue-100/50 rounded-full" />
      <div className="absolute bottom-[45%] right-[42%] w-0.5 h-0.5 bg-white/50 rounded-full" />
      <div className="absolute top-[85%] right-[65%] w-0.5 h-0.5 bg-cyan-100/48 rounded-full" />
      <div className="absolute bottom-[15%] left-[28%] w-0.5 h-0.5 bg-white/52 rounded-full" />
      <div className="absolute top-[52%] right-[78%] w-0.5 h-0.5 bg-blue-50/48 rounded-full" />
      <div className="absolute bottom-[68%] left-[52%] w-0.5 h-0.5 bg-white/50 rounded-full" />
    </div>
  </div>
    </div>
  )
}

export default Backgroundgalaxy
