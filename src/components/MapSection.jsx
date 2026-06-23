import React, { useState, useRef } from 'react';
import { Users, MapPin, Building, Search, X, CheckCircle, Award } from 'lucide-react';

export default function MapSection({ mapData, operators }) {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('');
  
  const mapContainerRef = useRef(null);

  // General Statistics
  const totalOperators = operators.length;
  const activeStates = mapData.filter(s => s.operatorCount > 0).length;
  
  // Find state with most operators
  const maxOpsState = mapData.reduce((max, state) => 
    state.operatorCount > max.operatorCount ? state : max, 
    { displayName: 'Ninguno', operatorCount: 0 }
  );

  // Calculate total unique municipalities represented
  const allMuns = new Set(operators.map(o => o.municipio));
  const totalMunicipalities = allMuns.size;

  // Handle Map Hover
  const handleMouseMove = (e) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      // Position tooltip relative to container
      setTooltipPos({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top - 20
      });
    }
  };

  // Color Coding Scale (Choropleth)
  const getStateFill = (count) => {
    if (count === 0) return 'rgba(38, 30, 48, 0.45)'; // Neutral dark purple-gray
    if (count <= 2) return 'rgba(107, 1, 127, 0.3)';   // Brand Purple 30%
    if (count <= 4) return 'rgba(107, 1, 127, 0.55)';  // Brand Purple 55%
    if (count <= 6) return 'rgba(107, 1, 127, 0.8)';   // Brand Purple 80%
    return '#6B017F';                                   // Brand Purple 100%
  };

  // Get active operators for selected state
  const currentStateData = mapData.find(s => s.id === selectedState);
  const stateOperators = currentStateData ? currentStateData.operators : [];

  // Filter state operators
  const filteredOperators = stateOperators.filter(op => {
    const matchesSearch = op.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         op.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (op.profesion && op.profesion.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMun = municipalityFilter === '' || op.municipio === municipalityFilter;
    return matchesSearch && matchesMun;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      
      {/* 1. Dashboard KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-brand-purple/20 flex items-center gap-4 hover:border-brand-purple/40 transition-all duration-300">
          <div className="p-3 bg-brand-purple/20 text-brand-yellow rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Total Operadores</div>
            <div className="text-2xl font-bold font-outfit text-white">{totalOperators}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-brand-purple/20 flex items-center gap-4 hover:border-brand-purple/40 transition-all duration-300">
          <div className="p-3 bg-brand-teal/20 text-brand-teal rounded-lg">
            <MapPin size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Estados Activos</div>
            <div className="text-2xl font-bold font-outfit text-white">{activeStates} <span className="text-xs text-gray-500 font-sans">/ 23</span></div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-brand-purple/20 flex items-center gap-4 hover:border-brand-purple/40 transition-all duration-300">
          <div className="p-3 bg-brand-yellow/20 text-brand-yellow rounded-lg">
            <Building size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Municipios Abordados</div>
            <div className="text-2xl font-bold font-outfit text-white">{totalMunicipalities}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-brand-purple/20 flex items-center gap-4 hover:border-brand-purple/40 transition-all duration-300">
          <div className="p-3 bg-brand-red/20 text-brand-red rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Máxima Densidad</div>
            <div className="text-base font-bold font-outfit text-white truncate max-w-[140px]" title={maxOpsState.displayName}>
              {maxOpsState.displayName} ({maxOpsState.operatorCount} ops)
            </div>
          </div>
        </div>

      </div>

      {/* 2. Interactive Map Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Map Container (7 Columns) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-brand-purple/10 flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-white m-0">Distribución Territorial Nacional</h2>
              <p className="text-xs text-gray-400">Haz clic en un estado para ver los operadores locales y detalles municipales.</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-1.5 bg-brand-dark/40 px-3 py-1.5 rounded-lg border border-white/5 text-[10px]">
              <span className="text-gray-400">Densidad:</span>
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: 'rgba(38, 30, 48, 0.45)' }} title="0"></span>
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: 'rgba(107, 1, 127, 0.3)' }} title="1-2"></span>
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: 'rgba(107, 1, 127, 0.55)' }} title="3-4"></span>
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: 'rgba(107, 1, 127, 0.8)' }} title="5-6"></span>
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: '#6B017F' }} title="7-8"></span>
            </div>
          </div>

          {/* SVG Map Render */}
          <div 
            ref={mapContainerRef} 
            onMouseMove={handleMouseMove}
            className="relative w-full max-w-[650px] aspect-[4/3] flex items-center justify-center cursor-default select-none"
          >
            <svg 
              viewBox="0 0 800 600" 
              className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            >
              <defs>
                <pattern 
                  id="diagonalHatch" 
                  width="10" 
                  height="10" 
                  patternTransform="rotate(45 0 0)" 
                  patternUnits="userSpaceOnUse"
                >
                  <line 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="10" 
                    stroke="rgba(255, 255, 255, 0.25)" 
                    strokeWidth="1.5" 
                  />
                </pattern>
              </defs>
              {mapData.map((state) => {
                const isActive = selectedState === state.id;
                const isHovered = hoveredState?.id === state.id;
                const isEsequibo = state.id === 'VE-Esequibo';
                
                return (
                  <g key={state.id}>
                    <path
                      d={state.path}
                      fill={isActive ? '#17A492' : isHovered ? 'rgba(23, 164, 146, 0.7)' : getStateFill(state.operatorCount)}
                      stroke={isActive ? '#ffffff' : isHovered ? '#FFBF1B' : 'rgba(255, 255, 255, 0.15)'}
                      strokeWidth={isActive ? 2.5 : isHovered ? 2.0 : 1.2}
                      className="transition-all duration-300 cursor-pointer origin-center"
                      onClick={() => {
                        setSelectedState(state.id === selectedState ? null : state.id);
                        setSearchQuery('');
                        setMunicipalityFilter('');
                      }}
                      onMouseEnter={() => setHoveredState(state)}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {isEsequibo && (
                      <path
                        d={state.path}
                        fill="url(#diagonalHatch)"
                        pointerEvents="none"
                        className="transition-all duration-300"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Map Hover Tooltip */}
            {hoveredState && (
              <div 
                style={{ 
                  position: 'absolute', 
                  left: `${tooltipPos.x}px`, 
                  top: `${tooltipPos.y}px`,
                  pointerEvents: 'none'
                }}
                className="bg-brand-dark/95 border border-brand-teal/40 text-white rounded-lg shadow-xl shadow-black/60 px-3.5 py-2.5 z-40 text-xs min-w-[180px] backdrop-blur-md animate-fade-in"
              >
                <div className="font-bold text-sm text-brand-yellow font-outfit border-b border-white/10 pb-1 mb-1.5 flex items-center justify-between">
                  <span>{hoveredState.displayName}</span>
                  {hoveredState.operatorCount > 0 ? (
                    <span className="bg-brand-teal/20 text-brand-teal px-1.5 py-0.5 rounded text-[10px] font-sans font-medium">Activo</span>
                  ) : hoveredState.id === 'VE-Esequibo' ? (
                    <span className="bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 rounded text-[10px] font-sans font-medium">Reclamación</span>
                  ) : null}
                </div>
                <div className="space-y-1">
                  {hoveredState.id === 'VE-Esequibo' ? (
                    <div className="text-[10px] text-gray-300 leading-normal">
                      Territorio sujeto al Acuerdo de Ginebra del 17 de febrero de 1966.
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-gray-300">
                        <span>Operadores:</span>
                        <span className="font-bold text-white">{hoveredState.operatorCount}</span>
                      </div>
                      {hoveredState.operatorCount > 0 && (
                        <div className="text-[10px] text-gray-400 mt-1 border-t border-white/5 pt-1.5">
                          <div className="font-semibold mb-0.5">Municipios:</div>
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {Object.keys(hoveredState.municipalities).slice(0, 3).map(m => (
                              <span key={m} className="bg-white/5 px-1 py-0.2 rounded text-[8px] truncate">{m}</span>
                            ))}
                            {Object.keys(hoveredState.municipalities).length > 3 && (
                              <span className="text-[8px] text-gray-500 font-sans">+{Object.keys(hoveredState.municipalities).length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Side Panel (5 Columns) */}
        <div className="lg:col-span-5 h-full">
          {currentStateData ? (
            <div className="glass-panel p-6 rounded-2xl border border-brand-teal/20 flex flex-col space-y-4 max-h-[650px] overflow-y-auto animate-slide-in">
              
              {/* Header Details */}
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] tracking-widest text-brand-teal uppercase font-bold">
                    {currentStateData.id === 'VE-Esequibo' ? 'Zona en Reclamación' : 'Estado Seleccionado'}
                  </div>
                  <h3 className="text-2xl font-bold font-outfit text-white m-0 leading-tight">{currentStateData.displayName}</h3>
                  {currentStateData.id !== 'VE-Esequibo' && (
                    <p className="text-xs text-gray-400 mt-0.5">{currentStateData.operatorCount} operadores locales activos</p>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setSelectedState(null);
                    setSearchQuery('');
                    setMunicipalityFilter('');
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {currentStateData.id === 'VE-Esequibo' ? (
                <div className="space-y-4 py-2 text-xs text-gray-300 leading-relaxed">
                  <div className="p-3.5 bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl flex gap-3 text-brand-yellow">
                    <MapPin className="shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="font-bold block text-sm mb-0.5">Soberanía Nacional</span>
                      Territorio de la Guayana Esequiba, sujeto al Acuerdo de Ginebra del 17 de febrero de 1966.
                    </div>
                  </div>
                  <p>
                    La Guayana Esequiba es una región que forma parte indisoluble de la soberanía nacional de la República Bolivariana de Venezuela, sobre la cual el Estado ejerce un reclamo histórico y legítimo amparado bajo el derecho internacional.
                  </p>
                  <p>
                    De acuerdo con los lineamientos institucionales de **CONADECAFRO**, el territorio es considerado de forma integral en la cartografía nacional, reafirmando el compromiso con la defensa y soberanía territorial de Venezuela.
                  </p>
                  <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500">
                    <span className="font-semibold block uppercase tracking-wider mb-1">Estatus del Territorio</span>
                    Sujeto al control de facto y la administración de Guyana en espera de una resolución amistosa, pacífica y satisfactoria para ambas partes conforme al Acuerdo de Ginebra.
                  </div>
                </div>
              ) : currentStateData.operatorCount > 0 ? (
                <>
                  {/* Municipality list Badges */}
                  <div>
                    <h4 className="text-xs text-gray-300 font-bold uppercase mb-2 tracking-wide">Municipios Cobertura</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setMunicipalityFilter('')}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${
                          municipalityFilter === '' 
                            ? 'bg-brand-teal text-white font-semibold' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        Todos ({currentStateData.operatorCount})
                      </button>
                      {Object.entries(currentStateData.municipalities).map(([mun, count]) => (
                        <button
                          key={mun}
                          onClick={() => setMunicipalityFilter(mun)}
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${
                            municipalityFilter === mun
                              ? 'bg-brand-teal text-white font-semibold'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {mun} ({count})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filters / Search Bar */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar por nombre, cargo o profesión..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-brand-dark/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>

                  {/* Operators List Table */}
                  <div className="space-y-3">
                    <h4 className="text-xs text-gray-300 font-bold uppercase tracking-wide">Fichas de Operadores ({filteredOperators.length})</h4>
                    
                    {filteredOperators.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {filteredOperators.map((op) => (
                          <div 
                            key={op.cedula}
                            className="p-3 bg-brand-dark/40 border border-white/5 rounded-xl hover:border-brand-teal/20 transition-all flex flex-col space-y-1"
                          >
                            <div className="flex justify-between items-start">
                              <h5 className="text-sm font-bold font-outfit text-white truncate max-w-[200px]" title={op.nombre}>
                                {op.nombre}
                              </h5>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                op.sexo === 'F' ? 'bg-purple-950 text-purple-400 border border-purple-800/30' : 'bg-blue-950 text-blue-400 border border-blue-800/30'
                              }`}>
                                {op.sexo === 'F' ? 'Femenino' : 'Masculino'}
                              </span>
                            </div>
                            
                            <div className="text-[10px] text-brand-yellow font-medium truncate">{op.cargo}</div>
                            
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 mt-1 border-t border-white/5 pt-1.5">
                              <div>
                                <span className="font-semibold text-gray-500">Municipio:</span> <span className="text-gray-300">{op.municipio}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-500">Parroquia:</span> <span className="text-gray-300 truncate inline-block max-w-[100px] align-bottom" title={op.parroquia}>{op.parroquia}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-500">Edad:</span> <span className="text-gray-300">{op.edad} años</span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-500 font-sans">Nivel:</span> <span className="text-gray-300 font-semibold text-[8px] uppercase">{op.nivelAcademico}</span>
                              </div>
                            </div>
                            
                            {op.profesion && op.profesion !== 'Bachiller' && (
                              <div className="text-[9px] text-brand-teal italic mt-1 font-sans">
                                {op.profesion}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-xs text-gray-500">
                        No se encontraron operadores con los criterios de búsqueda.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 space-y-2">
                  <div className="text-sm font-semibold">Sin Operadores Registrados</div>
                  <p className="text-xs text-gray-600">Este estado no cuenta actualmente con operadores locales activos en el diagnóstico de CONADECAFRO.</p>
                </div>
              )}

            </div>
          ) : (
            /* Idle Panel (No state selected) */
            <div className="glass-panel p-8 rounded-2xl border border-brand-purple/10 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-yellow animate-pulse">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold font-outfit text-white m-0">Consulta Territorial Activa</h3>
              <p className="text-xs text-gray-400 max-w-[280px] leading-relaxed">
                Selecciona cualquier estado en el mapa para cargar las métricas locales y la nómina de operadores locales asignados a la entidad.
              </p>
              
              <div className="w-full border-t border-white/5 pt-4 text-left max-w-xs space-y-2 text-[10px] text-gray-500">
                <div className="font-bold uppercase tracking-wider text-gray-400 mb-1 text-center">Resumen de Cobertura</div>
                <div className="flex justify-between">
                  <span>Estados con Personal:</span>
                  <span className="text-white font-bold">{activeStates}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estados sin Cobertura:</span>
                  <span className="text-white font-bold">{23 - activeStates}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5 font-bold">
                  <span>Total Operadores Cruzados:</span>
                  <span className="text-brand-yellow">{totalOperators} de 55</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
