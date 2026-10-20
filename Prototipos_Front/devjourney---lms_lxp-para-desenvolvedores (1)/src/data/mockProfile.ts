import { Badge, Certificate, HeatmapDay, SkillScore } from '../types/lms';

export const INITIAL_SKILL_SCORES: SkillScore[] = [
  { skill: 'Lógica & Algoritmos', score: 92, fullMark: 100 },
  { skill: 'Git & Versionamento', score: 88, fullMark: 100 },
  { skill: 'HTML & CSS Moderno', score: 75, fullMark: 100 },
  { skill: 'JavaScript & TS', score: 60, fullMark: 100 },
  { skill: 'React & Componentes', score: 45, fullMark: 100 },
  { skill: 'Node.js & APIs', score: 35, fullMark: 100 },
  { skill: 'Bancos de Dados SQL', score: 30, fullMark: 100 },
  { skill: 'Testes & Boas Práticas', score: 25, fullMark: 100 }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Primeiro Código',
    description: 'Completou a primeira lição prática de lógica com sucesso.',
    icon: 'Terminal',
    unlocked: true,
    unlockedAt: '12 de Setembro, 2026',
    progressPercent: 100
  },
  {
    id: 'badge-2',
    name: 'Ofensiva 7 Dias',
    description: 'Manteve 7 dias consecutivos de estudos sem interrupções.',
    icon: 'Flame',
    unlocked: true,
    unlockedAt: '28 de Setembro, 2026',
    progressPercent: 100
  },
  {
    id: 'badge-3',
    name: 'Mestre dos Quizzes',
    description: 'Obteve pontuação perfeita (100%) em pelo menos 2 avaliações.',
    icon: 'Award',
    unlocked: true,
    unlockedAt: '02 de Outubro, 2026',
    progressPercent: 100
  },
  {
    id: 'badge-4',
    name: 'Colaborador Ativo',
    description: 'Fez sua primeira postagem e recebeu 10+ upvotes no Fórum de Dúvidas.',
    icon: 'MessageSquare',
    unlocked: true,
    unlockedAt: '04 de Outubro, 2026',
    progressPercent: 100
  },
  {
    id: 'badge-5',
    name: 'Maratonista Frontend',
    description: 'Conclua todos os módulos voltados à interface (HTML, CSS e React).',
    icon: 'Sparkles',
    unlocked: false,
    progressPercent: 65
  },
  {
    id: 'badge-6',
    name: 'Desenvolvedor Júnior Oficial',
    description: 'Conclua a trilha integralmente e receba o certificado de 120 horas.',
    icon: 'GraduationCap',
    unlocked: false,
    progressPercent: 38
  }
];

// Generate last 112 days (16 weeks x 7 days) of study activity
export function generateMockHeatmap(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const today = new Date('2026-10-05T12:00:00Z');
  
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Seed realistic pattern: active on most weekdays, some weekends, recent 12-day streak
    const dayOfWeek = d.getDay();
    const isRecentStreak = i <= 12; // current active streak
    
    let count = 0;
    let lessons = 0;
    let minutes = 0;
    
    if (isRecentStreak) {
      count = Math.floor(Math.random() * 3) + 2; // 2, 3 or 4
      lessons = count;
      minutes = count * 22;
    } else if (dayOfWeek !== 0 && dayOfWeek !== 6 && Math.random() > 0.25) {
      count = Math.floor(Math.random() * 4) + 1;
      lessons = count;
      minutes = count * 20;
    } else if (Math.random() > 0.6) {
      count = 1;
      lessons = 1;
      minutes = 18;
    }
    
    days.push({
      date: dateStr,
      count,
      lessonsCompleted: lessons,
      minutesSpent: minutes
    });
  }
  
  return days;
}

export const MOCK_CERTIFICATE: Certificate = {
  id: 'CERT-DEV-JR-2026-8941',
  trackTitle: 'Desenvolvedor do Zero ao Júnior',
  studentName: 'Pedro M. Sousa',
  issueDate: '05 de Outubro de 2026',
  totalHours: 120,
  verificationCode: 'DJ-9821-X47-2026',
  skills: [
    'Lógica de Programação',
    'Git & GitHub',
    'HTML5 & CSS3 Responsivo',
    'JavaScript ES6+ & TypeScript',
    'React & Hooks',
    'Node.js & Express RESTful APIs',
    'Bancos de Dados Relacionais SQL',
    'Testes Automatizados & Clean Code'
  ]
};
