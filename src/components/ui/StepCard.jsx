import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';

/**
 * ✅ PERFORMANCE: Extracted and memoized StepCard component
 * Prevents unnecessary re-renders when parent state changes
 */
const StepCard = React.memo(({ 
  step, 
  index, 
  isActive, 
  isVisible, 
  darkMode, 
  isMobile, 
  onStepClick,
  howItWorksStepsLength 
}) => {
  const IconComponent = step.icon;
  const isCompleted = index < (isActive ? index : -1) || (isMobile && isVisible);
  
  return (
    <div 
      data-step={index}
      className="relative group opacity-100 translate-y-0"
      onClick={() => isMobile && onStepClick(index)}
    >
      {/* Mobile: Ultra-Premium Bold Glass Card */}
      {isMobile ? (
        <div className="relative">
          {/* Main Bold Glass Container */}
          <div 
            className={`relative overflow-hidden rounded-[32px] glass-card-mobile border-2 ${
              isActive 
                ? `border-white/50` 
                : darkMode 
                  ? 'border-white/15' 
                  : 'border-white/25'
            }`}
            style={{
              background: isActive 
                ? `linear-gradient(135deg, ${step.color.replace('from-', '').replace(' to-', ', ').replace('-500', '').replace('-400', '')})` 
                : darkMode 
                  ? `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)`
                  : `linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.2) 100%)`
            }}
          >
            
            {/* Bold Glass Top Highlight */}
            <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute top-1 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Glass Side Highlights */}
            <div className="absolute top-8 bottom-8 left-0 w-0.5 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            <div className="absolute top-8 bottom-8 right-0 w-0.5 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            
            <div className="relative p-8 z-10">
              <div className="flex items-start gap-6">
                {/* Bold Floating Step Indicator */}
                <div className="relative">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center text-xl font-light glass-step-badge ${
                    isActive 
                      ? 'bg-white/95 text-gray-900 scale-110' 
                      : `bg-gradient-to-br ${step.color} text-white scale-100 hover:scale-105`
                  }`}>
                    {isCompleted && isActive ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      step.step
                    )}
                    
                    {/* Bold Glass Shine */}
                    <div className="absolute inset-0 rounded-3xl glass-shine" />
                  </div>
                  
                  {/* Larger Floating Particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white/40 glass-particle" />
                </div>

                <div className="flex-1">
                  <h3 className={`text-2xl font-medium mb-4 transition-colors duration-1000 ${
                    isActive 
                      ? 'text-white' 
                      : darkMode 
                        ? 'text-white' 
                        : 'text-gray-900'
                  }`}
                  style={{
                    fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {step.shortTitle}
                  </h3>
                  <p className={`text-base leading-relaxed transition-colors duration-1000 opacity-85 ${
                    isActive 
                      ? 'text-white/90' 
                      : darkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-700'
                  }`}
                  style={{
                    fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
                  }}>
                    {step.mobileDescription}
                  </p>
                </div>

                <ChevronRight className={`w-7 h-7 ${
                  isActive 
                    ? 'text-white transform rotate-90' 
                    : darkMode 
                      ? 'text-gray-400 group-hover:text-gray-300' 
                      : 'text-gray-500 group-hover:text-gray-700'
                }`} />
              </div>

              {/* Enhanced Expanded Content with Bold Glass */}
              <div className={`overflow-hidden transition-all duration-300 ${
                isActive ? 'max-h-48 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="glass-feature-list">
                  <div className="space-y-4">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-white/90 rounded-full shadow-lg glass-feature-dot" />
                        <span className="text-white/95 text-base font-medium"
                          style={{ fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bold Progress Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-b-[32px] overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-white/90 to-white/70 transition-all duration-500 ${
                  isActive ? 'w-full' : 'w-0'
                }`}
                style={{
                  boxShadow: isActive ? '0 0 25px rgba(255,255,255,0.6)' : 'none'
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Desktop: Ultra-Premium Bold Glass Design */
        <div className="relative group h-full">
          {/* Main Bold Glass Container */}
          <div className="glass-card-desktop">
            
            {/* Bold Glass Top Highlight */}
            <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="absolute top-1 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            
            {/* Glass Side Highlights */}
            <div className="absolute top-6 bottom-6 left-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="absolute top-6 bottom-6 right-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            
            <div className="relative z-10">
              {/* Bold Floating Step Number */}
              <div className="relative inline-block mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white text-xl font-light glass-step-badge`}>
                  {step.step}
                  
                  {/* Bold Glass Shine */}
                  <div className="absolute inset-0 rounded-2xl glass-shine" />
                </div>
                
                {/* Larger Floating Particle */}
                <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white/30 glass-particle" />
              </div>
              
              {/* Icon */}
              <div className="mb-6">
                <IconComponent className={`w-7 h-7 transition-colors duration-1000 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </div>
              
              <h3 className={`text-2xl font-medium mb-4 transition-colors duration-1000 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {step.title}
              </h3>
              
              <p className={`text-base leading-relaxed transition-colors duration-1000 opacity-75 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              style={{
                fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
              }}>
                {step.description}
              </p>

              {/* Feature List with Bold Glass Effect */}
              <div className="mt-6 space-y-3">
                {step.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} glass-feature-dot`} />
                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
                      style={{ fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced connection line for mobile with glow */}
      {isMobile && index < howItWorksStepsLength - 1 && (
        <div className="flex justify-center py-4">
          <div className={`w-1 h-10 rounded-full transition-all duration-700 bg-gradient-to-b ${step.color} shadow-lg`} />
        </div>
      )}
    </div>
  );
});

StepCard.displayName = 'StepCard';

export default StepCard;
