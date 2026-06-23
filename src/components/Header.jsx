import React from 'react';
import { Home, MapPin, BarChart3, HelpCircle, FileText } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'map', label: 'Territorio (Mapa)', icon: MapPin },
    { id: 'qualitative', label: 'Diagnóstico Cualitativo', icon: HelpCircle },
    { id: 'demographics', label: 'Demografía', icon: BarChart3 },
    { id: 'proposals', label: 'Propuestas y Pasos Siguientes', icon: FileText }
  ];

  return (
    <header className="glass-panel border-b border-brand-purple/20 sticky top-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* CONADECAFRO Logo Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-purple text-white shadow-lg shadow-brand-purple/30 font-extrabold text-xl font-outfit border border-brand-yellow/30 animate-pulse">
            C
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight m-0 text-white font-outfit leading-none flex items-baseline gap-1">
              <span className="text-gray-100 font-light">conade</span>
              <span className="text-brand-yellow font-extrabold">cafro</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-teal font-medium mt-1">
              Consejo Nacional para el Desarrollo de las Comunidades Afrodescendientes
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center bg-brand-dark/60 p-1 rounded-xl border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-brand-yellow' : 'text-gray-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
