import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, Award, Lightbulb, ShieldCheck, HelpCircle } from 'lucide-react';

export default function QualitativeSection({ qualitative }) {
  const [activeSubTab, setActiveSubTab] = useState('weaknesses'); // weaknesses, strengths, suggestions

  const categories = [
    { id: 'weaknesses', label: 'Debilidades / Obstáculos', icon: ShieldAlert, colorClass: 'border-brand-red/30 text-brand-red bg-brand-red/5' },
    { id: 'strengths', label: 'Fortalezas Organizacionales', icon: ShieldCheck, colorClass: 'border-brand-teal/30 text-brand-teal bg-brand-teal/5' },
    { id: 'suggestions', label: 'Sugerencias de los Territorios', icon: Lightbulb, colorClass: 'border-brand-yellow/30 text-brand-yellow bg-brand-yellow/5' }
  ];

  // Helper to render visual icons for Adinkra symbols placeholders (stylized circles/symbols)
  const getAdinkraSymbolSVG = (symbolName, color) => {
    switch (symbolName) {
      case 'Cuernos de carnero': // Justicia (Ram horns - strength & humility)
        return (
          <svg viewBox="0 0 100 100" className="w-12 h-12" stroke={color} strokeWidth="5" fill="none">
            <path d="M 50,50 C 40,20 10,30 20,50 C 25,60 40,55 40,40 C 40,25 60,25 60,40 C 60,55 75,60 80,50 C 90,30 60,20 50,50 Z" />
            <circle cx="50" cy="50" r="3" fill={color} />
          </svg>
        );
      case 'La tela de la araña': // Reconocimiento (Spider web - wisdom & creativity)
        return (
          <svg viewBox="0 0 100 100" className="w-12 h-12" stroke={color} strokeWidth="4" fill="none">
            <line x1="10" y1="10" x2="90" y2="90" />
            <line x1="90" y1="10" x2="10" y2="90" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <line x1="5" y1="50" x2="95" y2="50" />
            <polygon points="50,25 75,50 50,75 25,50" />
            <polygon points="50,15 85,50 50,85 15,50" />
            <polygon points="50,35 65,50 50,65 35,50" />
          </svg>
        );
      case 'Cocodrilos siameses': // Inclusión (Siamese crocodiles - unity & diversity)
        return (
          <svg viewBox="0 0 100 100" className="w-12 h-12" stroke={color} strokeWidth="5" fill="none">
            <rect x="35" y="15" width="30" height="70" rx="15" />
            <line x1="20" y1="35" x2="80" y2="35" />
            <line x1="20" y1="65" x2="80" y2="65" />
            <circle cx="50" cy="35" r="4" fill={color} />
            <circle cx="50" cy="65" r="4" fill={color} />
          </svg>
        );
      case 'Ayúdame y deja que te ayude': // Desarrollo (Cooperation & interdependence)
        return (
          <svg viewBox="0 0 100 100" className="w-12 h-12" stroke={color} strokeWidth="5" fill="none">
            <circle cx="35" cy="50" r="18" />
            <circle cx="65" cy="50" r="18" />
            <path d="M 40,32 A 18,18 0 0,1 60,32" strokeWidth="6" />
            <path d="M 40,68 A 18,18 0 0,0 60,68" strokeWidth="6" />
          </svg>
        );
      case 'Verja, valla': // Paz (Fence/Wall - security, love, protection)
        return (
          <svg viewBox="0 0 100 100" className="w-12 h-12" stroke={color} strokeWidth="5" fill="none">
            <line x1="15" y1="20" x2="85" y2="20" />
            <line x1="15" y1="80" x2="85" y2="80" />
            <line x1="15" y1="50" x2="85" y2="50" />
            <line x1="25" y1="10" x2="25" y2="90" />
            <line x1="45" y1="10" x2="45" y2="90" />
            <line x1="65" y1="10" x2="65" y2="90" />
            <line x1="85" y1="10" x2="85" y2="90" />
          </svg>
        );
      default:
        return <HelpCircle size={32} className="text-gray-400" />;
    }
  };

  const currentList = qualitative[activeSubTab] || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      
      {/* 1. Header & Context */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold font-outfit text-white">Análisis Cualitativo del Diagnóstico</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Los operadores locales identificaron los principales obstáculos, fortalezas institucionales y sugerencias para fortalecer la presencia de CONADECAFRO en los territorios. Cada dimensión está asociada a un principio del Decenio Afrodescendiente y su respectivo símbolo Adinkra.
        </p>
      </div>

      {/* 2. Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-white/5 pb-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeSubTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveSubTab(cat.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                isActive 
                  ? `${cat.colorClass} scale-105 border-opacity-100 shadow-lg shadow-black/30` 
                  : 'border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {currentList.map((item, index) => {
          const isPurple = item.dimension === 'JUSTICIA';
          const isTeal = item.dimension === 'RECONOCIMIENTO';
          const isYellow = item.dimension === 'INCLUSIÓN';
          const isRed = item.dimension === 'DESARROLLO';
          const isGray = item.dimension === 'PAZ';
          
          let cardStyleClass = "glass-panel border-white/5 hover:border-white/20";
          if (isPurple) cardStyleClass = "glass-card-purple border-brand-purple/20 hover:border-brand-purple/50";
          if (isTeal) cardStyleClass = "glass-card-teal border-brand-teal/20 hover:border-brand-teal/50";
          if (isYellow) cardStyleClass = "glass-card-yellow border-brand-yellow/20 hover:border-brand-yellow/50";
          if (isRed) cardStyleClass = "glass-card-red border-brand-red/20 hover:border-brand-red/50";
          if (isGray) cardStyleClass = "glass-card-gray border-brand-gray/20 hover:border-brand-gray/50";

          return (
            <div 
              key={item.title}
              className={`p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 ${cardStyleClass}`}
            >
              
              {/* Card Header & Symbol */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 text-left">
                  {/* Dimension badge */}
                  <span 
                    className="text-[9px] px-2 py-0.5 rounded font-extrabold tracking-widest uppercase border"
                    style={{ 
                      color: item.color, 
                      borderColor: `${item.color}40`,
                      backgroundColor: `${item.color}10`
                    }}
                  >
                    Dimensión: {item.dimension}
                  </span>
                  <h3 className="text-base font-bold font-outfit text-white leading-snug mt-1.5">
                    {item.title}
                  </h3>
                </div>
                
                {/* Adinkra Vector Symbol */}
                <div 
                  className="flex-shrink-0 w-16 h-16 rounded-xl bg-brand-dark/60 border border-white/5 flex items-center justify-center"
                  title={`Símbolo Adinkra: ${item.symbol}`}
                >
                  {getAdinkraSymbolSVG(item.symbol, item.color)}
                </div>
              </div>

              {/* Card Description */}
              <p className="text-xs text-gray-300 leading-relaxed text-left flex-grow">
                {item.description}
              </p>

              {/* Card Footer (Adinkra info) */}
              <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-gray-500 font-sans">
                <span>Adinkra: <span className="font-medium text-gray-400">{item.symbol}</span></span>
                <span className="font-bold uppercase tracking-wider" style={{ color: item.color }}>
                  eje {index + 1}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
