import React from 'react';
import { motion } from 'framer-motion';

export default function CampusInsightCard({ title, value, icon: Icon, color, bg, darkMode }) {
  return (
    <motion.div 
      className="flex-shrink-0 w-[260px] md:w-[280px] p-6 rounded-3xl border flex flex-col justify-center items-center text-center transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: darkMode ? 'rgba(30,41,59,0.5)' : '#f8fafc',
        borderColor: darkMode ? '#334155' : '#e2e8f0',
      }}
      whileHover={{ y: -5 }}
    >
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: bg, color: color }}
      >
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-3xl font-black mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>{value}</h4>
      <p className="text-sm font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>{title}</p>
    </motion.div>
  );
}
