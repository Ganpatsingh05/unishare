import React from "react"

const MarTheme = () => {
  return (
    <>
      {/* Desktop Version - Mars Red Theme */}
      <div className="hidden md:block">
        {/* Mars-inspired Background - Red tones with exact same texture */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Deep red Mars surface background */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'radial-gradient(ellipse at center, #3d1f1f 0%, #2d1717 30%, #1f1010 60%, #12090c 100%)'
            }}
          />
          
          {/* Film grain texture ONLY on background - Layer 1 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)' opacity='1'/%3E%3C/svg%3E")`,
              opacity: 0.45,
              mixBlendMode: 'overlay',
              backgroundSize: 'cover',
              zIndex: 1
            }}
          />
          
          {/* Additional fine grain - Layer 2 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1500 1500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fineGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='3' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fineGrain)' opacity='1'/%3E%3C/svg%3E")`,
              opacity: 0.35,
              mixBlendMode: 'overlay',
              backgroundSize: 'cover',
              zIndex: 1
            }}
          />
          
          {/* Medium grain texture - Layer 3 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1800 1800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='mediumGrain'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.1' numOctaves='2' seed='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23mediumGrain)' opacity='1'/%3E%3C/svg%3E")`,
              opacity: 0.3,
              mixBlendMode: 'soft-light',
              backgroundSize: 'cover',
              zIndex: 1
            }}
          />
          
          {/* Subtle vignette - Mars style */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.45) 100%)',
              zIndex: 2
            }}
          />
          
          {/* Organic flowing color curves - Mars red tones */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
            {/* Mars Core - Brightest red part */}
            <div
              className="absolute"
              style={{
                top: '15%',
                left: '-10%',
                width: '120%',
                height: '70%',
                background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(205, 92, 92, 0.1) 0%, rgba(178, 34, 34, 0.05) 40%, transparent 70%)',
                transform: 'rotate(-30deg)',
                filter: 'blur(80px)',
              }}
            />
            
            {/* Mars Haze - Softer, wider glow */}
            <div
              className="absolute"
              style={{
                top: '5%',
                left: '-15%',
                width: '130%',
                height: '90%',
                background: 'radial-gradient(ellipse 90% 60% at 50% 50%, rgba(139, 69, 19, 0.08) 0%, transparent 60%)',
                transform: 'rotate(-30deg)',
                filter: 'blur(100px)',
              }}
            />

            {/* Dust Storm Coloring - Deep Red */}
            <div
              className="absolute"
              style={{
                top: '20%',
                left: '0%',
                width: '80%',
                height: '60%',
                background: 'radial-gradient(ellipse at center, rgba(165, 42, 42, 0.15) 0%, transparent 70%)',
                transform: 'rotate(-40deg) skewX(20deg)',
                filter: 'blur(90px)',
              }}
            />

            {/* Canyon Coloring - Rust Orange */}
            <div
              className="absolute"
              style={{
                top: '40%',
                left: '20%',
                width: '60%',
                height: '50%',
                background: 'radial-gradient(ellipse at center, rgba(160, 82, 45, 0.06) 0%, transparent 70%)',
                transform: 'rotate(-25deg)',
                filter: 'blur(100px)',
              }}
            />
          </div>
          
          {/* Flowing texture overlay - directional grain following the gradient flow */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
            <svg width="0" height="0">
              <defs>
                <filter id="flowingTexture">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="5" seed="3" />
                  <feColorMatrix type="saturate" values="0"/>
                  <feComponentTransfer>
                    <feFuncA type="discrete" tableValues="0 0.15 0.25 0.35 0.45" />
                  </feComponentTransfer>
                </filter>
              </defs>
            </svg>
            <div 
              style={{
                width: '100%',
                height: '100%',
                filter: 'url(#flowingTexture)',
                opacity: 0.4,
                mixBlendMode: 'overlay'
              }}
            />
          </div>
          
          {/* Starfield */}
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
                opacity: 0.3,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 50%)',
                transform: 'scale(1.2)',
                filter: 'blur(2px)',
                opacity: 0.2,
                mixBlendMode: 'screen',
              }}
            />
          </div>

          
          {/* Subtle ambient glow - behind sphere */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 5 }}>
            <div 
              className="rounded-full"
              style={{
                width: '1100px',
                height: '1100px',
                background: 'radial-gradient(circle, rgba(139, 50, 50, 0.1) 0%, rgba(101, 30, 30, 0.05) 58%, transparent 82%)',
                filter: 'blur(68px)'
              }}
            />
          </div>
          
          {/* Minimal scattered stars - very subtle with red tint */}
          <div className="absolute inset-0 opacity-20" style={{ zIndex: 3 }}>
            {/* Top area */}
            <div className="absolute top-[8%] left-[12%] w-0.5 h-0.5 bg-red-200/40 rounded-full" />
            <div className="absolute top-[15%] left-[20%] w-0.5 h-0.5 bg-rose-100/35 rounded-full" />
            <div className="absolute top-[10%] right-[15%] w-0.5 h-0.5 bg-red-100/40 rounded-full" />
            <div className="absolute top-[18%] right-[25%] w-0.5 h-0.5 bg-white/30 rounded-full" />
            
            {/* Middle area */}
            <div className="absolute top-[45%] left-[8%] w-0.5 h-0.5 bg-rose-100/35 rounded-full" />
            <div className="absolute top-[50%] right-[10%] w-0.5 h-0.5 bg-red-200/35 rounded-full" />
            
            {/* Bottom area */}
            <div className="absolute bottom-[12%] left-[15%] w-0.5 h-0.5 bg-red-100/40 rounded-full" />
            <div className="absolute bottom-[8%] left-[25%] w-0.5 h-0.5 bg-white/30 rounded-full" />
            <div className="absolute bottom-[10%] right-[12%] w-0.5 h-0.5 bg-rose-100/35 rounded-full" />
            <div className="absolute bottom-[16%] right-[20%] w-0.5 h-0.5 bg-red-200/40 rounded-full" />
          </div>
          <div className="absolute top-[25%] left-[15%] w-0.5 h-0.5 bg-rose-100/25 rounded-full" />
          <div className="absolute top-[35%] right-[18%] w-0.5 h-0.5 bg-white/25 rounded-full" />
          <div className="absolute bottom-[25%] left-[20%] w-0.5 h-0.5 bg-red-100/28 rounded-full" />
          <div className="absolute bottom-[30%] right-[22%] w-0.5 h-0.5 bg-rose-200/28 rounded-full" />
        </div>
      </div>

      {/* Mobile Version - Mars Red Theme */}
      <div className="md:hidden">
        {/* Mars Realistic Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Deep space background - dark red/black */}
          <div className="absolute inset-0" style={{ background: '#12090c' }} />
          
          {/* Dark vignette corners - top-left and bottom-right */}
          <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-to-br from-black via-black/80 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-gradient-to-tl from-black via-black/80 to-transparent" />
          
          {/* Subtle Mars atmospheric band - clean and minimal */}
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] transform rotate-[30deg] opacity-40">
            {/* Subtle Mars glow */}
            <div className="absolute inset-[30%] bg-gradient-to-br from-red-800/20 via-red-700/15 to-rose-900/10 rounded-full blur-3xl" />
          </div>
          
          {/* Very subtle nebulae - minimal and clean with red tones */}
          <div className="absolute top-[30%] right-[20%] w-[300px] h-[200px] bg-gradient-radial from-red-700/8 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-[35%] left-[25%] w-[250px] h-[180px] bg-gradient-radial from-rose-800/6 to-transparent rounded-full blur-2xl" />
          
          {/* Clean, realistic star field - not messy */}
          <div className="absolute inset-0">
            {/* Bright focal stars - just a few key stars */}
            <div className="absolute top-[18%] left-[30%] w-2.5 h-2.5 bg-white rounded-full opacity-95" style={{boxShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)'}} />
            <div className="absolute top-[35%] right-[25%] w-2 h-2 bg-red-50 rounded-full opacity-90" style={{boxShadow: '0 0 8px rgba(254,242,242,0.7), 0 0 16px rgba(254,242,242,0.3)'}} />
            <div className="absolute bottom-[28%] left-[40%] w-2 h-2 bg-white rounded-full opacity-88" style={{boxShadow: '0 0 8px rgba(255,255,255,0.7), 0 0 15px rgba(255,255,255,0.3)'}} />
            <div className="absolute top-[55%] right-[60%] w-1.5 h-1.5 bg-rose-50 rounded-full opacity-85" style={{boxShadow: '0 0 6px rgba(255,241,242,0.6)'}} />
            <div className="absolute bottom-[42%] right-[35%] w-1.5 h-1.5 bg-white rounded-full opacity-82" style={{boxShadow: '0 0 6px rgba(255,255,255,0.6)'}} />
            
            {/* Medium stars - scattered naturally */}
            <div className="absolute top-[22%] left-[55%] w-1.5 h-1.5 bg-white/85 rounded-full" />
            <div className="absolute top-[48%] left-[25%] w-1.5 h-1.5 bg-red-100/80 rounded-full" />
            <div className="absolute bottom-[35%] left-[68%] w-1.5 h-1.5 bg-white/80 rounded-full" />
            <div className="absolute top-[68%] right-[45%] w-1.5 h-1.5 bg-rose-100/75 rounded-full" />
            <div className="absolute bottom-[18%] right-[72%] w-1.5 h-1.5 bg-white/78 rounded-full" />
            <div className="absolute top-[42%] right-[18%] w-1.5 h-1.5 bg-red-50/75 rounded-full" />
            
            {/* Small stars - clean distribution */}
            <div className="absolute top-[12%] left-[45%] w-1 h-1 bg-white/70 rounded-full" />
            <div className="absolute top-[28%] left-[72%] w-1 h-1 bg-red-100/65 rounded-full" />
            <div className="absolute top-[58%] left-[15%] w-1 h-1 bg-white/68 rounded-full" />
            <div className="absolute bottom-[52%] right-[28%] w-1 h-1 bg-rose-100/65 rounded-full" />
            <div className="absolute bottom-[25%] right-[55%] w-1 h-1 bg-white/70 rounded-full" />
            <div className="absolute top-[75%] right-[20%] w-1 h-1 bg-red-50/65 rounded-full" />
            <div className="absolute bottom-[62%] left-[82%] w-1 h-1 bg-white/68 rounded-full" />
            <div className="absolute top-[38%] left-[88%] w-1 h-1 bg-rose-50/63 rounded-full" />
            
            {/* Tiny distant stars - minimal for depth */}
            <div className="absolute top-[32%] left-[62%] w-0.5 h-0.5 bg-white/55 rounded-full" />
            <div className="absolute top-[65%] left-[38%] w-0.5 h-0.5 bg-red-100/50 rounded-full" />
            <div className="absolute bottom-[45%] right-[42%] w-0.5 h-0.5 bg-white/50 rounded-full" />
            <div className="absolute top-[85%] right-[65%] w-0.5 h-0.5 bg-rose-100/48 rounded-full" />
            <div className="absolute bottom-[15%] left-[28%] w-0.5 h-0.5 bg-white/52 rounded-full" />
            <div className="absolute top-[52%] right-[78%] w-0.5 h-0.5 bg-red-50/48 rounded-full" />
            <div className="absolute bottom-[68%] left-[52%] w-0.5 h-0.5 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>
    </>
  )
}

export default MarTheme
