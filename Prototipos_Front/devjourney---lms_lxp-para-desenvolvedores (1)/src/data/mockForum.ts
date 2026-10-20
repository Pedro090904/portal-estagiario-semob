import { FAQItem, ForumThread } from '../types/lms';

export const MOCK_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    trackId: 'track-dev-junior',
    moduleId: 'mod-1',
    moduleTitle: 'Lógica de Programação & Algoritmos',
    title: 'Dúvida: Qual a diferença prática entre == e === no JavaScript?',
    authorName: 'Thiago Mendes',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: 'Há 2 horas',
    content: 'Estou resolvendo o exercício do laço while e me deparei com comparações como 5 == "5" dando true. Em quais momentos devemos usar o comparador estrito (===)?',
    tags: ['JavaScript', 'Lógica', 'Boas Práticas'],
    upvotes: 14,
    userHasUpvoted: true,
    commentsCount: 3,
    solved: true,
    comments: [
      {
        id: 'c-1',
        authorName: 'Marcos Instrutor',
        authorRole: 'Instrutor',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        content: 'Excelente dúvida Thiago! Como regra geral na indústria: utilize SEMPRE === (igualdade estrita). O operador == realiza coerção implícita de tipos (type coercion), convertendo "5" para número antes de comparar, o que gera comportamentos bizarros e bugs difíceis de rastrear.',
        createdAt: 'Há 1 hora',
        upvotes: 18,
        isSolution: true
      },
      {
        id: 'c-2',
        authorName: 'Camila Lima',
        authorRole: 'Aluno',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        content: 'Dica extra: o único caso onde alguns usam == é para checar se algo é nulo ou indefinido ao mesmo tempo: "if (x == null)" que pega tanto null quanto undefined.',
        createdAt: 'Há 35 minutos',
        upvotes: 6
      }
    ]
  },
  {
    id: 'thread-2',
    trackId: 'track-dev-junior',
    moduleId: 'mod-2',
    moduleTitle: 'Git, GitHub & Versionamento em Time',
    title: 'Como resolver conflito de merge quando duas pessoas mexeram no mesmo arquivo?',
    authorName: 'Juliana Costa',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    createdAt: 'Ontem',
    content: 'Fiz um pull da main para a minha branch de feature e apareceram os marcadores <<<<<<< HEAD e >>>>>>> main. Qual o procedimento seguro para aceitar as mudanças corretas sem apagar o trabalho do colega?',
    tags: ['Git', 'GitHub', 'Conflitos'],
    upvotes: 21,
    userHasUpvoted: false,
    commentsCount: 2,
    solved: true,
    comments: [
      {
        id: 'c-3',
        authorName: 'Rodrigo Monitor',
        authorRole: 'Monitor',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        content: 'No VS Code, use o assistente interativo "Accept Current Change", "Accept Incoming Change" ou "Accept Both Changes". O passo mais importante: converse com a pessoa que editou aquele trecho para alinharem a lógica antes de comitar a resolução!',
        createdAt: 'Ontem',
        upvotes: 12,
        isSolution: true
      }
    ]
  },
  {
    id: 'thread-3',
    trackId: 'track-dev-junior',
    moduleId: 'mod-3',
    moduleTitle: 'HTML Semântico & CSS Moderno Responsivo',
    title: 'Diferença entre gap no Flexbox e margens nos filhos?',
    authorName: 'Gabriel Nogueira',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    createdAt: 'Há 3 dias',
    content: 'Antigamente o pessoal usava margin-right em tudo e tirava do :last-child. O gap substitui isso 100% hoje em dia?',
    tags: ['CSS', 'Flexbox', 'Tailwind'],
    upvotes: 9,
    userHasUpvoted: false,
    commentsCount: 1,
    solved: false,
    comments: [
      {
        id: 'c-4',
        authorName: 'Lucas Tech',
        authorRole: 'Aluno',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        content: 'Sim! O suporte para "gap" no Flexbox é acima de 98% em todos os navegadores modernos. É muito mais limpo e evita hacks de margens negativas.',
        createdAt: 'Há 2 dias',
        upvotes: 5
      }
    ]
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    moduleId: 'mod-1',
    question: 'Preciso ter computador potente para estudar a trilha de Dev Júnior?',
    answer: 'Não! Para a fase de fundamentos, lógica, HTML, CSS e JavaScript básico, qualquer computador com 4GB de RAM e um navegador moderno é suficiente. Você pode inclusive usar ambientes na nuvem como StackBlitz ou GitHub Codespaces.'
  },
  {
    id: 'faq-2',
    moduleId: 'mod-2',
    question: 'Por que o próximo módulo está bloqueado com um cadeado?',
    answer: 'Nosso sistema de aprendizagem utiliza progressão pedagógica garantida. Cada módulo requer que você conclua as aulas práticas e atinja a pontuação mínima de 70% na avaliação/quiz do módulo anterior.'
  },
  {
    id: 'faq-3',
    moduleId: 'mod-3',
    question: 'Posso refazer um quiz se eu tirar menos de 70%?',
    answer: 'Sim! Você pode revisar os conteúdos e refazer o quiz quantas vezes forem necessárias. Nosso objetivo é o seu domínio das competências (mastery learning).'
  },
  {
    id: 'faq-4',
    moduleId: 'mod-8',
    question: 'Como funciona a emissão do Certificado Profissional?',
    answer: 'Ao completar 100% dos 8 módulos da trilha e passar na avaliação final do Projeto Integrador, o certificado digital é emitido automaticamente com código único de validação e carga horária de 120 horas.'
  }
];
