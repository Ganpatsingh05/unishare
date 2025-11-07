import React from "react"

const GalaxyDesktop = () => {
  return (
    <div>
      {/* Comet-inspired Background - Large Sphere with exact reference colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Dark greenish-teal space background - exact Comet reference */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, #0f2825 0%, #0c1f1d 30%, #091818 60%, #050b0b 100%)'
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
        
        {/* Subtle vignette - exact Comet style */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.45) 100%)',
            zIndex: 2
          }}
        />
        
        {/* Organic flowing color curves - following exact black line paths */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          {/* Milky Way Core - Brightest part */}
          <div
            className="absolute"
            style={{
              top: '15%',
              left: '-10%',
              width: '120%',
              height: '70%',
              background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(200, 220, 255, 0.1) 0%, rgba(180, 200, 240, 0.05) 40%, transparent 70%)',
              transform: 'rotate(-30deg)',
              filter: 'blur(80px)',
            }}
          />
          
          {/* Milky Way Haze - Softer, wider glow */}
          <div
            className="absolute"
            style={{
              top: '5%',
              left: '-15%',
              width: '130%',
              height: '90%',
              background: 'radial-gradient(ellipse 90% 60% at 50% 50%, rgba(100, 120, 150, 0.08) 0%, transparent 60%)',
              transform: 'rotate(-30deg)',
              filter: 'blur(100px)',
            }}
          />

          {/* Nebula Coloring - Teal */}
          <div
            className="absolute"
            style={{
              top: '20%',
              left: '0%',
              width: '80%',
              height: '60%',
              background: 'radial-gradient(ellipse at center, rgba(30, 110, 105, 0.15) 0%, transparent 70%)',
              transform: 'rotate(-40deg) skewX(20deg)',
              filter: 'blur(90px)',
            }}
          />

          {/* Nebula Coloring - Faint Warmth */}
          <div
            className="absolute"
            style={{
              top: '40%',
              left: '20%',
              width: '60%',
              height: '50%',
              background: 'radial-gradient(ellipse at center, rgba(180, 140, 100, 0.04) 0%, transparent 70%)',
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
          {/* Starfield background removed - file not available */}
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
              background: 'radial-gradient(circle, rgba(26, 74, 69, 0.1) 0%, rgba(20, 60, 57, 0.05) 58%, transparent 82%)',
              filter: 'blur(68px)'
            }}
          />
        </div>
        
        {/* Minimal scattered stars - very subtle */}
        <div className="absolute inset-0 opacity-20" style={{ zIndex: 3 }}>
          {/* Top area */}
          <div className="absolute top-[8%] left-[12%] w-0.5 h-0.5 bg-white/40 rounded-full" />
          <div className="absolute top-[15%] left-[20%] w-0.5 h-0.5 bg-cyan-100/35 rounded-full" />
          <div className="absolute top-[10%] right-[15%] w-0.5 h-0.5 bg-teal-100/40 rounded-full" />
          <div className="absolute top-[18%] right-[25%] w-0.5 h-0.5 bg-white/30 rounded-full" />
          
          {/* Middle area */}
          <div className="absolute top-[45%] left-[8%] w-0.5 h-0.5 bg-cyan-100/35 rounded-full" />
          <div className="absolute top-[50%] right-[10%] w-0.5 h-0.5 bg-white/35 rounded-full" />
          
          {/* Bottom area */}
          <div className="absolute bottom-[12%] left-[15%] w-0.5 h-0.5 bg-teal-100/40 rounded-full" />
          <div className="absolute bottom-[8%] left-[25%] w-0.5 h-0.5 bg-white/30 rounded-full" />
          <div className="absolute bottom-[10%] right-[12%] w-0.5 h-0.5 bg-cyan-100/35 rounded-full" />
          <div className="absolute bottom-[16%] right-[20%] w-0.5 h-0.5 bg-white/40 rounded-full" />
        </div>
          <div className="absolute top-[25%] left-[15%] w-0.5 h-0.5 bg-cyan-100/25 rounded-full" />
          <div className="absolute top-[35%] right-[18%] w-0.5 h-0.5 bg-white/25 rounded-full" />
          <div className="absolute bottom-[25%] left-[20%] w-0.5 h-0.5 bg-teal-100/28 rounded-full" />
          <div className="absolute bottom-[30%] right-[22%] w-0.5 h-0.5 bg-cyan-200/28 rounded-full" />
        </div>
      </div>
  )
}

export default GalaxyDesktop
