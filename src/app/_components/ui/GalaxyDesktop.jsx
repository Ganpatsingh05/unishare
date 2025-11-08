import React from "react"
import { useUI } from "../../lib/contexts/UniShareContext"

const GalaxyDesktop = () => {
  const { darkMode } = useUI();

  return (
    <div>
      {/* Theme-aware Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Base background - dark space or light sky */}
        <div 
          className="absolute inset-0" 
          style={{
            background: darkMode
              ? 'radial-gradient(ellipse at center, #0f2825 0%, #0c1f1d 30%, #091818 60%, #050b0b 100%)'
              : 'radial-gradient(ellipse at center, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 60%, #7dd3fc 100%)'
          }}
        />
        
        {/* Film grain texture - Layer 1 */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: darkMode ? 0.45 : 0.15,
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
            opacity: darkMode ? 0.35 : 0.12,
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
            opacity: darkMode ? 0.3 : 0.1,
            mixBlendMode: 'soft-light',
            backgroundSize: 'cover',
            zIndex: 1
          }}
        />
        
        {/* Subtle vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: darkMode
              ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.45) 100%)'
              : 'radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.25) 100%)',
            zIndex: 2
          }}
        />
        
        {/* Organic flowing color curves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          {/* Main Core - Brightest part */}
          <div
            className="absolute"
            style={{
              top: '15%',
              left: '-10%',
              width: '120%',
              height: '70%',
              background: darkMode
                ? 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(200, 220, 255, 0.1) 0%, rgba(180, 200, 240, 0.05) 40%, transparent 70%)'
                : 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 40%, transparent 70%)',
              transform: 'rotate(-30deg)',
              filter: 'blur(80px)',
            }}
          />
          
          {/* Haze - Softer, wider glow */}
          <div
            className="absolute"
            style={{
              top: '5%',
              left: '-15%',
              width: '130%',
              height: '90%',
              background: darkMode
                ? 'radial-gradient(ellipse 90% 60% at 50% 50%, rgba(100, 120, 150, 0.08) 0%, transparent 60%)'
                : 'radial-gradient(ellipse 90% 60% at 50% 50%, rgba(220, 240, 255, 0.2) 0%, transparent 60%)',
              transform: 'rotate(-30deg)',
              filter: 'blur(100px)',
            }}
          />

          {/* Color accent - Teal/Blue */}
          <div
            className="absolute"
            style={{
              top: '20%',
              left: '0%',
              width: '80%',
              height: '60%',
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(30, 110, 105, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.3) 0%, transparent 70%)',
              transform: 'rotate(-40deg) skewX(20deg)',
              filter: 'blur(90px)',
            }}
          />

          {/* Warm accent */}
          <div
            className="absolute"
            style={{
              top: '40%',
              left: '20%',
              width: '60%',
              height: '50%',
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(180, 140, 100, 0.04) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(255, 237, 213, 0.25) 0%, transparent 70%)',
              transform: 'rotate(-25deg)',
              filter: 'blur(100px)',
            }}
          />
        </div>
        
        {/* Flowing texture overlay */}
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
              opacity: darkMode ? 0.4 : 0.15,
              mixBlendMode: 'overlay'
            }}
          />
        </div>
        
        {/* Atmospheric glow */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div
            className="absolute inset-0"
            style={{
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
              opacity: 0.3,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 50%)'
                : 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 50%)',
              transform: 'scale(1.2)',
              filter: 'blur(2px)',
              opacity: 0.2,
              mixBlendMode: 'screen',
            }}
          />
        </div>

        
        {/* Subtle ambient glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 5 }}>
          <div 
            className="rounded-full"
            style={{
              width: '1100px',
              height: '1100px',
              background: darkMode
                ? 'radial-gradient(circle, rgba(26, 74, 69, 0.1) 0%, rgba(20, 60, 57, 0.05) 58%, transparent 82%)'
                : 'radial-gradient(circle, rgba(191, 219, 254, 0.2) 0%, rgba(147, 197, 253, 0.1) 58%, transparent 82%)',
              filter: 'blur(68px)'
            }}
          />
        </div>
        
        {/* Minimal scattered stars/light particles */}
        <div 
          className="absolute inset-0" 
          style={{ 
            zIndex: 3,
            opacity: darkMode ? 0.2 : 0.15 
          }}
        >
          {/* Top area */}
          <div 
            className="absolute top-[8%] left-[12%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(59,130,246,0.5)' }}
          />
          <div 
            className="absolute top-[15%] left-[20%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(224,242,254,0.35)' : 'rgba(96,165,250,0.45)' }}
          />
          <div 
            className="absolute top-[10%] right-[15%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(204,251,241,0.4)' : 'rgba(125,211,252,0.5)' }}
          />
          <div 
            className="absolute top-[18%] right-[25%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(59,130,246,0.4)' }}
          />
          
          {/* Middle area */}
          <div 
            className="absolute top-[45%] left-[8%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(224,242,254,0.35)' : 'rgba(96,165,250,0.45)' }}
          />
          <div 
            className="absolute top-[50%] right-[10%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(59,130,246,0.45)' }}
          />
          
          {/* Bottom area */}
          <div 
            className="absolute bottom-[12%] left-[15%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(204,251,241,0.4)' : 'rgba(125,211,252,0.5)' }}
          />
          <div 
            className="absolute bottom-[8%] left-[25%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(59,130,246,0.4)' }}
          />
          <div 
            className="absolute bottom-[10%] right-[12%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(224,242,254,0.35)' : 'rgba(96,165,250,0.45)' }}
          />
          <div 
            className="absolute bottom-[16%] right-[20%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(59,130,246,0.5)' }}
          />
        </div>
          <div 
            className="absolute top-[25%] left-[15%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(224,242,254,0.25)' : 'rgba(96,165,250,0.35)' }}
          />
          <div 
            className="absolute top-[35%] right-[18%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(59,130,246,0.35)' }}
          />
          <div 
            className="absolute bottom-[25%] left-[20%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(204,251,241,0.28)' : 'rgba(125,211,252,0.38)' }}
          />
          <div 
            className="absolute bottom-[30%] right-[22%] w-0.5 h-0.5 rounded-full" 
            style={{ backgroundColor: darkMode ? 'rgba(207,250,254,0.28)' : 'rgba(125,211,252,0.38)' }}
          />
        </div>
      </div>
  )
}

export default GalaxyDesktop
