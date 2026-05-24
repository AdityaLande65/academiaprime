import React, { ReactNode } from 'react';
import { AppMode } from '../types';

interface LayoutProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeMode, onModeChange, children }) => {
  const modes = [
    { mode: AppMode.DRAFT, icon: 'fa-pen-nib', label: 'Draft' },
    { mode: AppMode.POLISH, icon: 'fa-wand-magic-sparkles', label: 'Polish' },
    { mode: AppMode.ANALYZE, icon: 'fa-magnifying-glass-chart', label: 'Analyze' },
    { mode: AppMode.GROUNDING, icon: 'fa-globe', label: 'Grounding' },
    { mode: AppMode.REVIEW, icon: 'fa-book-open-reader', label: 'Review' },
    { mode: AppMode.GHOST_WRITER, icon: 'fa-ghost', label: 'Ghost Writer' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-graduation-cap text-blue-600"></i> AcademiaPrime
        </h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4 gap-2">
          {modes.map(m => (
            <button
              key={m.mode}
              onClick={() => onModeChange(m.mode)}
              className={`text-left px-4 py-3 rounded-xl transition-all font-medium flex items-center gap-3 ${
                activeMode === m.mode 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className={`fas ${m.icon} w-5 text-center`}></i>
              {m.label}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
