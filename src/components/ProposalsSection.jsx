import React, { useState } from 'react';
import { CheckCircle2, Circle, HelpCircle, GraduationCap, Laptop, Award, Users, Shirt, BookOpen, CreditCard } from 'lucide-react';

export default function ProposalsSection({ proposals }) {
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper to resolve Lucide Icon for proposal category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Cultura Organizacional':
        return <Users size={18} />;
      case 'Logística y Dotación':
        return <Shirt size={18} />;
      case 'Recursos Humanos':
        return <CreditCard size={18} />;
      case 'Motivación':
        return <Award size={18} />;
      case 'Formación':
        return <BookOpen size={18} />;
      case 'Tecnología':
        return <Laptop size={18} />;
      default:
        return <HelpCircle size={18} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-2">
      
      {/* 1. Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold font-outfit text-white">Plan de Propuestas e Hitos Institucionales</h2>
        <p className="text-sm text-gray-400">
          Línea de ruta estructurada con las acciones inmediatas y mediano plazo para optimizar la operatividad del personal en los territorios.
        </p>
      </div>

      {/* 2. Interactive Roadmap (Timeline) */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:inset-y-0 before:left-[17px] before:md:left-[27px] before:w-[2px] before:bg-white/10">
        {proposals.map((prop, index) => {
          const isDone = completedSteps[index];
          const isTech = prop.category === 'Tecnología';
          const indicatorColor = isTech ? '#C6321E' : prop.color || '#6B017F';
          
          return (
            <div 
              key={prop.title}
              className="relative flex flex-col md:flex-row gap-4 items-start text-left group transition-all duration-300"
            >
              
              {/* Checkbox Trigger Indicator */}
              <button
                onClick={() => toggleStep(index)}
                className="absolute -left-[30px] md:-left-[46px] top-1.5 z-10 w-[24px] h-[24px] md:w-[32px] md:h-[32px] rounded-full bg-brand-dark border-2 flex items-center justify-center transition-all duration-300 focus:outline-none"
                style={{ 
                  borderColor: isDone ? '#17A492' : indicatorColor,
                  color: isDone ? '#17A492' : '#ffffff' 
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} className="text-brand-teal fill-brand-teal/20" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: indicatorColor }}></span>
                )}
              </button>

              {/* Card Container */}
              <div 
                className={`w-full p-5 rounded-2xl glass-panel border transition-all duration-300 flex-grow ${
                  isDone 
                    ? 'border-brand-teal/30 bg-brand-teal/5 opacity-75' 
                    : 'border-white/5 hover:border-white/20'
                }`}
                style={{
                  borderLeft: isDone ? '4px solid #17A492' : `4px solid ${indicatorColor}`
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[9px] px-2 py-0.5 rounded font-extrabold tracking-widest uppercase border"
                      style={{ 
                        color: indicatorColor, 
                        borderColor: `${indicatorColor}30`,
                        backgroundColor: `${indicatorColor}10`
                      }}
                    >
                      {prop.category}
                    </span>
                    <span className="text-[9px] text-gray-500 font-sans">Paso {index + 1} de {proposals.length}</span>
                  </div>
                  
                  {/* Category icon */}
                  <div 
                    className="w-8 h-8 rounded-lg bg-brand-dark/60 border border-white/5 flex items-center justify-center"
                    style={{ color: indicatorColor }}
                  >
                    {getCategoryIcon(prop.category)}
                  </div>
                </div>

                <h3 className={`text-base font-bold font-outfit m-0 leading-snug ${isDone ? 'line-through text-gray-400' : 'text-white'}`}>
                  {prop.title}
                </h3>
                
                <p className="text-xs text-gray-300 leading-relaxed mt-2">
                  {prop.description}
                </p>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-[10px]">
                  <span className="text-gray-500 font-sans">Acción de refuerzo territorial</span>
                  <button 
                    onClick={() => toggleStep(index)}
                    className={`font-semibold transition-colors focus:outline-none ${
                      isDone ? 'text-gray-400 hover:text-white' : 'text-brand-teal hover:text-brand-teal-light'
                    }`}
                  >
                    {isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
