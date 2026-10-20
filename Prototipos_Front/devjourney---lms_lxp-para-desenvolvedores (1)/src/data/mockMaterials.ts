import { LearningMaterial } from '../types/lms';

export const MOCK_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-1',
    title: 'Guia Definitivo de Git & Commits Semânticos',
    category: 'Cheat Sheet',
    trackSlug: 'dev-do-zero-ao-junior',
    moduleName: 'Git, GitHub & Versionamento em Time',
    readTimeMinutes: 8,
    description: 'Resumo com os principais comandos do Git, convenções de commits convencionais (feat, fix, refactor) e guia passo a passo para resolver conflitos.',
    downloadUrl: '#',
    githubUrl: 'https://github.com/conventional-changelog/commitlint',
    markdownContent: `# Cheat Sheet: Git & Commits Semânticos

O padrão Conventional Commits estabelece regras para mensagens de commit estruturadas, facilitando a automação de versões semânticas (SemVer).

## Anatomia do Commit
\`\`\`text
<tipo>[escopo opcional]: <descrição concisa no presente>

[corpo opcional explicando o motivo da mudança]

[rodapé opcional: BREAKING CHANGE ou referências a issues]
\`\`\`

## Prefixos Mais Comuns
- **feat**: Nova funcionalidade para o usuário final
- **fix**: Correção de bug no código de produção
- **refactor**: Alteração de código que não adiciona recurso nem corrige bug (melhoria estrutural)
- **style**: Formatação, ponto e vírgula, espaços (sem impacto na execução)
- **test**: Adição ou refatoração de testes automatizados
- **chore**: Mudanças na configuração de build, dependências ou ferramentas de CI
- **docs**: Alteração exclusiva em documentações (README, etc.)

## Comandos Essenciais do Dia a Dia
\`\`\`bash
# Desfazer o último commit mantendo as alterações em stage
git reset --soft HEAD~1

# Guardar modificações temporárias sem comitar
git stash push -m "ajuste temporário na navbar"
git stash pop

# Visualizar o grafo de branches limpo no terminal
git log --oneline --graph --decorate --all
\`\`\`
`
  },
  {
    id: 'mat-2',
    title: 'CSS Flexbox & Grid: Guia Visual de Sintaxe Rápida',
    category: 'Cheat Sheet',
    trackSlug: 'dev-do-zero-ao-junior',
    moduleName: 'HTML Semântico & CSS Moderno Responsivo',
    readTimeMinutes: 6,
    description: 'Tabela comparativa direta entre alinhamento Flexbox e CSS Grid com snippets prontos para centralização perfeita e cards responsivos.',
    downloadUrl: '#',
    markdownContent: `# CSS Flexbox & Grid: Resumo Prático

## 1. Centralização Absoluta Perfeita

### Com CSS Grid (A mais concisa):
\`\`\`css
.container {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
\`\`\`

### Com Flexbox:
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\`

## 2. Grid de Cards Responsivo Sem Media Queries
\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\`
`
  },
  {
    id: 'mat-3',
    title: 'Boilerplate Fullstack: React + Node + TypeScript',
    category: 'Template',
    trackSlug: 'dev-do-zero-ao-junior',
    moduleName: 'Projeto Integrador & Boas Práticas',
    readTimeMinutes: 12,
    description: 'Repositório modelo estruturado com arquitetura limpa, ESLint, Prettier, Tailwind CSS, testes com Vitest e rotas Express tipadas.',
    githubUrl: 'https://github.com',
    markdownContent: `# Arquitetura do Repositório Starter

Estrutura recomendada para o Projeto Integrador Júnior:

\`\`\`text
projeto-fullstack/
├── client/                 # Front-end React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Componentes isolados
│   │   ├── context/        # Estados globais
│   │   ├── hooks/          # Custom hooks reutilizáveis
│   │   └── services/       # Clientes HTTP (fetch / axios)
├── server/                 # Back-end Node.js + Express
│   ├── src/
│   │   ├── controllers/    # Lógica de controle de rotas
│   │   ├── services/       # Regras de negócio
│   │   └── db/             # Schemas e migrações SQL
└── package.json
\`\`\`
`
  },
  {
    id: 'mat-4',
    title: 'Manual de Acessibilidade Web (WCAG 2.2 AA) para Iniciantes',
    category: 'Guia Prático',
    trackSlug: 'dev-do-zero-ao-junior',
    moduleName: 'HTML Semântico & CSS Moderno Responsivo',
    readTimeMinutes: 10,
    description: 'Checklist com as 10 regras essenciais de acessibilidade que os entrevistadores cobram em testes técnicos para Desenvolvedores Júnior.',
    markdownContent: `# Checklist de Acessibilidade Front-end

1. **Contraste de Cores**: Relação de no mínimo 4.5:1 para texto normal e 3:1 para texto grande.
2. **Textos Alternativos**: Todo elemento \`<img>\` deve conter \`alt=""\` descritivo ou vazio caso seja puramente decorativo.
3. **Navegação por Teclado**: Todo botão e link deve ter anel de foco visível (\`focus-visible\`).
4. **Semântica Nativa**: Use \`<button>\` para ações e \`<a>\` para navegações de página. Nunca use \`<div onClick>\` sem os devidos atributos ARIA e suporte a teclado.
`
  }
];
