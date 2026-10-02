import React from 'react';

const QUICK_FILTERS = [
  { id: 'listed-today', icon: '🔥', label: 'Listed Today', filter: { sort: 'recent' } },
  { id: 'under-500', icon: '💰', label: 'Under ₹500', filter: { maxPrice: '500' } },
  { id: 'near-me', icon: '📍', label: 'Near Me', filter: { location: 'Campus' } }, // Simple mock
  { id: 'hostel-essentials', icon: '🎓', label: 'Hostel Essentials', filter: { category: 'furniture' } },
  { id: 'exam-season', icon: '📚', label: 'Exam Season', filter: { category: 'books' } },
];

export default function QuickFilters({ activeQuickFilter, setActiveQuickFilter, applyFilters, darkMode }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 mb-6">
      <span className="text-sm font-bold flex-shrink-0" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
        Quick Filters:
      </span>
      {QUICK_FILTERS.map((qf) => {
        const isActive = activeQuickFilter === qf.id;
        return (
          <button
            key={qf.id}
            onClick={() => {
              if (isActive) {
                setActiveQuickFilter(null);
                // Clear the quick filter applied fields
                applyFilters({ maxPrice: '', location: '', category: 'all' }); 
              } else {
                setActiveQuickFilter(qf.id);
                applyFilters(qf.filter);
              }
            }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all duration-300 ${isActive ? 'shadow-sm scale-105' : 'hover:scale-105 active:scale-95'}`}
            style={{
              backgroundColor: isActive ? (darkMode ? '#334155' : '#1e293b') : (darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff'),
              borderColor: isActive ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
              color: isActive ? '#ffffff' : (darkMode ? '#cbd5e1' : '#475569')
            }}
          >
            <span>{qf.icon}</span>
            {qf.label}
          </button>
        );
      })}
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
