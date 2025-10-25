import React from 'react'

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
          {/* Top left sweeping curve - flows right and down */}
          <div 
            className="absolute"
            style={{
              top: '-8%',
              left: '-20%',
              width: '75%',
              height: '50%',
              background: 'radial-gradient(ellipse 900px 600px at 45% 35%, rgba(30, 110, 105, 0.22) 0%, rgba(22, 88, 84, 0.12) 40%, transparent 70%)',
              transform: 'rotate(-25deg) skewY(8deg)',
              filter: 'blur(65px)'
            }}
          />
          
          {/* Upper middle curved band - gentle S-curve */}
          <div 
            className="absolute"
            style={{
              top: '8%',
              left: '-12%',
              width: '85%',
              height: '45%',
              background: 'radial-gradient(ellipse 1100px 550px at 48% 40%, rgba(28, 105, 100, 0.2) 0%, rgba(20, 85, 82, 0.11) 45%, transparent 75%)',
              transform: 'rotate(-18deg) skewY(5deg)',
              filter: 'blur(70px)'
            }}
          />
          
          {/* Center main curve - strongest flow through middle */}
          <div 
            className="absolute"
            style={{
              top: '22%',
              left: '-5%',
              width: '95%',
              height: '50%',
              background: 'radial-gradient(ellipse 1250px 650px at 50% 45%, rgba(32, 115, 110, 0.24) 0%, rgba(24, 92, 88, 0.14) 48%, transparent 78%)',
              transform: 'rotate(-12deg) skewY(3deg)',
              filter: 'blur(75px)'
            }}
          />
          
          {/* Lower middle wave - continues the flow */}
          <div 
            className="absolute"
            style={{
              top: '42%',
              left: '2%',
              width: '88%',
              height: '48%',
              background: 'radial-gradient(ellipse 1150px 620px at 46% 48%, rgba(28, 100, 96, 0.21) 0%, rgba(20, 82, 78, 0.12) 50%, transparent 80%)',
              transform: 'rotate(-15deg) skewY(6deg)',
              filter: 'blur(68px)'
            }}
          />
          
          {/* Bottom curved wave - flows down and left */}
          <div 
            className="absolute"
            style={{
              bottom: '-5%',
              left: '-15%',
              width: '70%',
              height: '45%',
              background: 'radial-gradient(ellipse 950px 580px at 48% 52%, rgba(26, 95, 91, 0.19) 0%, rgba(18, 75, 72, 0.1) 48%, transparent 76%)',
              transform: 'rotate(-22deg) skewY(7deg)',
              filter: 'blur(63px)'
            }}
          />
          
          {/* Right side curved flow - top right curve */}
          <div 
            className="absolute"
            style={{
              top: '-5%',
              right: '-18%',
              width: '55%',
              height: '45%',
              background: 'radial-gradient(ellipse 750px 600px at 40% 45%, rgba(28, 102, 98, 0.17) 0%, rgba(20, 82, 78, 0.09) 50%, transparent 78%)',
              transform: 'rotate(25deg) skewY(-8deg)',
              filter: 'blur(72px)'
            }}
          />
          
          {/* Right middle wave - flows diagonally */}
          <div 
            className="absolute"
            style={{
              top: '30%',
              right: '-10%',
              width: '48%',
              height: '50%',
              background: 'radial-gradient(ellipse 700px 700px at 42% 50%, rgba(26, 98, 94, 0.16) 0%, rgba(18, 78, 75, 0.08) 52%, transparent 80%)',
              transform: 'rotate(15deg) skewY(-5deg)',
              filter: 'blur(70px)'
            }}
          />
          
          {/* Bottom right curve - flows to bottom right */}
          <div 
            className="absolute"
            style={{
              bottom: '-8%',
              right: '-20%',
              width: '52%',
              height: '42%',
              background: 'radial-gradient(ellipse 800px 550px at 38% 48%, rgba(24, 90, 86, 0.15) 0%, rgba(16, 72, 69, 0.08) 50%, transparent 75%)',
              transform: 'rotate(28deg) skewY(-9deg)',
              filter: 'blur(66px)'
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
        

        {/* Large Central Sphere - UniShare unique textured planet */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
          {/* Main sphere - dark teal top right, warm brown bottom left */}
          <div 
            className="relative rounded-full overflow-hidden"
            style={{
              width: '850px',
              height: '850px',
              background: `
                radial-gradient(ellipse at 38% 25%, #2d7570 0%, #1f5c58 20%, #164844 40%, transparent 65%),
                radial-gradient(ellipse at 18% 78%, #70402a 0%, #4d2a1a 30%, #2f1810 55%, transparent 80%),
                radial-gradient(circle at center, #1a4a45 0%, #12352f 35%, #0c2320 65%, #061615 85%, #020b0a 100%)
              `,
              boxShadow: `
                inset -85px -95px 165px rgba(0, 0, 0, 0.82),
                inset 75px 65px 115px rgba(45, 117, 112, 0.14),
                inset -15px -190px 210px rgba(112, 64, 42, 0.42),
                0 75px 195px rgba(26, 74, 69, 0.28)
              `
            }}
          >
            {/* Organic texture layer 1 - Horizontal waves */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='organicWaves'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015 0.008' numOctaves='3' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0.3 0.6 0.3 0'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23organicWaves)'/%3E%3C/svg%3E")`,
                opacity: 0.15,
                mixBlendMode: 'soft-light',
                backgroundSize: '100% 100%'
              }}
            />
            
            {/* Organic texture layer 2 - Cloudy patterns */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='850' height='850' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cloudyPattern'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.012' numOctaves='4' seed='12'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0.15 0.4 0.25 0.1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cloudyPattern)'/%3E%3C/svg%3E")`,
                opacity: 0.18,
                mixBlendMode: 'overlay',
                backgroundSize: '110% 110%',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Organic texture layer 3 - Diagonal flow patterns */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='900' height='900' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='diagonalFlow'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.01' numOctaves='2' seed='8'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0.2 0.5 0.3 0.1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23diagonalFlow)'/%3E%3C/svg%3E")`,
                opacity: 0.12,
                mixBlendMode: 'multiply',
                backgroundSize: '120% 120%',
                transform: 'rotate(25deg)'
              }}
            />
            
            {/* Fine detail texture - subtle grain */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fineDetail'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' seed='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0.05 0.15 0.08'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fineDetail)'/%3E%3C/svg%3E")`,
                opacity: 0.25,
                mixBlendMode: 'overlay',
                backgroundSize: '50% 50%'
              }}
            />
            
            {/* Subtle teal highlight - top right area */}
            <div 
              className="absolute rounded-full"
              style={{
                top: '14%',
                left: '22%',
                width: '195px',
                height: '195px',
                background: 'radial-gradient(circle, rgba(60, 130, 125, 0.18) 0%, rgba(45, 117, 112, 0.1) 50%, transparent 78%)',
                filter: 'blur(46px)'
              }}
            />
            
            {/* Deep bottom shadow */}
            <div 
              className="absolute rounded-full"
              style={{
                bottom: '0%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '425px',
                height: '275px',
                background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.48) 52%, transparent 82%)',
                filter: 'blur(72px)'
              }}
            />
            
            {/* Warm orange/brown glow - bottom left */}
            <div 
              className="absolute rounded-full"
              style={{
                bottom: '7%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '375px',
                height: '215px',
                background: 'radial-gradient(ellipse, rgba(135, 78, 52, 0.48) 0%, rgba(112, 64, 42, 0.32) 58%, transparent 86%)',
                filter: 'blur(52px)'
              }}
            />
          </div>
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
