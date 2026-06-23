const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = path.join(__dirname, '..', 'Diagnostico - Operadores Locales', 'INFORMACIÓN DE OPERADORES PARA ATA.xlsx');
const svgPathsPath = 'C:\\Users\\guill\\.gemini\\antigravity\\brain\\5e417aee-a07d-47df-9144-65ea8306056c\\scratch\\venezuela_svg_paths.json';
const outputDir = path.join(__dirname, '..', 'src', 'data');
const outputPath = path.join(outputDir, 'data.json');

console.log('Reading Excel file from:', excelPath);
if (!fs.existsSync(excelPath)) {
  console.error('Excel file not found!');
  process.exit(1);
}

console.log('Reading SVG paths from:', svgPathsPath);
if (!fs.existsSync(svgPathsPath)) {
  console.error('SVG paths file not found!');
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets['PERSONAL ACTIVO'];
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const operators = [];
// Parse operators list (starts at row index 3, headers are index 2)
for (let i = 3; i < rawData.length; i++) {
  const row = rawData[i];
  if (!row || row[0] === undefined || row[0] === null || row[0] === '') {
    continue;
  }
  const num = parseInt(row[0]);
  if (isNaN(num)) {
    continue; // Skip footer / summary rows
  }
  
  const op = {
    num: num,
    cedula: row[1],
    nombre: row[2] ? row[2].toString().trim() : '',
    cargo: row[3] ? row[3].toString().trim() : '',
    conceptos: row[4] ? row[4].toString().trim() : '',
    tareas: row[5] ? row[5].toString().trim() : '',
    estado: row[6] ? row[6].toString().trim() : '',
    municipio: row[7] ? row[7].toString().trim() : '',
    parroquia: row[8] ? row[8].toString().trim() : '',
    edad: row[9] ? parseInt(row[9]) : null,
    sexo: row[10] ? row[10].toString().trim().toUpperCase() : '',
    nivelAcademico: row[11] ? row[11].toString().trim() : '',
    profesion: row[12] ? row[12].toString().trim() : '',
  };
  
  // Normalize gender character
  if (op.sexo === 'F' || op.sexo === 'FEMENINO') op.sexo = 'F';
  if (op.sexo === 'M' || op.sexo === 'MASCULINO') op.sexo = 'M';
  
  operators.push(op);
}

console.log(`Successfully parsed ${operators.length} operators from Excel.`);

// Load pre-projected SVG paths
const svgPaths = JSON.parse(fs.readFileSync(svgPathsPath, 'utf8'));

// Helper to normalize strings for comparison (remove accents, lowercase, trim)
function normalizeString(str) {
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim();
}

// Map of Excel state names to SVG paths IDs
const stateNameToId = {
  'amazonas': 'VE-Z',
  'anzoategui': 'VE-B',
  'apure': 'VE-C',
  'aragua': 'VE-D',
  'carabobo': 'VE-G',
  'cojedes': 'VE-H',
  'distrito capital': 'VE-A',
  'falcon': 'VE-I',
  'guarico': 'VE-J',
  'la guaira': 'VE-X', // La Guaira is Vargas (VE-X) in GeoJSON
  'vargas': 'VE-X',
  'lara': 'VE-K',
  'miranda': 'VE-M',
  'monagas': 'VE-N',
  'merida': 'VE-L',
  'nueva esparta': 'VE-O',
  'portuguesa': 'VE-P',
  'sucre': 'VE-R',
  'trujillo': 'VE-T',
  'yaracuy': 'VE-U',
  'zulia': 'VE-V'
};

// Group operators by state
const operatorsByState = {};
operators.forEach(op => {
  const normState = normalizeString(op.estado);
  const stateId = stateNameToId[normState];
  
  if (!stateId) {
    console.warn(`Could not map state: "${op.estado}" (normalized: "${normState}")`);
    return;
  }
  
  if (!operatorsByState[stateId]) {
    operatorsByState[stateId] = [];
  }
  operatorsByState[stateId].push(op);
});

// Compile map data
const mapData = svgPaths.map(statePath => {
  const stateId = statePath.id;
  const stateOps = operatorsByState[stateId] || [];
  
  // Calculate municipality counts
  const municipalities = {};
  stateOps.forEach(op => {
    const mun = op.municipio || 'Desconocido';
    municipalities[mun] = (municipalities[mun] || 0) + 1;
  });
  
  // Custom display name to handle Vargas -> La Guaira
  let displayName = statePath.name;
  if (stateId === 'VE-X') {
    displayName = 'La Guaira';
  } else if (stateId === 'VE-B') {
    displayName = 'Anzoátegui';
  } else if (stateId === 'VE-J') {
    displayName = 'Guárico';
  } else if (stateId === 'VE-L') {
    displayName = 'Mérida';
  } else if (stateId === 'VE-O') {
    displayName = 'Nueva Esparta';
  }
  
  return {
    id: stateId,
    name: statePath.name,
    displayName: displayName,
    path: statePath.path,
    operatorCount: stateOps.length,
    municipalities: municipalities,
    operators: stateOps.map(op => ({
      cedula: op.cedula,
      nombre: op.nombre,
      cargo: op.cargo,
      municipio: op.municipio,
      parroquia: op.parroquia,
      edad: op.edad,
      sexo: op.sexo,
      nivelAcademico: op.nivelAcademico,
      profesion: op.profesion
    }))
  };
});

// Build demographic metrics
// We hardcode the exact percentages requested in the prompt, which match the PPTX
const demographics = {
  instruction: [
    { name: 'Bachilleres', value: 36.4, count: 20 },
    { name: 'Universitarios', value: 45.5, count: 25 },
    { name: 'TSU', value: 6.8, count: 4 },
    { name: 'Especialistas', value: 6.8, count: 4 },
    { name: 'Magister', value: 4.5, count: 2 }
  ],
  age: [
    { name: '20 - 30 años', value: 20.5, count: 11 },
    { name: '31 - 40 años', value: 27.3, count: 15 },
    { name: '41 - 50 años', value: 29.5, count: 16 },
    { name: '51 - 60 años', value: 9.1, count: 5 },
    { name: '61 - 70 años', value: 13.6, count: 8 }
  ],
  gender: [
    // Visual values are normalized to 100% (Mujeres: 55.1%, Hombres: 44.9% based on 56.8 / 103 and 46.2 / 103)
    // originalValue is kept to print on the label
    { name: 'Mujeres', value: 55.1, originalValue: 56.8, count: 31 },
    { name: 'Hombres', value: 44.9, originalValue: 46.2, count: 24 }
  ]
};

// Build qualitative diagnostic content from PPTX extracts
const qualitative = {
  weaknesses: [
    {
      title: 'Recursos y Logística Insuficientes',
      dimension: 'DESARROLLO',
      color: '#C6321E', // Red
      symbol: 'Ayúdame y deja que te ayude',
      description: 'Se refiere a la carencia de elementos fundamentales para la operatividad diaria, como equipos tecnológicos (computadoras, teléfonos), acceso a internet, transporte para el trabajo territorial, y materiales de oficina necesarios para llevar a cabo las tareas de manera eficiente.'
    },
    {
      title: 'Desafíos en la Coordinación y Comunicación',
      dimension: 'RECONOCIMIENTO',
      color: '#17A492', // Teal
      symbol: 'La tela de la araña',
      description: 'Abarca los problemas relacionados con el flujo de información dentro de la estructura de CONADECAFRO y entre sus diferentes niveles o coordinaciones. También incluye la falta de claridad en las directrices, la comunicación tardía o ineficaz, y las dificultades para trabajar de manera sincronizada.'
    },
    {
      title: 'Problemas en las Relaciones Interinstitucionales y Comunitarias',
      dimension: 'INCLUSIÓN',
      color: '#FFBF1B', // Yellow
      symbol: 'Cocodrilos siameses',
      description: 'Describe los obstáculos que surgen al interactuar con otras organizaciones gubernamentales (alcaldías, gobernaciones), instituciones locales y la comunidad en general. Esto puede incluir falta de colaboración, desconfianza, resistencia o dificultades para lograr la participación y el apoyo necesarios para las iniciativas.'
    },
    {
      title: 'Necesidades de Formación y Conocimiento',
      dimension: 'JUSTICIA',
      color: '#6B017F', // Purple
      symbol: 'Cuernos de carnero',
      description: 'Se centra en la falta de capacitación específica o el conocimiento insuficiente en áreas relevantes para el desempeño de las funciones. Esto puede incluir temas técnicos de las coordinaciones sustantivas, manejo de herramientas o comprensión de políticas y procedimientos.'
    },
    {
      title: 'Factores Políticos y Sociales Internos',
      dimension: 'PAZ',
      color: '#CCCCCC', // Gray
      symbol: 'Verja, valla',
      description: 'Engloba las dificultades que se originan en el entorno político local o en las dinámicas sociales dentro de las comunidades. Esto puede incluir la influencia de intereses políticos, conflictos internos en la comunidad o la falta de apoyo de ciertos actores clave.'
    }
  ],
  strengths: [
    {
      title: 'Conocimiento y Conexión Territorial',
      dimension: 'RECONOCIMIENTO',
      color: '#17A492',
      symbol: 'La tela de la araña',
      description: 'Destaca la familiaridad profunda con el área geográfica de trabajo, la comprensión de sus dinámicas sociales and culturales, y las relaciones establecidas con líderes y miembros de la comunidad. Esto facilita el acceso y la efectividad del trabajo.'
    },
    {
      title: 'Habilidades Interpersonales y Liderazgo',
      dimension: 'INCLUSIÓN',
      color: '#FFBF1B',
      symbol: 'Cocodrilos siameses',
      description: 'Se refiere a la capacidad de establecer relaciones positivas y efectivas con las personas, incluyendo carisma, empatía, habilidades de comunicación y la capacidad de motivar, guiar e influir en otros para lograr objetivos comunes.'
    },
    {
      title: 'Experiencia y Compromiso Profesional',
      dimension: 'JUSTICIA',
      color: '#6B017F',
      symbol: 'Cuernos de carnero',
      description: 'Resalta la trayectoria laboral previa, el conocimiento adquirido a través de la experiencia y el nivel de dedicación, responsabilidad y compromiso personal con la misión y los objetivos de CONADECAFRO.'
    },
    {
      title: 'Adaptabilidad y Recursos Personales',
      dimension: 'DESARROLLO',
      color: '#C6321E',
      symbol: 'Ayúdame y deja que te ayude',
      description: 'Subraya la flexibilidad para ajustarse a diferentes situaciones y desafíos, así como las cualidades individuales valiosas como la perseverancia, la creatividad, la organización y el conocimiento cultural afrodescendiente que contribuyen al desempeño del rol.'
    },
    {
      title: 'Uso de Herramientas de Comunicación',
      dimension: 'PAZ',
      color: '#CCCCCC',
      symbol: 'Verja, valla',
      description: 'Enfatiza la habilidad para utilizar diversos medios y tecnologías de la comunicación, especialmente digitales (redes sociales, grupos de mensajería), para difundir información, coordinar actividades y mantener el contacto con las comunidades y otros actores.'
    }
  ],
  suggestions: [
    {
      title: 'Asignación de Recursos Esenciales',
      dimension: 'DESARROLLO',
      color: '#C6321E',
      symbol: 'Ayúdame y deja que te ayude',
      description: 'Agrupa las peticiones directas de elementos necesarios para mejorar el trabajo, como equipos tecnológicos (computadoras, teléfonos), apoyo económico para traslados, materiales de oficina, uniformes y otras herramientas logísticas.'
    },
    {
      title: 'Mejora de la Comunicación y Articulación',
      dimension: 'RECONOCIMIENTO',
      color: '#17A492',
      symbol: 'La tela de la araña',
      description: 'Incluye las sugerencias para optimizar el flujo de información entre los diferentes niveles de CONADECAFRO y con otras instituciones, así como para fortalecer la colaboración y el trabajo conjunto.'
    },
    {
      title: 'Desarrollo Profesional y Formación',
      dimension: 'JUSTICIA',
      color: '#6B017F',
      symbol: 'Cuernos de carnero',
      description: 'Abarca las propuestas relacionadas con la necesidad de capacitación continua, talleres, diplomados o cualquier otra iniciativa que contribuya al crecimiento profesional y la adquisición de nuevos conocimientos y habilidades.'
    },
    {
      title: 'Optimización de la Operatividad y Estructura',
      dimension: 'PAZ',
      color: '#CCCCCC',
      symbol: 'Verja, valla',
      description: 'Contiene las ideas para mejorar la organización interna del programa, la definición de procesos, la distribución de tareas y la creación de estructuras de apoyo más eficientes (como oficinas locales o equipos de trabajo por estado).'
    },
    {
      title: 'Adaptar las estrategias para el Trabajo Comunitario',
      dimension: 'INCLUSIÓN',
      color: '#FFBF1B',
      symbol: 'Cocodrilos siameses',
      description: 'Reúne las sugerencias específicas para abordar de manera más efectiva a las comunidades, incluyendo la difusión de información sobre CONADECAFRO, la mejora de la receptividad y la adaptación de las metodologías de trabajo a las realidades locales.'
    }
  ]
};

// Build proposals list
const proposals = [
  {
    category: 'Cultura Organizacional',
    title: 'Jornadas de Acompañamiento Territorial',
    color: '#6B017F', // Purple (Justicia)
    description: 'Realizar unas jornadas de acompañamiento a las Operadoras y Operadores en los territorios donde se haga énfasis en la Cultura Organizacional de CONADECAFRO.'
  },
  {
    category: 'Logística y Dotación',
    title: 'Entrega de Kits y Franelas Institucionales',
    color: '#17A492', // Teal (Reconocimiento)
    description: 'Entregar Kit de Materiales de Oficina (libretas, lápices, bolígrafos) y continuar con la dotación de Franelas Institucionales para fortalecer el sentido de pertenencia, así como la entrega de Pendones identificativos para visibilizar al consejo en actividades.'
  },
  {
    category: 'Recursos Humanos',
    title: 'Trámites de Personal y Credenciales',
    color: '#FFBF1B', // Yellow (Inclusión)
    description: 'Retomar la entrega del carnet institucional, una carpeta contentiva de constancias de trabajo, contratos laborales y demás documentos asociados al personal que se requiera entregar en sitio.'
  },
  {
    category: 'Motivación',
    title: 'Reconocimiento por Alto Desempeño o Antigüedad',
    color: '#CCCCCC', // Gray (Paz)
    description: 'Elaborar certificados o botones a las Operadoras y Operadores que han cumplido satisfactoriamente con sus actividades para elevar la motivación y el compromiso.'
  },
  {
    category: 'Formación',
    title: 'Refuerzo Técnico del Área Sustantiva',
    color: '#C6321E', // Red (Desarrollo)
    description: 'Solicitar a las Coordinaciones del Área Sustantiva una presentación y/o carpeta contentiva de refuerzo con toda la información necesaria para los encuentros territoriales.'
  },
  {
    category: 'Tecnología',
    title: 'Evaluación para Dotación de Equipos',
    color: '#0f0d13',
    description: 'Realizar una evaluación diagnóstica en sitio para determinar la dotación prioritaria de equipos de computación y/o teléfonos celulares para mejorar la conectividad.'
  }
];

const finalData = {
  operators: operators,
  mapData: mapData,
  demographics: demographics,
  qualitative: qualitative,
  proposals: proposals
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
console.log(`Successfully compiled all diagnostic data. Saved ${mapData.length} states and ${operators.length} operators to: ${outputPath}`);
