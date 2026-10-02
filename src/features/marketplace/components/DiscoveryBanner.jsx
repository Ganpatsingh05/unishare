import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function DiscoveryBanner({ title, subtitle, imagePath, bgColor, textColor, onClick, buttonText = "Explore", reverse = false }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`w-full rounded-3xl overflow-hidden mb-12 flex flex-col md:flex-row items-center gap-6 p-8 md:p-12 cursor-pointer transition-transform duration-300 hover:scale-[1.01] ${reverse ? 'md:flex-row-reverse' : ''}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className="flex-1 flex flex-col items-start justify-center">
        <h3 className="text-3xl md:text-4xl font-black mb-3 leading-tight" style={{ color: textColor, letterSpacing: '-0.03em' }}>
          {title}
        </h3>
        <p className="text-lg md:text-xl font-medium mb-8 opacity-90" style={{ color: textColor }}>
          {subtitle}
        </p>
        <button 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:gap-3"
          style={{ backgroundColor: textColor, color: bgColor }}
        >
          {buttonText} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 w-full flex justify-center relative">
        <div className="relative w-48 h-48 md:w-64 md:h-64 drop-shadow-xl hover:-translate-y-2 transition-transform duration-500">
          <Image
            src={imagePath}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}
