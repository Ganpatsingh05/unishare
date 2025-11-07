'use client';
import React from "react";

/**
 * Earth Theme for Share Ride & Housing Pages
 * Inspired by Earth - the 5th largest planet
 * Color palette: Deep ocean blues, vibrant land greens, atmospheric whites
 * Represents home, shelter, connection, and journey
 * Textured cosmic background similar to main page
 */
const EarthTheme = () => {
  return (
    <>
      {/* Earth-inspired Background - Textured cosmic space like main page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep blue-teal space background inspired by Earth's oceans */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, #0d2d3a 0%, #0a1f2a 30%, #071419 60%, #030a0d 100%)'
          }}
        />
        
        {/* Film grain texture - Layer 1 (Primary grain) - Base level */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='earthGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='8' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23earthGrain)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.45,
            mixBlendMode: 'overlay',
            backgroundSize: 'cover',
            zIndex: 1
          }}
        />
        
        {/* Additional fine grain - Layer 2 - Base level */}
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
        
        {/* Medium grain texture - Layer 3 - Base level */}
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
        
        {/* Subtle vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.45) 100%)',
            zIndex: 2
          }}
        />
        
        {/* Organic flowing color curves - Earth's oceanic flow with land masses */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          {/* Ocean Core - Brightest blue part */}
          <div
            className="absolute"
            style={{
              top: '15%',
              left: '-10%',
              width: '120%',
              height: '70%',
              background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(30, 144, 255, 0.12) 0%, rgba(0, 119, 182, 0.06) 40%, transparent 70%)',
              transform: 'rotate(-30deg)',
              filter: 'blur(80px)',
            }}
          />
          
          {/* Ocean Haze - Softer, wider blue glow */}
          <div
            className="absolute"
            style={{
              top: '5%',
              left: '-15%',
              width: '130%',
              height: '90%',
              background: 'radial-gradient(ellipse 90% 60% at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
              transform: 'rotate(-30deg)',
              filter: 'blur(100px)',
            }}
          />

          {/* Land/Forest Coloring - Green/Teal (Right side) */}
          <div
            className="absolute"
            style={{
              top: '20%',
              right: '5%',
              width: '70%',
              height: '55%',
              background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.09) 0%, rgba(5, 150, 105, 0.05) 50%, transparent 70%)',
              transform: 'rotate(35deg) skewX(-15deg)',
              filter: 'blur(90px)',
            }}
          />

          {/* Continental Green - Bottom left accent */}
          <div
            className="absolute"
            style={{
              bottom: '10%',
              left: '8%',
              width: '50%',
              height: '45%',
              background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.07) 0%, rgba(22, 163, 74, 0.04) 50%, transparent 70%)',
              transform: 'rotate(-15deg)',
              filter: 'blur(85px)',
            }}
          />
          
          {/* Subtle vegetation glow - Top right */}
          <div
            className="absolute"
            style={{
              top: '12%',
              right: '15%',
              width: '40%',
              height: '35%',
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.06) 0%, transparent 65%)',
              filter: 'blur(75px)',
            }}
          />
        </div>
        
        {/* Flowing texture overlay - directional grain following ocean currents */}
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
        
        {/* Starfield - Layered like main page */}
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

        {/* Subtle ambient glow - center sphere with blue-green blend */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 5 }}>
          <div 
            className="rounded-full"
            style={{
              width: '1100px',
              height: '1100px',
              background: 'radial-gradient(circle, rgba(30, 144, 255, 0.08) 0%, rgba(16, 185, 129, 0.05) 45%, rgba(34, 197, 94, 0.03) 65%, transparent 82%)',
              filter: 'blur(68px)'
            }}
          />
        </div>
        
        {/* Minimal scattered stars - very subtle like main page */}
        <div className="absolute inset-0 opacity-20" style={{ zIndex: 3 }}>
          {/* Top area */}
          <div className="absolute top-[8%] left-[12%] w-0.5 h-0.5 bg-white/40 rounded-full" />
          <div className="absolute top-[15%] left-[20%] w-0.5 h-0.5 bg-cyan-100/35 rounded-full" />
          <div className="absolute top-[10%] right-[15%] w-0.5 h-0.5 bg-blue-100/40 rounded-full" />
          <div className="absolute top-[18%] right-[25%] w-0.5 h-0.5 bg-white/30 rounded-full" />
          
          {/* Middle area */}
          <div className="absolute top-[45%] left-[8%] w-0.5 h-0.5 bg-cyan-100/35 rounded-full" />
          <div className="absolute top-[50%] right-[10%] w-0.5 h-0.5 bg-white/35 rounded-full" />
          
          {/* Bottom area */}
          <div className="absolute bottom-[12%] left-[15%] w-0.5 h-0.5 bg-emerald-100/40 rounded-full" />
          <div className="absolute bottom-[8%] left-[25%] w-0.5 h-0.5 bg-white/30 rounded-full" />
          <div className="absolute bottom-[10%] right-[12%] w-0.5 h-0.5 bg-cyan-100/35 rounded-full" />
          <div className="absolute bottom-[16%] right-[20%] w-0.5 h-0.5 bg-white/40 rounded-full" />
          
          {/* Additional subtle stars */}
          <div className="absolute top-[25%] left-[15%] w-0.5 h-0.5 bg-cyan-100/25 rounded-full" />
          <div className="absolute top-[35%] right-[18%] w-0.5 h-0.5 bg-white/25 rounded-full" />
          <div className="absolute bottom-[25%] left-[20%] w-0.5 h-0.5 bg-emerald-100/28 rounded-full" />
          <div className="absolute bottom-[30%] right-[22%] w-0.5 h-0.5 bg-cyan-200/28 rounded-full" />
        </div>
      </div>
    </>
  );
};

export default EarthTheme;
