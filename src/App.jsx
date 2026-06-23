import React, { useState } from 'react';
import Header from './components/Header';
import MapSection from './components/MapSection';
import QualitativeSection from './components/QualitativeSection';
import DemographicsSection from './components/DemographicsSection';
import ProposalsSection from './components/ProposalsSection';
import WelcomeSection from './components/WelcomeSection';

// Import compiled data
import data from './data/data.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, map, qualitative, demographics, proposals

  // Helper to render active section
  const renderActiveSection = () => {
    switch (activeTab) {
      case 'home':
        return <WelcomeSection setActiveTab={setActiveTab} />;
      case 'map':
        return <MapSection mapData={data.mapData} operators={data.operators} />;
      case 'qualitative':
        return <QualitativeSection qualitative={data.qualitative} />;
      case 'demographics':
        return <DemographicsSection demographics={data.demographics} />;
      case 'proposals':
        return <ProposalsSection proposals={data.proposals} />;
      default:
        return <WelcomeSection setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-gray-100 flex flex-col justify-between selection:bg-brand-purple selection:text-white">
      
      <div className="flex-grow flex flex-col">
        {/* Header Navigation */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Dashboard Content Area */}
        <main className="flex-grow py-8 px-4 max-w-7xl mx-auto w-full transition-all duration-300">
          {renderActiveSection()}
        </main>
      </div>

      {/* Institutional Footer */}
      <footer className="bg-brand-dark/95 border-t border-white/5 py-8 px-6 text-center text-xs text-gray-500 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-1 font-bold text-gray-400 font-outfit text-sm">
              <span>conade</span>
              <span className="text-brand-yellow font-extrabold">cafro</span>
            </div>
            <p className="max-w-md text-gray-500 leading-relaxed">
              Plataforma Institucional para la Visualización del Diagnóstico Nacional de Operadores y Operadoras Locales.
            </p>
          </div>
          
          {/* International Decade for People of African Descent reference */}
          <div className="flex flex-col items-center md:items-end gap-1.5">
            <div className="flex gap-2 text-[9px] uppercase tracking-wider text-brand-teal font-extrabold font-outfit">
              <span>Justicia</span>
              <span className="text-gray-700">•</span>
              <span>Reconocimiento</span>
              <span className="text-gray-700">•</span>
              <span>Desarrollo</span>
            </div>
            <p className="text-[9px] text-gray-600">
              Decenio Internacional para los Afrodescendientes • CONADECAFRO © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
