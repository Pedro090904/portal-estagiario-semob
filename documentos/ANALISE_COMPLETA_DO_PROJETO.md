# Análise Completa do Projeto — Azimute Dev / Portal do Estagiário SEMOB

> Documento de engenharia que descreve **pasta a pasta, arquivo a arquivo**, como o projeto está
> construído, como as partes conversam entre si e qual é a lógica completa de funcionamento.
>
> - Repositório: `portal-estagiario-semob`
> - Último commit analisado: `173d1d2 Refact: modulos e manuais`
> - Data da análise: 15/10/2026

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Árvore completa de pastas e arquivos](#2-árvore-completa-de-pastas-e-arquivos)
3. [Arquivos da raiz do projeto](#3-arquivos-da-raiz-do-projeto)
4. [Arquitetura em camadas (o modelo mental)](#4-arquitetura-em-camadas-o-modelo-mental)
5. [Pasta `src/` — ponto de entrada](#5-pasta-src--ponto-de-entrada)
6. [Pasta `src/types/` — contratos](#6-pasta-srctypes--contratos)
7. [Pasta `src/config/` — identidade visual / marca](#7-pasta-srcconfig--identidade-visual--marca)
8. [Pasta `src/content/` — conteúdo pedagógico](#8-pasta-srccontent--conteúdo-pedagógico)
9. [Pasta `src/services/` — dados, persistência e regras puras](#9-pasta-srcservices--dados-persistência-e-regras-puras)
10. [Pasta `src/hooks/` — estado reativo](#10-pasta-srchooks--estado-reativo)
11. [Pasta `src/components/` — componentes reutilizáveis](#11-pasta-srccomponents--componentes-reutilizáveis)
12. [Pasta `src/screens/` — telas](#12-pasta-srcscreens--telas)
13. [Mapa de dependências (quem importa quem)](#13-mapa-de-dependências-quem-importa-quem)
14. [Fluxos completos de funcionamento](#14-fluxos-completos-de-funcionamento)
15. [Modelo de dados persistido (localStorage)](#15-modelo-de-dados-persistido-localstorage)
16. [Regras de negócio (progresso, aprovação, certificado)](#16-regras-de-negócio-progresso-aprovação-certificado)
17. [Pontos de atenção e dívidas técnicas encontradas](#17-pontos-de-atenção-e-dívidas-técnicas-encontradas)
18. [Como estender o projeto](#18-como-estender-o-projeto)
19. [Glossário](#19-glossário)

---

## 1. Visão geral

### 1.1 O que é

Uma **SPA (Single Page Application)** educacional de onboarding técnico. O estagiário/desenvolvedor:

1. Lê um **roteiro de integração** institucional (SEMOB/SUTINF);
2. Estuda **5 módulos/manuais** (Ambiente, Git, Banco de Dados/SQL, Back-end NestJS, Front-end React);
3. Faz **quizzes** de validação;
4. Resolve **3 desafios práticos** (SQL com 25 questões, Back-end, Front-end "InfoÔnibus");
5. Emite um **certificado** imprimível (A4 paisagem) quando cumpre os critérios.

Todo o progresso é salvo **no navegador (localStorage)**. **Não existe back-end**: o projeto é 100%
estático e pode ser publicado na Vercel.

A aplicação é **"white-label"**: pode rodar com a marca **Azimute Dev** (padrão, demonstração
comercial) ou **SEMOB** (uso interno), trocando apenas uma variável de ambiente.

### 1.2 Stack

| Item | Tecnologia | Versão |
|---|---|---|
| UI | React | 18.3 |
| Linguagem | TypeScript (modo `strict`) | 5.6 |
| Build / Dev server | Vite + `@vitejs/plugin-react` | 5.4 |
| Ícones | `lucide-react` | 1.16 |
| Efeito de confete | `canvas-confetti` | 1.9 |
| Testes | Vitest | 2.1 |
| Lint (instalado) | ESLint + typescript-eslint | 10 / 8 |
| Estilo | CSS puro (`src/index.css`, ~6.000 linhas) com variáveis e tema claro/escuro | — |
| Deploy | Vercel (rewrite SPA) | — |

> Não há React Router, Redux, Tailwind nem biblioteca de componentes. A navegação é feita por
> **estado** (`useState<ScreenType>`) dentro do `App.tsx`.

### 1.3 Como rodar

```bash
npm install          # instala dependências
npm run dev          # servidor de desenvolvimento em http://localhost:3000
npm run typecheck    # checagem de tipos (tsc --noEmit)
npm run test         # testes unitários (vitest run)
npm run build        # tsc && vite build  -> gera dist/
npm run preview      # serve o dist/ localmente
```

Para trocar a marca, crie um `.env` na raiz:

```bash
VITE_BRAND_MODE=semob
```

---

## 2. Árvore completa de pastas e arquivos

```
portal-estagiario-semob/
├── .git/                              # Histórico Git
├── .gitignore                         # Ignora node_modules, dist, .env, logs, coverage...
├── DOCUMENTACAO_ARQUITETURA.md        # Documento de arquitetura antigo (parcialmente desatualizado)
├── MODELAGEM_BANCO_E_EVOLUCAO.md      # Proposta de modelagem de banco para evolução futura
├── README.md                          # Apresentação do projeto
├── index.html                         # HTML base do Vite (monta #root, fontes, CDNs)
├── package.json                       # Dependências e scripts npm
├── package-lock.json                  # Lockfile
├── tsconfig.json                      # Configuração do TypeScript
├── vite.config.ts                     # Configuração do Vite (porta 3000)
├── vercel.json                        # Rewrite de todas as rotas para index.html
├── dist/                              # Saída do build de produção (gerada, ignorada no Git)
├── node_modules/                      # Dependências instaladas (ignorada no Git)
├── documentos/                        # ESTA documentação (.md e .txt)
└── src/
    ├── main.tsx                       #   9 linhas  – Bootstrap do React
    ├── App.tsx                        # 244 linhas  – "Roteador" por estado + orquestração
    ├── index.css                      # ~6054 linhas – Design system completo
    ├── vite-env.d.ts                  #   7 linhas  – Tipagem de import.meta.env
    │
    ├── types/
    │   └── index.ts                   # 240 linhas  – Todos os contratos TypeScript
    │
    ├── config/
    │   └── brand.ts                   #  56 linhas  – Marca Azimute x SEMOB
    │
    ├── content/                       # CONTEÚDO (dados estáticos, sem lógica)
    │   ├── modules/
    │   │   ├── index.ts               #  22 linhas  – Agregador MODULES_CATALOG
    │   │   ├── mod-01-ambiente.ts     # 117 linhas  – Módulo 1: Ambiente/Docker/NPM
    │   │   ├── mod-02-git.ts          # 380 linhas  – Módulo 2: Git
    │   │   ├── mod-03-banco-dados.ts  # 292 linhas  – Módulo 3: Banco de Dados/SQL
    │   │   ├── mod-04-backend.ts      # 478 linhas  – Módulo 4: Back-end NestJS
    │   │   └── mod-05-frontend.ts     # 390 linhas  – Módulo 5: Front-end React
    │   ├── quizzesCatalog.ts          # 527 linhas  – 5 blocos de quiz
    │   ├── integrationTrackCatalog.ts # 110 linhas  – 7 passos do roteiro (não usado pela tela)
    │   ├── challengesCatalog.ts       # 196 linhas  – 4 desafios (ÓRFÃO, não importado)
    │   └── modulesCatalog.ts          # 593 linhas  – Catálogo monolítico antigo (ÓRFÃO)
    │
    ├── services/                      # ACESSO A DADOS + REGRAS PURAS
    │   ├── dataService.ts             #  31 linhas  – Fachada de leitura do conteúdo
    │   ├── storageService.ts          # 327 linhas  – Persistência no localStorage + migração
    │   ├── progressEngine.ts          # 145 linhas  – Funções puras de nota/progresso
    │   └── __tests__/
    │       └── progressEngine.test.ts # 108 linhas  – 5 testes Vitest
    │
    ├── hooks/                         # ESTADO REATIVO
    │   ├── useStudentProgress.ts      #  97 linhas  – Estado global do aluno
    │   └── useTheme.ts                #  18 linhas  – Tema claro/escuro
    │
    ├── components/                    # COMPONENTES REUTILIZÁVEIS
    │   ├── Navbar.tsx                 # 334 linhas  – Cabeçalho, dropdowns, drawer e dock mobile
    │   ├── Footer.tsx                 #  79 linhas  – Rodapé com atalhos
    │   ├── QuizBlock.tsx              # 315 linhas  – Motor visual do quiz
    │   ├── ModuleNotesPanel.tsx       # 270 linhas  – Caderno de anotações por módulo
    │   ├── TechnicalDiagrams.tsx      # 212 linhas  – 6 diagramas SVG vetoriais
    │   └── ChallengeSubmissionPanel.tsx # 122 linhas – Entrega de desafio (checklist de PR)
    │
    └── screens/                       # TELAS (uma por "rota")
        ├── HomeScreen.tsx             # 310 linhas  – Painel inicial
        ├── IntegrationTrackScreen.tsx # 670 linhas  – Roteiro de integração (9 abas)
        ├── ModuleViewerScreen.tsx     # 699 linhas  – Leitor rico dos 5 módulos
        ├── QuizCenterScreen.tsx       # 204 linhas  – Central de quizzes
        ├── SqlChallengeScreen.tsx     # 947 linhas  – Desafio SQL (25 questões a–y)
        ├── BackendChallengeScreen.tsx # 374 linhas  – Desafio Back-end
        ├── FrontendChallengeScreen.tsx# 361 linhas  – Desafio Front-end (InfoÔnibus)
        └── CertificateScreen.tsx      # 482 linhas  – Certificado imprimível
```

---

## 3. Arquivos da raiz do projeto

### `package.json`
- `"type": "module"` → o projeto usa ES Modules.
- **Scripts**:
  - `dev` → `vite` (dev server com HMR).
  - `build` → `tsc && vite build` (falha se houver erro de tipo).
  - `preview` → serve `dist/`.
  - `typecheck` → `tsc --noEmit`.
  - `test` / `test:watch` → Vitest.
- **Dependências de runtime**: apenas `react`, `react-dom`, `lucide-react`, `canvas-confetti`.
  Isso mantém o bundle pequeno.
- ESLint está nas devDependencies, mas **não há script `lint` nem arquivo de configuração** do ESLint na raiz.

### `tsconfig.json`
- `target ES2020`, `module ESNext`, `moduleResolution: "bundler"` (padrão Vite).
- `strict: true` → checagem rígida de null/undefined e tipos.
- `noEmit: true` → o `tsc` só valida; quem gera JS é o Vite.
- `jsx: "react-jsx"` → não precisa importar React para JSX (mas os arquivos importam por hábito).
- `noUnusedLocals/Parameters: false` → imports não usados **não** geram erro (ex.: `MODULES` no `App.tsx`).
- `include: ["src"]`.

### `vite.config.ts`
- Plugin React (Fast Refresh).
- Servidor na porta **3000**, sem abrir navegador automaticamente.

### `vercel.json`
- Reescreve **qualquer URL** para `/index.html`. Necessário em SPAs para que um F5 em qualquer
  caminho não dê 404. (Hoje a app não usa URLs por tela, mas a regra já está pronta.)

### `index.html`
- `<html lang="pt-BR">`, `<div id="root">` e `<script type="module" src="/src/main.tsx">`.
- Carrega fontes **Inter** e **Fira Code** do Google Fonts.
- Carrega **highlight.js** e **mermaid** via CDN — **nenhum dos dois é usado pelo código React atual**
  (resquício da época em que os manuais eram HTML). Ver seção 17.
- Título fixo "Azimute Dev | ..." (não muda quando a marca é SEMOB).
- Favicon SVG inline (ícone de camadas em azul `#38bdf8`).

### `.gitignore`
- Ignora `node_modules`, `dist`, `coverage`, `.env*`, logs, arquivos de editor/SO e `*.zip`.

### `README.md`, `DOCUMENTACAO_ARQUITETURA.md`, `MODELAGEM_BANCO_E_EVOLUCAO.md`
- Documentos institucionais/arquiteturais anteriores.
- `DOCUMENTACAO_ARQUITETURA.md` cita uma pasta `public/` com manuais HTML e o caminho
  `p:\Projetos Git\Tutorial Estagiário\` — **ambos não existem mais** (os HTMLs foram removidos no commit
  `d4cf3b3` e o conteúdo migrou para `src/content/modules/`).
- `MODELAGEM_BANCO_E_EVOLUCAO.md` descreve como o progresso poderia sair do localStorage para um banco real.

### `dist/` e `node_modules/`
- Gerados automaticamente. Não editar à mão.

---

## 4. Arquitetura em camadas (o modelo mental)

O projeto segue o mesmo padrão de **5 camadas unidirecionais** que ele ensina no Módulo 5:

```
 ┌──────────────────────────────────────────────────────────────────────┐
 │ 1. TYPES        src/types/index.ts                                   │
 │    "O contrato". Interfaces usadas por TODAS as outras camadas.      │
 └──────────────────────────────────────────────────────────────────────┘
            ▲ (todos importam os tipos)
 ┌──────────────────────────────────────────────────────────────────────┐
 │ 0. CONTENT + CONFIG   src/content/*  src/config/brand.ts             │
 │    Dados estáticos: módulos, quizzes, roteiro, marca.                │
 └──────────────────────────────────────────────────────────────────────┘
            │ lido por
            ▼
 ┌──────────────────────────────────────────────────────────────────────┐
 │ 2. SERVICES     dataService  storageService  progressEngine          │
 │    Leitura de conteúdo, leitura/escrita no localStorage,             │
 │    cálculos puros. SEM React, SEM JSX.                               │
 └──────────────────────────────────────────────────────────────────────┘
            │ usado por
            ▼
 ┌──────────────────────────────────────────────────────────────────────┐
 │ 3. HOOKS        useStudentProgress  useTheme                         │
 │    Guardam o estado reativo (useState) e expõem ações.               │
 └──────────────────────────────────────────────────────────────────────┘
            │ consumido por
            ▼
 ┌──────────────────────────────────────────────────────────────────────┐
 │ 4. SMART UI     App.tsx  (+ telas em src/screens/)                   │
 │    App decide qual tela mostrar e repassa dados/callbacks por props. │
 └──────────────────────────────────────────────────────────────────────┘
            │ props
            ▼
 ┌──────────────────────────────────────────────────────────────────────┐
 │ 5. DUMB UI      src/components/*                                     │
 │    Navbar, Footer, QuizBlock, Notes, Diagramas...                    │
 └──────────────────────────────────────────────────────────────────────┘
```

**Regra geral**: os dados descem por **props** e os eventos sobem por **callbacks**
(`onNavigate`, `onToggleModule`, `onSaveQuiz`...). O único "estado global" vive em
`useStudentProgress`, instanciado **uma única vez** no `App.tsx`.

**Exceções à regra** (detalhadas na seção 17): `ChallengeSubmissionPanel` e `SqlChallengeScreen`
chamam `storageService` diretamente, pulando o hook.

---

## 5. Pasta `src/` — ponto de entrada

### `src/main.tsx`
**Responsabilidade**: iniciar o React.
1. Importa `index.css` (estilos globais).
2. Faz `ReactDOM.createRoot(document.getElementById('root'))`.
3. Renderiza `<App />` dentro de `<React.StrictMode>` (em dev, efeitos rodam 2x para detectar bugs).

### `src/App.tsx` — o "cérebro" da navegação
**Responsabilidade**: decidir qual tela aparece, instanciar os hooks globais e distribuir dados.

**Estado**
- `currentScreen: ScreenType` — começa em `'home'`. É o "roteador".
- `useTheme()` → `theme`, `toggleTheme`.
- `useStudentProgress()` → `progress`, `metrics` e todas as ações (`toggleModule`,
  `toggleChecklist`, `recordQuizAttempt`, `recordNote`, `updateStudentName`, `resetProgress`...).

**Funções internas**
- `handleNavigate(screen)` → troca `currentScreen` e rola a página para o topo.
- `handleOpenModule(moduleId)` → recebe um id livre (ex.: `'mod-3-banco-dados'`) e, por
  **palavras-chave** (`ambiente`, `sql/banco/dados`, `backend`, `frontend`, `git`, `gabarito`),
  converte para a tela correspondente. Usado pelos desafios no botão "Abrir manual".
- `renderCurrentScreen()` → um `switch` gigante sobre `currentScreen`:

| `currentScreen` | Tela renderizada | Dados enviados |
|---|---|---|
| `home` (e `default`) | `HomeScreen` | módulos concluídos, métricas, nome, toggles |
| `roteiro` | `IntegrationTrackScreen` | apenas `onNavigate` |
| `modulo-ambiente` / `modulo-git` / `modulo-sql` / `modulo-gabarito` / `modulo-backend` / `modulo-frontend` | `ModuleViewerScreen` | módulo, checklist, quiz, histórico, nota, callbacks |
| `quizzes` | `QuizCenterScreen` | `progress.quizAttempts`, salvar tentativa, reset |
| `desafio-sql` / `sql-challenge` | `SqlChallengeScreen` | checklist `challenge-sql-relatorios` |
| `desafio-backend` / `backend-challenge` | `BackendChallengeScreen` | checklist `challenge-backend-api` |
| `desafio-frontend` / `frontend-challenge` | `FrontendChallengeScreen` | checklist `challenge-frontend-ui` |
| `certificado` | `CertificateScreen` | nome, contadores, média, `isCertificateUnlocked` |

**Mapeamento tela → módulo** (dentro do `case` dos módulos):

```
modulo-ambiente  -> mod-1-ambiente
modulo-git       -> mod-2-git
modulo-sql       -> mod-3-banco-dados
modulo-gabarito  -> mod-3-banco-dados   (mesmo manual de SQL)
modulo-backend   -> mod-4-backend
modulo-frontend  -> mod-5-frontend
```

E o mapa reverso (`reverseMap`) é usado no `onSelectModule` para os botões
"Próximo módulo / Anterior" dentro do leitor.

**Para cada módulo aberto, o App monta**:
- `quizKey = mod.quizId || mod.id`
- `attempt = progress.quizScores[quizKey]`
- `history = progress.quizHistory[quizKey] || progress.quizHistory[mod.id] || []`
- `note = progress.moduleNotes[mod.id] || progress.notes[mod.id] || ''`
- `checklist = progress.completedChecklists[mod.id] || []`

**Layout**
- `isViewingManual = currentScreen.startsWith('modulo-')`.
- Se estiver lendo um manual: **esconde Navbar e Footer** (modo leitura em tela cheia,
  classe `main-manual-fullscreen`).
- Caso contrário: `<Navbar/>` + `<main>` + `<Footer/>`.

### `src/vite-env.d.ts`
Declara `ImportMetaEnv` com `VITE_BRAND_MODE?: 'azimute' | 'semob' | string`, permitindo
usar `import.meta.env.VITE_BRAND_MODE` com tipagem.

### `src/index.css` — design system
Arquivo único de estilos (~6.000 linhas). Organização:
- `:root` (linha ~5): variáveis de cor, sombras, raios, fontes — **tema escuro** padrão.
- `[data-theme="light"]` (linha ~61): sobrescreve as variáveis para o tema claro.
  O atributo é aplicado em `<html>` pelo `useTheme`.
- Blocos por área: reset global, layout principal, botões, header/nav desktop, drawer mobile,
  **dock inferior mobile**, perfil do aluno, métricas, trilha, cards de módulos, desafios,
  tabelas, callouts, código, leitor de manual (toolbar, barra de progresso, sumário),
  modos foco/split, **painel de anotações**, quiz (resultado, opções, explicação),
  certificado e regras `@media print` (classe `.no-print` esconde elementos na impressão).

---

## 6. Pasta `src/types/` — contratos

### `src/types/index.ts`
Arquivo único com **todas** as interfaces. Nada aqui executa código.

| Tipo | Para que serve | Quem usa |
|---|---|---|
| `ScreenType` | União de todas as "rotas" possíveis (`'home'`, `'roteiro'`, `'modulo-*'`, `'quizzes'`, `'desafio-*'`, `'*-challenge'`, `'certificado'`) | App, Navbar, Footer, telas |
| `ThemeMode` | `'dark' \| 'light'` | useTheme, Navbar |
| `QuizOption` | `{ id, text }` de uma alternativa | quizzesCatalog, QuizBlock |
| `QuizQuestion` | Pergunta: enunciado, opções, `correctOptionId` **ou** `correctOptionIndex`, explicação, `moduleId` | quizzesCatalog, QuizBlock, progressEngine |
| `QuizBlockData` | Um quiz completo: id, moduleId, títulos, `passingScore`, lista de perguntas | quizzesCatalog, QuizCenterScreen, QuizBlock |
| `QuizAttempt` | Resultado de uma tentativa: acertos, %, aprovado, data, nº da tentativa, respostas | storageService, progressEngine, QuizBlock |
| `ChallengeSubmission` | Entrega de desafio: URL do repo, itens de PR marcados, concluído, queries SQL digitadas | storageService, ChallengeSubmissionPanel, SqlChallengeScreen |
| `StudentProgress` | **O objeto salvo no localStorage** (ver seção 15) | storageService, useStudentProgress, App |
| `SqlQuestion` | Questão SQL (versão "oficial" com categoria/dificuldade) | **não usado** — a tela define a sua própria `SqlQuestion` |
| `RichCallout` | Caixa de destaque (`info/success/warning/danger/important`) com título, texto e bullets | módulos, ModuleViewerScreen |
| `RichTable` | Tabela `headers[]` + `rows[][]` | módulos, ModuleViewerScreen |
| `RichCodeBlock` | Bloco de código com título e linguagem | módulos, ModuleViewerScreen |
| `RichCommandCard` | Cartão didático de comando (nome, papel, conceito, detalhes, código) | módulos 2 e 3 |
| `RichScenarioCard` | Cenário "O que fazer quando...?" (badge, descrição, comandos) | módulo 2 (Git) |
| `ModuleSection` | Um capítulo: `heading`, `body` + blocos opcionais (`paragraphs`, `bullets`, `callouts`, `tables`, `codeBlocks`, `commandCards`, `scenarios`, `svgDiagramType`, `tip`, `codeExample`) | módulos, ModuleViewerScreen |
| `LearningModule` | Um módulo: `id`, `order`, `category`, `estimatedTime`, `title`, `description`, `objectives`, `sections`, `checklist` + campos legados opcionais (`screenKey`, `shortTitle`, `duration`, `topics`, `quizId`...) | content/modules, dataService, telas |
| `ModuleMetadata` | Alias de `LearningModule` | ModuleNotesPanel |
| `IntegrationStep` | Passo do roteiro de integração | integrationTrackCatalog, dataService |
| `ChallengeCategory`, `ChallengeTaskItem`, `ChallengeDefinition` | Modelo de desafio genérico | challengesCatalog (órfão) |

> `svgDiagramType` aceita exatamente: `git-4-zones`, `git-tags-pipeline`, `sql-where-join`,
> `sql-pg-vs-oracle`, `backend-request-lifecycle`, `frontend-unidirectional-flow`.
> Cada valor corresponde a um SVG em `TechnicalDiagrams.tsx`.

---

## 7. Pasta `src/config/` — identidade visual / marca

### `src/config/brand.ts`
Define a interface `BrandConfig` e **duas marcas**:

| Campo | Azimute (padrão) | SEMOB |
|---|---|---|
| `productName` | Azimute Dev | Portal do Estagiário — SEMOB |
| `certificatePrefix` | `AZM` | `SEMOB` |
| `storageKeyPrefix` | `azimute_dev_portal` | `semob_intern_portal` |
| `heroTitle/Subtitle/Badge` | textos comerciais | textos institucionais |
| `isCommercialDemo` | `true` | `false` |

Lógica: `activeBrandMode = import.meta.env.VITE_BRAND_MODE || 'azimute'` →
exporta `brandConfig` (a marca ativa).

**Consumidores**: `Navbar`, `Footer`, `HomeScreen` (hero), `CertificateScreen` (prefixo e textos),
`storageService` (prefixo do código de certificado em `issueCertificate`).

> Observação: `storageKeyPrefix` está definido mas **não é usado** — as chaves do localStorage estão
> fixas no `storageService` (ver seção 17).

---

## 8. Pasta `src/content/` — conteúdo pedagógico

Esta pasta contém **somente dados** (objetos TypeScript tipados). Nenhuma lógica, nenhum JSX.
Separar conteúdo de código permite que alguém edite um manual sem tocar nas telas.

### 8.1 `src/content/modules/` — um arquivo por módulo (SRP)

#### `index.ts` (agregador / "barrel")
- Importa os 5 módulos e exporta:
  - `MODULES_CATALOG: LearningModule[]` (em ordem 1→5);
  - `ALL_MODULES` (alias);
  - cada módulo individualmente (`mod01Ambiente`, ...).
- É o **único ponto** que `dataService` conhece. Para adicionar um módulo novo, cria-se o arquivo e
  registra-se aqui.

#### `mod-01-ambiente.ts` → `id: 'mod-1-ambiente'`
- `order 1`, categoria `fundamentos`, 45 min.
- 3 capítulos: (1) Visão geral do ecossistema e stack; (2) Setup local — Docker Compose
  (PostgreSQL, PostGIS, pgAdmin) vs. nativo, segurança do `.env`; (3) Comandos NPM essenciais.

#### `mod-02-git.ts` → `id: 'mod-2-git'`
- `order 2`, categoria `git`, 2h30.
- 9 capítulos: o que é Git; Git vs GitHub/GitLab; **4 zonas** (diagrama `git-4-zones`); comandos do
  dia a dia (`commandCards`); desfazer alterações (revert x reset); **tags de ambiente/SemVer**
  (diagrama `git-tags-pipeline`); Conventional Commits e nomes de branch; 6 regras de ouro;
  **base de cenários "O que fazer quando...?"** (`scenarios`, com busca ao vivo na tela).

#### `mod-03-banco-dados.ts` → `id: 'mod-3-banco-dados'`
- `order 3`, categoria `banco-dados`, 3h.
- 5 capítulos: fundamentos relacionais (3 chaves); relacionamento via **WHERE** (diagrama
  `sql-where-join`); PostgreSQL (`dados_mobilidade`) vs Oracle (`DFTRANS`) (diagrama
  `sql-pg-vs-oracle`); didática de 11 comandos SQL (`commandCards`); tabela-resumo e regras de produção.

#### `mod-04-backend.ts` → `id: 'mod-4-backend'`
- `order 4`, categoria `backend`, 3h30.
- 6 capítulos: arquitetura em camadas e ciclo de vida da requisição (diagrama
  `backend-request-lifecycle`); matriz de pastas; DTOs com `class-validator` e status HTTP;
  hierarquia de exceções de domínio; ORM vs SQL nativo e anti-SQL Injection (`$1, $2`);
  **tutorial de 7 passos do domínio `Veiculo`** (entity, DTO, repository, service, controller, testes Jest).

#### `mod-05-frontend.ts` → `id: 'mod-5-frontend'`
- `order 5`, categoria `frontend`, 3h.
- 5 capítulos: 5 camadas + analogia do restaurante; estrutura de pastas e matriz de
  responsabilidades; 4 regras de ouro; **tutorial de 6 passos da feature `Tarefas`**
  (types → service → hook → componentes → index → rota lazy); dicionário rápido.

**Estrutura comum de um módulo**:

```
LearningModule
├── id, order, title, category, estimatedTime, description
├── objectives[]            -> chips "🎯" no banner do leitor
├── sections[]              -> capítulos
│   ├── heading, body
│   ├── paragraphs?[]       -> parágrafos extras
│   ├── svgDiagramType?     -> diagrama vetorial
│   ├── callouts?[]         -> caixas coloridas
│   ├── bullets?[]
│   ├── tables?[]
│   ├── commandCards?[]     -> cartões com botão "Copiar"
│   ├── codeBlocks?[]       -> blocos com botão "Copiar Código"
│   ├── scenarios?[]        -> cenários com busca
│   └── tip?                -> caixa "Boas Práticas"
└── checklist?[]            -> DoD do módulo (persistido)
```

### 8.2 `quizzesCatalog.ts`
- Exporta `QUIZZES_BLOCKS: QuizBlockData[]` com **5 quizzes**, todos com `passingScore: 75`:

| `id` | `moduleId` | Tema |
|---|---|---|
| `quiz-git` | `git` | Git & engenharia colaborativa |
| `quiz-sql` | `sql` | Engenharia de dados & SQL |
| `quiz-backend` | `backend` | Back-end NestJS (SISMOB) |
| `quiz-frontend` | `frontend` | Front-end React & arquitetura SUTINF |
| `quiz-fundamentos` | `fundamentos` | Engenharia de software & DevOps |

- Exporta também `QUIZZES_DATA = QUIZZES_BLOCKS.flatMap(b => b.questions)` — lista plana de perguntas.

> ⚠️ Os `moduleId` dos quizzes (`git`, `sql`...) **não batem** com os ids dos módulos novos
> (`mod-2-git`, `mod-3-banco-dados`...). Consequências na seção 17.

### 8.3 `integrationTrackCatalog.ts`
- `INTEGRATION_STEPS_DATA: IntegrationStep[]` com 7 passos (Boas-vindas SEMOB/SUTINF, GitLab,
  bancos `bdg` x `dados_mobilidade`, SISMOB Boilerplate, Front-end SUTINF, desafio InfoÔnibus,
  trilha de aprofundamento).
- É reexportado pelo `dataService` (`INTEGRATION_ROADMAP`, `getIntegrationSteps`), **mas nenhuma tela
  o consome**: a `IntegrationTrackScreen` tem seu conteúdo escrito diretamente no JSX (9 abas).

### 8.4 `challengesCatalog.ts` (órfão)
- `CHALLENGES_CATALOG` com 4 desafios (`challenge-sql-relatorios`, `challenge-backend-api`,
  `challenge-frontend-ui`, `challenge-arquitetura-geral`).
- **Não é importado por nenhum arquivo.** Os ids, porém, são os mesmos usados pelas telas de desafio
  como chave de persistência.

### 8.5 `modulesCatalog.ts` (órfão)
- Catálogo monolítico antigo (`MODULES_DATA`) substituído por `content/modules/`.
- **Não é importado por nenhum arquivo.** Pode ser removido com segurança.

---

## 9. Pasta `src/services/` — dados, persistência e regras puras

### 9.1 `dataService.ts` — fachada de leitura de conteúdo
Isola as telas de "onde" o conteúdo está. Se um dia vier de uma API, só este arquivo muda.

| Export | O que retorna | Quem usa |
|---|---|---|
| `MODULES`, `MODULES_DATA` | `MODULES_CATALOG` (aliases legados) | `HomeScreen` (`MODULES`); `App` importa mas não usa |
| `QUIZZES` | `QUIZZES_BLOCKS` | `QuizCenterScreen` |
| `INTEGRATION_ROADMAP` | passos do roteiro | ninguém |
| `getModules()` | cópia ordenada por `order` | `App`, `useStudentProgress` |
| `getModuleById(id)` | um módulo | ninguém (disponível) |
| `getQuizByModuleId(id)` | perguntas cujo `q.moduleId === id` | `ModuleViewerScreen` |
| `getAllQuizzes()` | todas as perguntas | ninguém |
| `getIntegrationSteps()` | passos do roteiro | ninguém |

### 9.2 `progressEngine.ts` — regras puras (sem React, sem localStorage)
Por ser puro, é **100% testável** (ver testes).

- `PASSING_PERCENTAGE = 70` e `CURRENT_SCHEMA_VERSION = 2`.
- `evaluateQuizAttempt(moduleId, questions, selectedAnswers, prevCount, nowIso)`
  → conta acertos (aceita `correctOptionIndex` **ou** `correctOptionId`), calcula %, define
  `passed = % >= 70`, `attemptNumber = prevCount + 1`. Usado nos testes; o `QuizBlock` hoje
  calcula a nota por conta própria.
- `recordQuizAttemptInProgress(progress, attempt)`
  1. Acrescenta a tentativa ao **histórico** `quizHistory[moduleId]` (nunca sobrescreve);
  2. Mantém em `quizScores[moduleId]` a **melhor** tentativa (empate → a mais recente);
  3. Se aprovado, **adiciona `moduleId` em `completedModules`**.
- `calculateOverallProgress(progress, totalModules)` → `OverallProgressMetrics`:
  - `completedCount = completedModules.length`
  - `passedQuizzesCount = nº de entradas em quizScores com passed = true`
  - `completionPercentage = round((completedCount + passedQuizzesCount) / (totalModules * 2) * 100)`, limitado a 0–100
  - `isCertificateUnlocked = completedCount >= totalModules && passedQuizzesCount >= totalModules`

### 9.3 `storageService.ts` — persistência no navegador
**Chaves usadas no localStorage**:

| Constante | Valor | Conteúdo |
|---|---|---|
| `STORAGE_KEY` | `semob_intern_portal_progress_v1` | `StudentProgress` em JSON |
| `LEGACY_STORAGE_KEY` | `semob_portal_student_progress_v1` | formato antigo (lido apenas como fallback) |
| `THEME_KEY` | `semob_portal_theme_mode` | `'dark'` ou `'light'` |

**`sanitizeAndMigrateProgress(raw)`** — blindagem contra dados corrompidos/antigos:
- Se `raw` não for objeto → progresso inicial.
- Aceita tanto `quizScores` quanto o legado `quizAttempts`; tanto `moduleNotes` quanto `notes`.
- **Migração v1→v2**: se havia nota de quiz mas não havia `quizHistory`, cria o histórico com a
  tentativa existente (`attemptNumber: 1`).
- Valida cada campo (`typeof`, `Array.isArray`) e preenche os aliases de compatibilidade
  (`quizAttempts = quizScores`, `notes = moduleNotes`).

**Métodos do objeto `storageService`** — padrão: *ler → criar cópia imutável alterada → salvar → retornar*:

| Método | Efeito |
|---|---|
| `getProgress()` | Lê (chave nova ou legada), migra, **regrava** e retorna. Em erro, devolve progresso inicial. |
| `saveProgress(p)` | `JSON.stringify` no localStorage (try/catch com `console.error`). |
| `updateStudentName(name)` | Atualiza `studentName` (com `trim`). |
| `toggleModuleCompletion(id)` | Adiciona/remove o id de `completedModules`. |
| `toggleChecklistItem(scope, key)` | Adiciona/remove `key` em `completedChecklists[scope]`. Usado tanto para DoD de módulo (`check-0`, `check-1`...) quanto para passos de desafios. |
| `saveQuizAttempt(attempt)` | Normaliza `moduleId`/`percentage`, chama `recordQuizAttemptInProgress`; se `quizId ≠ moduleId`, **duplica** a melhor nota também em `quizScores[quizId]`. |
| `saveModuleNote(id, note)` | Salva em `moduleNotes` e no alias `notes`. |
| `saveChallengeSubmission(id, data)` | Mescla dados da entrega (inclui `sqlQueries`), marca/desmarca em `completedChallenges` conforme `checklistCompleted`. |
| `issueCertificate()` | Gera `certificateCode = PREFIXO-ANO-HASH` uma única vez. (Não é chamado por nenhuma tela.) |
| `resetProgress()` / `resetAllProgress()` | Volta ao estado inicial (o segundo também apaga as chaves). |
| `getTheme()` / `setTheme()` | Tema salvo ou, na ausência, `prefers-color-scheme` do SO. |
| Aliases legados | `setStudentName`, `toggleModuleCompleted`, `toggleChallengeCompleted`, `saveNote`. |

### 9.4 `__tests__/progressEngine.test.ts` — 5 testes Vitest
1. Aprova com ≥ 70%.
2. Reprova com < 70%.
3. Preserva histórico e mantém a melhor nota.
4. Só libera certificado com todos os módulos **e** todos os quizzes aprovados.
5. Migra dados antigos sem `quizHistory`.

---

## 10. Pasta `src/hooks/` — estado reativo

### 10.1 `useStudentProgress.ts` — estado global do aluno
Instanciado **uma vez** no `App`.

```
useState<StudentProgress>(() => storageService.getProgress())   // carga inicial preguiçosa
totalModules = getModules().length                               // = 5
metrics      = calculateOverallProgress(progress, totalModules)  // useMemo
```

**Toda ação** segue o mesmo padrão: chama o `storageService` (que grava) e coloca o objeto
retornado no estado → o React re-renderiza o App e as telas.

| Ação (nome novo) | Alias legado usado pelo App | Chama |
|---|---|---|
| `updateName` | `updateStudentName` | `storageService.updateStudentName` |
| `toggleModule` | — | `toggleModuleCompletion` |
| `toggleChecklist` | — | `toggleChecklistItem` |
| `recordQuiz` | `recordQuizAttempt` | `saveQuizAttempt` |
| `saveNote` | `recordNote` | `saveModuleNote` |
| `generateCertificate` | — | `issueCertificate` |
| `resetAll` | `resetProgress` | `resetProgress` |
| `toggleChallenge` | — | `toggleChallengeCompleted` |

**`metrics` (legado, o que o App realmente usa)** = métricas do engine +:
- `totalModules`, `completedModulesCount`, `totalQuizzes` (= `totalModules`),
- `completedChallengesCount` (= `completedChallenges.length`), `totalChallenges` (**fixo em 27**),
- `overallPercentage` (= `completionPercentage`),
- `averageQuizScore` (média dos `%` em `quizScores`).

### 10.2 `useTheme.ts`
- Estado inicial: `storageService.getTheme()`.
- `useEffect`: aplica `data-theme="dark|light"` no `<html>` e salva no localStorage.
- `toggleTheme()` alterna. O CSS reage às variáveis de `[data-theme="light"]`.

---

## 11. Pasta `src/components/` — componentes reutilizáveis

### 11.1 `Navbar.tsx`
- **Props**: `currentScreen`, `onNavigate`, `theme`, `onToggleTheme`, `overallPercentage`.
- **Estado local**: `mobileMenuOpen`, `manualsDropdownOpen`, `challengesDropdownOpen`.
- **Renderiza**: logo/nome da marca (`brandConfig`), links (Início, Roteiro, dropdown **Manuais**,
  dropdown **Desafios**, Quizzes, Certificado), indicador de progresso %, botão de tema;
  no mobile, **drawer** em tela cheia e **dock inferior** (Início, Roteiro, Quizzes, Certificado).
- `handleNav(screen)` → fecha menus, chama `onNavigate` e rola para o topo.
- Marca o item ativo comparando com `currentScreen`. Tudo com `.no-print`.

### 11.2 `Footer.tsx`
- **Props**: `onNavigate`.
- Atalhos para roteiro, os manuais (Git, SQL, Back-end, Front-end), quizzes, desafios e
  "Gabarito Oficial Comentado" (vai para `modulo-gabarito` = manual de SQL), além do
  `brandConfig.footerDisclaimer`.

### 11.3 `QuizBlock.tsx` — motor visual do quiz
- **Props híbridas** (aceita dois "dialetos"):
  - Estilo Central de Quizzes: `quiz`, `existingAttempt`, `onSaveAttempt`;
  - Estilo Leitor de Módulo: `moduleId`, `moduleTitle`, `questions`, `previousAttempt`, `onCompleteQuiz`.
  - Se não receber `quiz`, monta um `QuizBlockData` sintético com `passingScore: 70`.
- **Estado**: `selectedAnswers`, `isSubmitted`, `validationError`.
- **Fluxo**:
  1. Ao montar/trocar de quiz: se há tentativa anterior, restaura as respostas e mostra como enviado.
  2. `handleSelectOption` bloqueia mudança após envio.
  3. `handleSubmit`: exige todas respondidas → conta acertos por `correctOptionId` →
     `% >= quiz.passingScore` → cria `QuizAttempt` (`moduleId: quiz.moduleId`, `quizId: quiz.id`) →
     dispara os dois callbacks → **confete** se aprovado.
  4. `handleReset` permite refazer.
- Mostra resultado, alternativas corretas/erradas e a **explicação** de cada pergunta.

### 11.4 `ModuleNotesPanel.tsx` — caderno de campo
- **Props híbridas**: `module` **ou** `moduleId`/`moduleTitle`; `initialNotes` **ou** `initialNote`;
  `onSaveNotes(notes)` **ou** `onSaveNote(moduleId, note)`; `isSplitView`.
- **Estado**: texto, status (`saved/saving/idle`), hora do último salvamento, copiado, fonte monoespaçada.
- **Autosave com debounce** via `useEffect`/`useRef`: ao digitar, espera um intervalo e chama o callback
  → que chega em `storageService.saveModuleNote`.
- Ações: snippets rápidos, copiar, alternar fonte, limpar (com `window.confirm`), contador.

### 11.5 `TechnicalDiagrams.tsx`
- **Props**: `type` (um dos 6 valores de `svgDiagramType`).
- Para cada tipo, retorna um **SVG desenhado à mão** (sem bibliotecas):
  `git-4-zones`, `git-tags-pipeline`, `sql-where-join`, `sql-pg-vs-oracle`,
  `backend-request-lifecycle`, `frontend-unidirectional-flow`.
- Usado apenas pelo `ModuleViewerScreen`.

### 11.6 `ChallengeSubmissionPanel.tsx`
- **Props**: `challengeId`, `title`, `subtitle`, `prChecklist[]`, `requireRepoUrl?`, `onUnlockGabarito?`.
- Lê o estado inicial **direto** de `storageService.getProgress().challengeSubmissions[challengeId]`.
- Aluno informa a URL do repositório e marca os itens do checklist de PR.
- Ao marcar/enviar, chama `storageService.saveChallengeSubmission(...)` → atualiza
  `challengeSubmissions` e `completedChallenges`.
- Usado pelas 3 telas de desafio.

---

## 12. Pasta `src/screens/` — telas

### 12.1 `HomeScreen.tsx`
- **Props**: `onNavigate`, `completedModules`, `passedQuizzesCount`, `totalQuizzes`,
  `completedChallengesCount`, `totalChallenges`, `overallPercentage`, `studentName`,
  `onUpdateStudentName`, `onToggleModule`.
- Lê `MODULES` direto do `dataService` para montar a grade.
- **Seções**: hero (textos da marca) + barra do aluno com **nome editável**; 4 cards de métricas
  (Progresso %, Manuais estudados, Quizzes aprovados, Desafios práticos); banner do roteiro;
  **grade dos 5 módulos** (duração, título, categoria, tópicos, "Estudar Manual", "Marcar lido");
  spotlight dos 3 desafios.
- Botão "Estudar Manual" navega para `module.screenKey || 'roteiro'`.

### 12.2 `IntegrationTrackScreen.tsx`
- **Props**: `onNavigate`.
- Estado: `activeTab` (1–9) e `revealedQuestions` (perguntas de "checagem rápida" com resposta oculta).
- Conteúdo institucional **escrito no próprio JSX** em 9 abas (SEMOB/SUTINF, ambientes, GitLab,
  bancos, SISMOB, front-end SUTINF, desafio InfoÔnibus, aprofundamento...).
- Botões de atalho navegam para os manuais e desafios.

### 12.3 `ModuleViewerScreen.tsx` — leitor rico dos módulos
- **Props**: `module`, `isCompleted`, `completedChecklist`, `quizAttempt?`, `quizHistory?`,
  `moduleNote`, `onBack`, `onToggleComplete`, `onToggleChecklist`, `onSaveQuiz`, `onSaveNote`,
  `onSelectModule`, `allModules`.
- **Estado**: `activeSectionIndex`, `viewMode` (`'full'` tutorial completo | `'step'` modo foco),
  `copiedKey` (feedback "Copiado!"), `scenarioQuery` (busca de cenários).
- `questions = getQuizByModuleId(module.id)`.
- `useEffect([module.id])` → ao trocar de módulo, volta ao capítulo 0, limpa a busca e rola ao topo.
- **Ordem de renderização**:
  1. Barra superior: Voltar, alternar modo, marcar módulo como concluído.
  2. Hero: "Módulo 0N • CATEGORIA • tempo", título, descrição, objetivos.
  3. Sumário clicável dos capítulos (no modo completo faz `scrollIntoView` para `#chapter-N`).
  4. Para cada capítulo (todos ou só o ativo): `body` → `paragraphs` → **diagrama SVG** →
     **callouts** coloridos por tipo → `bullets` → **tabelas** (`white-space: pre-line` para `\n`) →
     **cartões de comando** com copiar → **blocos de código** com copiar → `codeExample` legado →
     **cenários com busca** (filtra por título, descrição e comandos) → `tip` → paginação (modo foco).
  5. **Checklist DoD** (chaves `check-0..n`, salvas em `completedChecklists[module.id]`).
  6. `ModuleNotesPanel`.
  7. Histórico de tentativas (se houver).
  8. `QuizBlock` (se `questions.length > 0`).
  9. Navegação anterior/próximo módulo.
- Copiar usa `navigator.clipboard.writeText` e reseta o feedback após 2 s.

### 12.4 `QuizCenterScreen.tsx`
- **Props**: `quizAttempts`, `onSaveQuizAttempt`, `onNavigate`, `onResetProgress`.
- Lista os 5 quizzes de `QUIZZES`, com status/nota de cada um (lidos por `quizAttempts[quiz.id]`
  ou `[quiz.moduleId]`), média geral e botão para o certificado.
- `selectedQuizId` define qual `QuizBlock` é exibido.
- Botão de reset de todo o progresso.

### 12.5 `SqlChallengeScreen.tsx` — desafio SQL (25 questões)
- **Props**: `completedItems`, `onToggleItem`, `onOpenModule`.
- **Dados locais exportados**: `SCHEMA_TABLES` (6 tabelas do schema `dados_mobilidade`) e
  `SQL_QUESTIONS` (questões `a` a `y`, divididas em Parte I, II e III, com dica, explicação e
  resposta oficial). Define sua **própria** interface `SqlQuestion`.
- **Estado**: filtro de parte, dicas/respostas reveladas, id copiado, `userQueries`
  (inicializado a partir de `challengeSubmissions['challenge-sql-relatorios'].sqlQueries`).
- `useEffect([userQueries])` → **salva automaticamente** as queries digitadas via
  `storageService.saveChallengeSubmission`.
- `hasWhereClause(texto)` → detecta se a query do aluno usa `WHERE` (o padrão de junção ensinado).
- Cada questão pode ser marcada como resolvida (`onToggleItem` → `completedChecklists['challenge-sql-relatorios']`).
- No final, `ChallengeSubmissionPanel` com `challengeId="challenge-sql-relatorios"`.

### 12.6 `BackendChallengeScreen.tsx`
- **Props**: iguais ao SQL.
- Dados locais: camadas da arquitetura (`ArchLayer`: controller, service, repository, dto,
  entity... com "deve fazer / não deve fazer" e código exemplo do domínio `Linha`).
- Estado: `activeLayerId` (aba da camada).
- Passos do desafio marcáveis (`completedChecklists['challenge-backend-api']`).
- `ChallengeSubmissionPanel` com `challengeId="challenge-backend-api"`.

### 12.7 `FrontendChallengeScreen.tsx` — InfoÔnibus
- **Props**: iguais ao SQL.
- Dados locais: `INFO_ONIBUS_MOCK_LINES` (linhas de ônibus fictícias com sentido, operadora,
  itinerário, horários).
- Estado: busca, filtro de sentido (`TODOS/IDA/VOLTA/CIRCULAR`), linha selecionada;
  `useMemo` para filtrar → é um **protótipo funcional** do que o aluno deve construir.
- Passos marcáveis (`completedChecklists['challenge-frontend-ui']`) + `ChallengeSubmissionPanel`
  com `challengeId="challenge-frontend-ui"`.

### 12.8 `CertificateScreen.tsx`
- **Props**: `studentName`, `onUpdateStudentName`, contadores de módulos/quizzes,
  `overallPercentage`, `averageScore`, `isUnlocked`, `onNavigate`.
- **Bloqueado** (`isUnlocked = false`): mostra o que falta e botões para quizzes/manuais.
- **Desbloqueado**: certificado A4 paisagem com nome editável, nº de processo SEI editável (estado
  local, valor padrão fixo), data de emissão por extenso, **código de autenticação** calculado
  localmente por hash de `nome + SEI` (`PREFIXO-NOME-ANO-SEQ`), CRC, URL de validação ilustrativa e
  um **pseudo-QR code** desenhado em SVG (decorativo).
- `handlePrint()` → `window.print()`; o CSS `@media print` + `.no-print` deixa só o certificado.
- Dispara confete ao abrir desbloqueado.

---

## 13. Mapa de dependências (quem importa quem)

```
main.tsx
 └── App.tsx
      ├── types
      ├── hooks/useTheme ─────────────► services/storageService
      ├── hooks/useStudentProgress ───► services/storageService
      │                               ├► services/dataService
      │                               └► services/progressEngine
      ├── services/dataService ───────► content/modules/index ─► mod-01..05
      │                               ├► content/quizzesCatalog
      │                               └► content/integrationTrackCatalog
      ├── components/Navbar ──────────► config/brand
      ├── components/Footer ──────────► config/brand
      └── screens/
           ├── HomeScreen ────────────► config/brand, services/dataService (MODULES)
           ├── IntegrationTrackScreen   (só types + lucide)
           ├── ModuleViewerScreen ────► services/dataService (getQuizByModuleId)
           │                          ├► components/QuizBlock ─► canvas-confetti
           │                          ├► components/ModuleNotesPanel
           │                          └► components/TechnicalDiagrams
           ├── QuizCenterScreen ──────► services/dataService (QUIZZES), components/QuizBlock
           ├── SqlChallengeScreen ────► services/storageService (DIRETO), ChallengeSubmissionPanel
           ├── BackendChallengeScreen ► components/ChallengeSubmissionPanel
           ├── FrontendChallengeScreen► components/ChallengeSubmissionPanel
           └── CertificateScreen ─────► config/brand, canvas-confetti

components/ChallengeSubmissionPanel ─► services/storageService (DIRETO)
services/storageService ─────────────► config/brand, services/progressEngine
services/__tests__ ──────────────────► progressEngine, storageService

ÓRFÃOS (ninguém importa): content/modulesCatalog.ts, content/challengesCatalog.ts
```

---

## 14. Fluxos completos de funcionamento

### 14.1 Inicialização
```
Navegador abre index.html
 → carrega /src/main.tsx → importa index.css
 → <App/> monta
    → useTheme: lê tema (localStorage ou SO) → aplica data-theme no <html>
    → useStudentProgress: storageService.getProgress()
         → lê 'semob_intern_portal_progress_v1' (ou chave legada)
         → sanitizeAndMigrateProgress → regrava
    → calcula metrics
 → currentScreen = 'home' → <Navbar/> + <HomeScreen/> + <Footer/>
```

### 14.2 Navegação
```
Clique em qualquer link (Navbar/Footer/Home/telas)
 → onNavigate('modulo-git')            (callback que sobe até o App)
 → App.handleNavigate → setCurrentScreen + scrollTo(top)
 → re-render → switch escolhe a tela
```
Não há URL por tela: recarregar a página sempre volta para a Home (o progresso permanece salvo).

### 14.3 Abrir e estudar um módulo
```
Navbar ▸ Manuais ▸ Git  → 'modulo-git'
 → App mapeia para 'mod-2-git' → busca em getModules()
 → monta attempt/history/note/checklist a partir de progress
 → <ModuleViewerScreen/> (Navbar e Footer escondidos)
Aluno marca item do DoD
 → onToggleChecklist('mod-2-git','check-3')
 → useStudentProgress.toggleChecklist → storageService.toggleChecklistItem → salva
 → setProgress → re-render com o item marcado
Aluno clica "Marcar módulo como concluído"
 → toggleModule('mod-2-git') → completedModules += 'mod-2-git' → metrics recalculadas
```

### 14.4 Fazer um quiz (Central de Quizzes)
```
QuizCenterScreen → <QuizBlock quiz={quiz-git}/>
 → aluno responde tudo → handleSubmit
 → attempt { moduleId:'git', quizId:'quiz-git', percentage, passed (>=75) }
 → onSaveAttempt → App.recordQuizAttempt → storageService.saveQuizAttempt
     → recordQuizAttemptInProgress:
         quizHistory['git'] += attempt
         quizScores['git'] = melhor
         se passed: completedModules += 'git'
     → quizScores['quiz-git'] = quizScores['git']   (duplicação por quizId)
 → setProgress → métricas e Home atualizadas → confete
```

### 14.5 Anotações
```
Digita no ModuleNotesPanel → debounce → onSaveNote(moduleId, texto)
 → App.recordNote → storageService.saveModuleNote → moduleNotes[moduleId] = texto
```

### 14.6 Desafio prático
```
SqlChallengeScreen
 ├ digitar query → userQueries muda → useEffect → storageService.saveChallengeSubmission
 │                                       (sqlQueries persistidas; NÃO passa pelo hook)
 ├ marcar questão resolvida → onToggleItem → toggleChecklist('challenge-sql-relatorios', key)
 └ ChallengeSubmissionPanel → marcar itens de PR / enviar
        → storageService.saveChallengeSubmission → completedChallenges += 'challenge-sql-relatorios'
```

### 14.7 Certificado
```
'certificado' → CertificateScreen(isUnlocked = metrics.isCertificateUnlocked)
 ├ bloqueado → mostra pendências
 └ liberado → gera código local (hash nome+SEI) → confete → botão Imprimir → window.print()
```

### 14.8 Tema
```
Botão sol/lua na Navbar → onToggleTheme → useTheme.toggleTheme
 → useEffect → <html data-theme="light"> + localStorage → CSS troca variáveis
```

---

## 15. Modelo de dados persistido (localStorage)

Chave `semob_intern_portal_progress_v1` — exemplo real de estrutura:

```json
{
  "schemaVersion": 2,
  "studentName": "Maria Silva",
  "completedModules": ["mod-1-ambiente", "mod-2-git", "git"],
  "completedChecklists": {
    "mod-2-git": ["check-0", "check-1"],
    "challenge-sql-relatorios": ["q-a", "q-b"],
    "challenge-backend-api": [],
    "challenge-frontend-ui": []
  },
  "quizScores": {
    "git":      { "moduleId": "git", "quizId": "quiz-git", "score": 8, "totalQuestions": 10,
                  "percentage": 80, "passed": true, "completedAt": "2026-10-15T20:00:00.000Z",
                  "attemptNumber": 2, "selectedAnswers": { "q1": "b" } },
    "quiz-git": { "...": "mesma tentativa duplicada pela chave quizId" }
  },
  "quizHistory": {
    "git": [ { "attemptNumber": 1, "percentage": 60, "passed": false }, { "attemptNumber": 2, "percentage": 80, "passed": true } ]
  },
  "challengeSubmissions": {
    "challenge-sql-relatorios": {
      "challengeId": "challenge-sql-relatorios",
      "repositoryUrl": "https://gitlab.../repo",
      "checkedPrItems": [0, 1, 2],
      "checklistCompleted": true,
      "sqlQueries": { "a": "SELECT ... WHERE ..." },
      "completedAt": "2026-10-15T20:10:00.000Z"
    }
  },
  "moduleNotes": { "mod-2-git": "git stash salva meu dia" },
  "startedAt": "2026-10-01T12:00:00.000Z",
  "completedAt": null,
  "certificateCode": null,

  "quizAttempts": { "...": "alias de quizScores" },
  "completedChallenges": ["challenge-sql-relatorios"],
  "notes": { "...": "alias de moduleNotes" }
}
```

> As chaves exatas dos itens de checklist dos desafios (`q-a`, etc.) dependem de cada tela; o exemplo é ilustrativo.

Chave `semob_portal_theme_mode` → `"dark"` ou `"light"`.

---

## 16. Regras de negócio (progresso, aprovação, certificado)

| Regra | Onde está | Valor |
|---|---|---|
| Nota mínima no QuizBlock (catálogo) | `quizzesCatalog.passingScore` | **75%** |
| Nota mínima no QuizBlock (sem catálogo) | `QuizBlock` fallback | 70% |
| Nota mínima no engine/testes | `PASSING_PERCENTAGE` | 70% |
| Progresso geral | `calculateOverallProgress` | `(módulos concluídos + quizzes aprovados) / (5 × 2)` |
| Módulo concluído | manual (botão) **ou** automático ao passar no quiz | — |
| Melhor nota | `recordQuizAttemptInProgress` | maior %; empate = mais recente |
| Certificado liberado | `isCertificateUnlocked` | `completedCount ≥ 5` **e** `passedQuizzes ≥ 5` |
| Total de desafios exibido | `useStudentProgress` | fixo em 27 |
| Home "Pronto para certificado" | `HomeScreen` | `overallPercentage ≥ 80` |

---

## 17. Pontos de atenção e dívidas técnicas encontradas

Itens identificados na análise, ordenados por impacto. **Nenhum quebra o build**, mas alguns afetam
a lógica de progresso.

### 🔴 Alto impacto
1. **IDs de quiz ≠ IDs de módulo.** Quizzes usam `moduleId: 'git' | 'sql' | 'backend' | 'frontend' | 'fundamentos'`;
   módulos usam `'mod-2-git'`, etc. Efeitos:
   - `getQuizByModuleId('mod-2-git')` retorna `[]` → **o quiz não aparece dentro do leitor de módulo**;
   - o histórico de tentativas no leitor fica vazio (o App procura por `mod-2-git`);
   - não existe quiz para `mod-1-ambiente` (o mais próximo é `fundamentos`).
   - **Correção sugerida**: trocar os `moduleId` do catálogo para os ids novos, ou adicionar
     `quizId` em cada módulo e buscar por ele.
2. **Contagem de progresso inflada / certificado "fácil".**
   - Passar num quiz adiciona `'git'` (não `'mod-2-git'`) a `completedModules` → conta como mais um módulo.
   - `saveQuizAttempt` duplica a nota em `quizScores['git']` **e** `quizScores['quiz-git']` → cada
     quiz aprovado conta **2 vezes** em `passedQuizzesCount`.
   - Resultado: aprovar os 5 quizzes na Central já soma 5 "módulos" e 10 "quizzes" → **certificado
     liberado sem ler nenhum manual**, e "Manuais Estudados" pode mostrar `8 / 5`.
   - **Correção sugerida**: alinhar ids (item 1), contar apenas ids de módulos existentes e
     contar quizzes por `quiz.id` único.

### 🟠 Médio impacto
3. **Home → "Estudar Manual" vai para o roteiro.** Os módulos novos não têm `screenKey`, então o
   botão cai no fallback `'roteiro'`. Os ícones também caem no padrão (`getModuleIcon` espera
   `'git'`, `'sql'`...) e os chips de tópicos não aparecem (sem `topics`).
4. **Escritas fora do hook.** `ChallengeSubmissionPanel` e `SqlChallengeScreen` gravam direto no
   `storageService`. O estado do `useStudentProgress` só "enxerga" a mudança na próxima ação do hook
   (ou ao recarregar). Ex.: o contador de desafios da Home pode ficar desatualizado.
5. **`totalChallenges` fixo em 27**, enquanto `completedChallenges` só chega a 3 (um por painel).
6. **Duas notas de corte diferentes** (75% no catálogo, 70% no engine/fallback).
7. **Certificado**: o código é recalculado a cada render a partir de nome+SEI (não usa
   `storageService.issueCertificate`, que fica sem uso); SEI não é persistido; QR e URL de
   validação são ilustrativos.

### 🟡 Baixo impacto / limpeza
8. **Arquivos órfãos**: `content/modulesCatalog.ts` (593 linhas) e `content/challengesCatalog.ts`.
9. **Conteúdo duplicado**: `integrationTrackCatalog.ts` existe, mas a `IntegrationTrackScreen` tem o
   conteúdo hardcoded no JSX.
10. **`SqlQuestion` declarada duas vezes** com formatos diferentes (`types/index.ts` e `SqlChallengeScreen.tsx`).
11. **Uso de `any`**: `QuizAttempt.selectedAnswers?: Record<string, any>` contraria a regra "sem any".
    Sugestão: `Record<string, string | number>`.
12. **`brandConfig.storageKeyPrefix` não é usado**: as chaves do localStorage são fixas com prefixo `semob_`,
    inclusive na marca Azimute.
13. **CDNs não usados no `index.html`** (highlight.js com 5 linguagens e mermaid) → downloads
    desnecessários a cada visita. Título da página fixo em "Azimute Dev".
14. **Classes estilo Tailwind** (`text-4xl`, `dark:bg-slate-900/50`...) aparecem em `HomeScreen`,
    `Footer` e `CertificateScreen`, mas o Tailwind não está instalado — só têm efeito se houver
    regra equivalente no `index.css`.
15. **Import não usado**: `MODULES` em `App.tsx`.
16. **`getProgress()` regrava o localStorage a cada leitura** (inofensivo, mas desnecessário).
17. **ESLint instalado sem configuração nem script**.
18. **`DOCUMENTACAO_ARQUITETURA.md` desatualizado** (pasta `public/` e caminho antigo).
19. **Sem rotas por URL**: F5 sempre volta à Home; não é possível compartilhar link direto de um módulo.

---

## 18. Como estender o projeto

### 18.1 Adicionar um novo módulo (ex.: Docker & Kubernetes)
1. Criar `src/content/modules/mod-06-docker.ts` exportando `mod06Docker: LearningModule`
   (`id: 'mod-6-docker'`, `order: 6`, `sections`, `checklist`...).
2. Registrar em `src/content/modules/index.ts` (import + item no array).
3. Adicionar `'modulo-docker'` em `ScreenType` (`types/index.ts`).
4. No `App.tsx`: incluir o `case 'modulo-docker'`, o par no `idMap` e no `reverseMap`
   (e uma palavra-chave em `handleOpenModule`, se for usado por desafios).
5. Adicionar o link na `Navbar` (dropdown Manuais) e, se quiser, no `Footer`.
6. (Opcional) Se precisar de um diagrama novo: adicionar o valor em `svgDiagramType` e o SVG em
   `TechnicalDiagrams.tsx`.
7. Lembrar: `totalModules` passa a 6 → o certificado passa a exigir 6 módulos e 6 quizzes.

### 18.2 Adicionar um quiz
1. Incluir um `QuizBlockData` em `QUIZZES_BLOCKS` com `moduleId` **igual ao id do módulo**
   (ex.: `'mod-6-docker'`) para que ele apareça no leitor.
2. Cada pergunta deve ter `moduleId` e `correctOptionId` (o QuizBlock compara por id).

### 18.3 Adicionar uma tela nova
1. Novo valor em `ScreenType`.
2. Criar `src/screens/NovaTela.tsx` recebendo dados e callbacks por props.
3. Novo `case` no `renderCurrentScreen` do `App.tsx`.
4. Link na `Navbar`/`Footer`.

### 18.4 Trocar a marca
`.env` com `VITE_BRAND_MODE=semob` e reiniciar o `npm run dev`.

### 18.5 Migrar para back-end real
Reimplementar os métodos do `storageService` chamando uma API (mantendo as mesmas assinaturas).
Como as telas só conhecem o hook, o impacto fica concentrado em `services/`. Ver
`MODELAGEM_BANCO_E_EVOLUCAO.md`.

---

## 19. Glossário

| Termo | Significado |
|---|---|
| **SPA** | Aplicação de página única; o navegador carrega um HTML e o React troca o conteúdo. |
| **ScreenType** | Nome da "rota" atual guardado em estado no `App`. |
| **Smart component** | Componente que conhece estado/regras (App, telas). |
| **Dumb component** | Componente que só recebe props e renderiza (Navbar, Footer, Diagramas...). |
| **DoD** | *Definition of Done* — checklist final de cada módulo. |
| **Barrel** | Arquivo `index.ts` que reúne e reexporta outros arquivos. |
| **Migração de schema** | Converter dados antigos salvos para o formato novo sem perda (`sanitizeAndMigrateProgress`). |
| **Função pura** | Mesma entrada → mesma saída, sem efeitos colaterais (`progressEngine`). |
| **White-label** | Mesmo código servindo marcas diferentes (`brand.ts`). |
| **SEMOB / SUTINF** | Secretaria de Transporte e Mobilidade do DF / Subsecretaria de Tecnologia da Informação. |
| **SISMOB Boilerplate** | Projeto base NestJS usado como padrão de back-end. |
| **InfoÔnibus** | Desafio prático de front-end (consulta de linhas de ônibus). |
