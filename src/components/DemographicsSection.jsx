import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function DemographicsSection({ demographics }) {
  
  // Custom Color Palettes from Visual Identity
  const COLORS_5 = ['#6B017F', '#17A492', '#FFBF1B', '#C6321E', '#CCCCCC']; // Purple, Teal, Yellow, Red, Gray
  const COLORS_GENDER = ['#6B017F', '#17A492']; // Purple for women (José Leonardo Chirinos banner representation), Teal for men

  // Custom tooltips
  const CustomTooltipPie = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-dark/95 border border-white/10 p-3 rounded-lg shadow-xl text-xs backdrop-blur-md">
          <div className="font-bold text-white font-outfit mb-1">{data.name}</div>
          <div className="text-brand-yellow">Porcentaje: <span className="font-bold">{data.value}%</span></div>
          <div className="text-gray-400">Cantidad aprox: <span className="font-bold text-white">{data.count} ops</span></div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipGender = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-dark/95 border border-white/10 p-3 rounded-lg shadow-xl text-xs backdrop-blur-md">
          <div className="font-bold text-white font-outfit mb-1">{data.name}</div>
          <div className="text-brand-yellow">Porcentaje: <span className="font-bold">{data.originalValue}%</span></div>
          <div className="text-gray-400">Cantidad aprox: <span className="font-bold text-white">{data.count} ops</span></div>
          <div className="text-[9px] text-gray-500 italic mt-1 font-sans border-t border-white/5 pt-1">
            *Visualización normalizada a base 100%
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBar = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-dark/95 border border-white/10 p-3 rounded-lg shadow-xl text-xs backdrop-blur-md">
          <div className="font-bold text-white font-outfit mb-1">{data.name}</div>
          <div className="text-brand-yellow">Proporción: <span className="font-bold">{data.value}%</span></div>
          <div className="text-gray-400">Cantidad aprox: <span className="font-bold text-white">{data.count} ops</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      
      {/* 1. Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold font-outfit text-white">Métricas Demográficas de Operadores</h2>
        <p className="text-sm text-gray-400">
          Visualización estadística del perfil académico, etario y de género de las operadoras y operadores locales a nivel nacional.
        </p>
      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* A. Nivel de Instrucción (Donut Chart) */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-purple/10 flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="text-base font-bold font-outfit text-white text-left m-0">Nivel de Instrucción</h3>
            <p className="text-xs text-gray-400 text-left mt-0.5">Distribución porcentual por nivel académico alcanzado.</p>
          </div>
          
          <div className="w-full h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={demographics.instruction}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {demographics.instruction.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_5[index % COLORS_5.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipPie />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold font-outfit text-white leading-none">55</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-500 mt-1 font-semibold">Operadores</span>
            </div>
          </div>

          {/* Custom Legend to prevent overlap */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/5 pt-4">
            {demographics.instruction.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS_5[index % COLORS_5.length] }}></span>
                <span className="text-gray-300 truncate font-sans text-[11px]" title={`${entry.name} (${entry.value}%)`}>
                  {entry.name}: <span className="font-bold text-white">{entry.value}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* B. Rangos de Edad (Bar Chart) */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-purple/10 flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="text-base font-bold font-outfit text-white text-left m-0">Rangos de Edad</h3>
            <p className="text-xs text-gray-400 text-left mt-0.5">Distribución de operadores por intervalos etarios.</p>
          </div>
          
          <div className="w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={demographics.age}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17A492" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#17A492" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                  unit="%"
                />
                <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="value" fill="url(#colorAge)" radius={[4, 4, 0, 0]}>
                  {demographics.age.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name.includes('41') || entry.name.includes('31') ? '#17A492' : 'rgba(23, 164, 146, 0.4)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-gray-500 font-sans border-t border-white/5 pt-3 text-left leading-relaxed">
            * Se evidencia que el <span className="text-brand-teal font-bold">56.8%</span> de la población de operadores tiene edades comprendidas entre los <span className="text-white font-bold">31 y 50 años</span>, concentrando la madurez laboral y el relevo generacional en la institución.
          </div>
        </div>

        {/* C. Género (Donut Chart - Normalized to 100%) */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-purple/10 flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="text-base font-bold font-outfit text-white text-left m-0">Distribución de Género</h3>
            <p className="text-xs text-gray-400 text-left mt-0.5">Proporción por género (normalizado visualmente a base 100%).</p>
          </div>
          
          <div className="w-full h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={demographics.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographics.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipGender />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-medium text-gray-400 font-outfit uppercase tracking-wider">Mujeres</span>
              <span className="text-2xl font-extrabold font-outfit text-brand-purple leading-tight mt-0.5">56,8%</span>
            </div>
          </div>

          {/* Legends with original values */}
          <div className="flex justify-around items-center border-t border-white/5 pt-4">
            {demographics.gender.map((entry, index) => (
              <div key={entry.name} className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS_GENDER[index % COLORS_GENDER.length] }}></span>
                  <span className="text-gray-300 font-semibold">{entry.name}</span>
                </div>
                <div className="text-lg font-bold font-outfit text-white">
                  {entry.originalValue}% <span className="text-[10px] text-gray-500 font-sans font-medium">({entry.count} ops)</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-[10px] text-gray-500 font-sans italic text-center leading-relaxed">
            * Nota técnica: Para corregir la redundancia de los porcentajes originales en crudo (103% total), el gráfico renderiza la proporción exacta normalizada (Mujeres 55.1% / Hombres 44.9%), reflejando fielmente la división visual sin alterar los valores oficiales reportados.
          </div>
        </div>

      </div>

    </div>
  );
}
