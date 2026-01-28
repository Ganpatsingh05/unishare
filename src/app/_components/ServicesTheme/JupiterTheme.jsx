'use client';
import React, { useState, useEffect } from "react";

const JupiterTheme = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Jupiter Theme - Desktop & Mobile unified */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep space background - dark brown cosmos */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, #1a140c 0%, #2a1f10 30%, #1a0f08 70%, #000000 100%)'
          }}
          />
        
        {/* Starfield background - Similar to main page */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
              opacity: 0.3,
            }}
          />
        </div>

        {/* Film grain texture for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='jupiterGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23jupiterGrain)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.35,
            mixBlendMode: 'overlay',
            backgroundSize: 'cover',
            zIndex: 2
          }}
        />
        
        {/* Atmospheric vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)',
            zIndex: 3
          }}
        />
        
        {/* Jupiter Globe Image - Centered */}
        {!isMobile ? (
          /* Desktop Version - Larger Jupiter Globe */
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 6 }}>
            <div className="relative">
              {/* Glow effect behind Jupiter */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: '900px',
                  height: '900px',
                  background: 'radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, rgba(217, 119, 6, 0.18) 40%, transparent 70%)',
                  filter: 'blur(80px)',
                  zIndex: -1
                }}
              />
              
              {/* Jupiter Globe Image */}
              <img 
                src="assets\BackgroundImages\jupyter-globe.png"
                alt="Jupiter"
                className="w-[700px] h-[700px] object-contain"
                style={{
                  filter: 'drop-shadow(0 0 60px rgba(234, 179, 8, 0.5)) drop-shadow(0 0 100px rgba(217, 119, 6, 0.3))',
                  animation: 'jupiterFloat 25s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        ) : (
          /* Mobile Version - Smaller Jupiter Globe */
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 6 }}>
            <div className="relative">
              {/* Glow effect behind Jupiter */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: '400px',
                  height: '400px',
                  background: 'radial-gradient(circle, rgba(234, 179, 8, 0.35) 0%, rgba(217, 119, 6, 0.2) 40%, transparent 70%)',
                  filter: 'blur(50px)',
                  zIndex: -1
                }}
              />
              
              {/* Jupiter Globe Image */}
              <img 
                src="assets\BackgroundImages\jupyter-globe.jpg"
                alt="Jupiter"
                className="w-[350px] h-[350px] object-contain"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(234, 179, 8, 0.6)) drop-shadow(0 0 70px rgba(217, 119, 6, 0.4))',
                  animation: 'jupiterFloat 20s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        )}

        {/* Subtle color accents from Jupiter */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
          {/* Golden yellow glow */}
          <div
            className="absolute"
            style={{
              top: '20%',
              left: '10%',
              width: '80%',
              height: '60%',
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.05) 50%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
          
          {/* Amber/brown band accent */}
          <div
            className="absolute"
            style={{
              top: '30%',
              left: '20%',
              width: '60%',
              height: '50%',
              background: 'radial-gradient(ellipse at center, rgba(217, 119, 6, 0.08) 0%, rgba(180, 83, 9, 0.04) 50%, transparent 70%)',
              filter: 'blur(90px)',
            }}
          />
          
          {/* Red spot subtle accent */}
          <div
            className="absolute"
            style={{
              top: '35%',
              left: '25%',
              width: '50%',
              height: '40%',
              background: 'radial-gradient(ellipse at center, rgba(185, 28, 28, 0.06) 0%, transparent 60%)',
              filter: 'blur(85px)',
            }}
          />
        </div>

        {/* Scattered stars around Jupiter */}
        <div className="absolute inset-0" style={{ zIndex: 5 }}>
          {/* Bright stars with warm tint */}
          <div className="absolute top-[10%] right-[15%] w-2 h-2 bg-white rounded-full opacity-90" style={{boxShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(255,255,255,0.4)'}} />
          <div className="absolute top-[20%] left-[12%] w-1.5 h-1.5 bg-yellow-50 rounded-full opacity-85" style={{boxShadow: '0 0 6px rgba(254,252,232,0.7)'}} />
          <div className="absolute bottom-[25%] right-[20%] w-1.5 h-1.5 bg-white rounded-full opacity-82" style={{boxShadow: '0 0 6px rgba(255,255,255,0.7)'}} />
          <div className="absolute bottom-[15%] left-[18%] w-2 h-2 bg-amber-50 rounded-full opacity-88" style={{boxShadow: '0 0 7px rgba(255,251,235,0.7)'}} />
          
          {/* Medium stars */}
          <div className="absolute top-[15%] left-[25%] w-1 h-1 bg-white/80 rounded-full" />
          <div className="absolute top-[35%] right-[10%] w-1 h-1 bg-yellow-100/75 rounded-full" />
          <div className="absolute bottom-[30%] left-[15%] w-1 h-1 bg-white/78 rounded-full" />
          <div className="absolute bottom-[20%] right-[25%] w-1 h-1 bg-amber-100/72 rounded-full" />
          <div className="absolute top-[45%] left-[8%] w-1 h-1 bg-white/75 rounded-full" />
          <div className="absolute top-[60%] right-[12%] w-1 h-1 bg-yellow-50/70 rounded-full" />
          
          {/* Small distant stars */}
          <div className="absolute top-[25%] left-[35%] w-0.5 h-0.5 bg-white/65 rounded-full" />
          <div className="absolute top-[50%] right-[30%] w-0.5 h-0.5 bg-yellow-100/60 rounded-full" />
          <div className="absolute bottom-[40%] left-[30%] w-0.5 h-0.5 bg-white/60 rounded-full" />
          <div className="absolute bottom-[35%] right-[35%] w-0.5 h-0.5 bg-amber-100/58 rounded-full" />
          <div className="absolute top-[70%] left-[10%] w-0.5 h-0.5 bg-white/62 rounded-full" />
          <div className="absolute top-[80%] right-[8%] w-0.5 h-0.5 bg-yellow-50/55 rounded-full" />
        </div>
      </div>

      {/* Floating Jupiter Animation */}
      <style jsx>{`
        @keyframes jupiterFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(1deg);
          }
          50% {
            transform: translateY(-8px) rotate(0deg);
          }
          75% {
            transform: translateY(-15px) rotate(-1deg);
          }
        }
      `}</style>
    </>
  )
}

export default JupiterTheme
