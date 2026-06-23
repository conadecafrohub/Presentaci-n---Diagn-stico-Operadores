import React from 'react';
import { ArrowRight, Map, Heart, BarChart3, ClipboardList } from 'lucide-react';
import SplineScene from './SplineScene';

export default function WelcomeSection({ setActiveTab }) {
  
  const pillars = [
    { title: 'Análisis Territorial', icon: Map, color: 'text-brand-teal bg-brand-teal/10', desc: 'Mapa coroplético interactivo con la densidad de operadores por estado y municipio.' },
    { title: 'Diagnóstico Cualitativo', icon: Heart, color: 'text-brand-purple bg-brand-purple/10', desc: 'Debilidades, fortalezas y sugerencias explicadas bajo las 5 dimensiones culturales de la marca.' },
    { title: 'Estadísticas Demográficas', icon: BarChart3, color: 'text-brand-yellow bg-brand-yellow/10', desc: 'Métricas detalladas de nivel académico, rango de edades y género en gráficos interactivos.' },
    { title: 'Propuestas de Acción', icon: ClipboardList, color: 'text-brand-red bg-brand-red/10', desc: 'Línea de ruta con las propuestas institucionales para el fortalecimiento territorial.' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh] max-w-7xl mx-auto px-4 py-4 animate-fade-in">
      
      {/* Left Column: Presentation overview */}
      <div className="lg:col-span-6 space-y-6 text-left">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-teal font-extrabold border border-brand-teal/30 bg-brand-teal/5 px-2.5 py-1 rounded-full">
            Diagnóstico Nacional 2026
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-outfit text-white leading-tight">
            Operadores y Operadoras <span className="text-brand-yellow">Locales</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-brand-purple font-bold">
            CONADECAFRO • Identidad y Gestión de Territorio
          </p>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
          Esta plataforma centraliza los resultados del diagnóstico nacional de los operadores locales de CONADECAFRO. Está diseñada siguiendo las pautas oficiales de identidad visual y principios del Decenio Internacional para los Afrodescendientes, proyectando datos clave para el fortalecimiento de la estructura comunitaria.
        </p>

        {/* 4 Pillars Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-4 rounded-xl bg-brand-dark/40 border border-white/5 flex gap-3 hover:border-brand-purple/20 transition-all duration-300">
                <div className={`p-2 h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${p.color}`}>
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white font-outfit">{p.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-normal">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-2 px-6 py-3 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purple/80 hover:shadow-lg hover:shadow-brand-purple/30 transition-all group focus:outline-none"
          >
            <span>Explorar Diagnóstico Territorial</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Right Column: Centered Vertical Portrait Card */}
      <div className="lg:col-span-6 h-[400px] md:h-[500px] w-full flex items-center justify-center relative">
        
        {/* Glowing Background Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-brand-teal/10 blur-[80px] rounded-full pointer-events-none z-0"></div>

        {/* Narrower and taller portrait card for the standing character */}
        <div className="w-[300px] h-[460px] glass-panel rounded-3xl border border-brand-purple/15 overflow-hidden shadow-2xl shadow-black/90 relative group">
          {/* 3D Spline Scene */}
          <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
            <SplineScene 
              scene="https://prod.spline.design/HrIm7NxLsgR5ntls/scene.splinecode" 
            />
          </div>
        </div>

      </div>

    </div>
  );
}
