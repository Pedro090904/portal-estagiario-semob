# 🏛️ Portal do Desenvolvedor SEMOB — SUTINF
> **Plataforma Oficial de Formação, Padronização Técnica e Desafios Práticos da Subsecretaria de Tecnologia da Informação (SEMOB-DF)**

Bem-vindo(a) ao **Portal do Desenvolvedor SEMOB**. Esta plataforma foi concebida para integrar e capacitar novos estagiários e desenvolvedores que ingressam na Secretaria de Transporte e Mobilidade do Distrito Federal, conduzindo o profissional do **absoluto zero a um desenvolvedor produtivo** alinhado aos rigorosos padrões da SUTINF.

---

## 🌟 O que a plataforma oferece

1. **🧭 Roteiro Oficial de Integração (Onboarding Interativo):**
   - Transposição completa e interativa do documento de acolhimento da SEMOB (11 páginas).
   - Apresentação da Secretaria, papel estratégico da SUTINF e sistemas centrais (**SISMOB**, **INFOMOB** e **QLIK**).
   - Ambientes de banco de dados: `bdg` (laboratório) vs. `dados_mobilidade` (produção em tempo real com telemetria).
   - Perguntas dinâmicas interativas sobre SQL (`SELECT *`, `LIKE %`, `MAX / ORDER BY`, `PostGIS`).
   - Acesso ao repositório GitLab corporativo e clone do **SISMOB Boilerplate**.
   - Trilha de aprofundamento: SPA, RESTful APIs com JWT, OLAP vs. OLTP, Docker e DevSecOps.

2. **📚 Manuais Técnicos Integrados:**
   - 📘 **Manual Oficial do Git & Engenharia Colaborativa:** Arquitetura das 4 Zonas, políticas de branches sagradas, convenções de commits, pipelines CI/CD com GitLab Runners e `.gitlab-ci.yml`.
   - 📗 **Manual de Engenharia de Dados & Tutorial SQL:** Modelação relacional no PostgreSQL e Oracle, índices B-Tree e GiST, geometrias espaciais (`ST_AsText`, `ST_Length`) e travas de segurança em produção.
   - 📗 **Gabarito Oficial & Análise Lógica do Desafio SQL:** As 25 consultas reais de mobilidade urbana resolvidas passo a passo, acompanhadas de armadilhas comuns e otimizações de performance.
   - 📙 **Manual Oficial de Desenvolvimento Back-end (SISMOB Boilerplate):** Arquitetura em 3 camadas (*Controller* -> *Service* -> *Repository*), validação com DTOs e `class-validator`, proteção com `@UseGuards(JwtAuthGuard)`, e a Regra de Ouro: *Entity (ORM) para CRUDs simples vs. SQL Nativo Parametrizado ($1, $2) para alta performance e proteção contra SQL Injection*.
   - 📕 **Guia Prático de Arquitetura Front-end (React + Vite):** Separação estrita em 5 camadas (`/screens`, `/hooks`, `/services`, `/components`, `/types`), a **Regra das 50 Linhas**, proibição absoluta do tipo `any`, variáveis de ambiente com prefixo `VITE_` e empacotamento híbrido com Capacitor.

3. **🎯 Central de Quizzes Segmentados com Gabarito Didático:**
   - Testes de conhecimento para cada bloco temático (Git, SQL, Back-end NestJS, Front-end React e Fundamentos).
   - Correção em tempo real, cálculo de nota percentual e justificativas pedagógicas detalhadas explicando por que a alternativa está correta e alertando sobre pegadinhas comuns da equipe.
   - Persistência automática no `localStorage` do navegador com histórico de notas e opção de refazer.

4. **⚡ Desafios Práticos com Rascunho e Validação:**
   - **Desafio SQL (25 Questões):** Investigação da Linha 0.111, análise de sentidos na Linha 0.170 e cruzamentos de BI com área para rascunhar sua query e botão para revelar o gabarito oficial.
   - **Desafio Back-end (Veículos):** Passo a passo das 7 etapas canônicas para adicionar um novo recurso ao SISMOB Boilerplate, com simulador de token JWT via Swagger.
   - **Desafio Front-end (InfoÔnibus):** Demonstração interativa com mapa de Brasília, traçado de linhas e telemetria GPS em tempo real com indicador de velocidade e paradas.

5. **🏆 Certificado Oficial de Conclusão:**
   - Emissão dinâmica e personalizável com o nome do aluno, hash de verificação e carga horária de 40 horas.
   - Comemoração com confetes e estilos de impressão dedicados (`@media print`) para salvar em PDF de alta qualidade.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` instalado

### Passo a Passo

1. **Instalar as dependências:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Iniciar o servidor de desenvolvimento:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Acesse a URL exibida no terminal (normalmente \`http://localhost:3000/\` ou \`http://localhost:5173/\`).

3. **Gerar pacote para produção (Build estático):**
   \`\`\`bash
   npm run build
   \`\`\`
   Os arquivos compilados e prontos para publicação serão gerados na pasta \`dist/\`.

---

## 🌐 Opções de Hospedagem Gratuita / Servidores

Como a aplicação foi construída com **React + Vite** e gera um pacote estático completo em \`dist/\`, você pode hospedá-la gratuitamente em qualquer provedor moderno:

### Opção 1: Vercel (Recomendado pela simplicidade)
1. Instale a CLI ou conecte seu repositório no [vercel.com](https://vercel.com):
   \`\`\`bash
   npx vercel
   \`\`\`
2. Framework preset: **Vite**
3. Output Directory: **dist**

### Opção 2: GitHub Pages
1. No arquivo \`vite.config.ts\`, se for publicar em um subdiretório de usuário/repositório, adicione:
   \`\`\`typescript
   export default defineConfig({
     base: '/nome-do-repositorio/',
     plugins: [react()],
   });
   \`\`\`
2. Execute o build e envie o conteúdo de \`dist/\` para a branch \`gh-pages\`.

### Opção 3: GitLab Pages (Infraestrutura SEMOB)
Basta configurar o arquivo \`.gitlab-ci.yml\` na raiz do projeto:
\`\`\`yaml
pages:
  stage: deploy
  script:
    - npm install
    - npm run build
    - mv dist public_pages
  artifacts:
    paths:
      - public_pages
  publish: public_pages
  only:
    - main
\`\`\`

### Opção 4: Qualquer Servidor Web (Nginx / Apache / IIS)
Basta copiar os arquivos gerados dentro da pasta \`dist/\` para o diretório raiz do seu servidor web (ex: \`/var/www/html\` ou \`C:\\inetpub\\wwwroot\`).

---

## 📁 Arquitetura do Projeto (Padrão SUTINF)

O projeto segue rigorosamente as diretrizes estabelecidas no *Guia Prático de Arquitetura Front-end da SEMOB*:

\`\`\`
Tutorial Estagiário/
├── dist/                      # Pacote compilado e pronto para hospedagem
├── public/                    # Manuais HTML originais preservados
│   ├── MANUAL_DESENVOLVIMENTO_BACKEND.html
│   ├── gabarito-desafio-sql-semob.html
│   ├── guia_pratico_arquitetura_frontend.html
│   ├── manual-banco-dados-semob.html
│   └── manual-git-guia-completo.html
├── src/
│   ├── components/            # Componentes visuais isolados (Dumb Components)
│   │   ├── Navbar.tsx         # Barra superior com logo, menus, progresso e tema
│   │   ├── Footer.tsx         # Rodapé institucional SEMOB/SUTINF
│   │   └── QuizBlock.tsx      # Motor interativo de quiz com gabarito e correção
│   ├── hooks/                 # Cérebro da aplicação e controle de estado
│   │   ├── useStudentProgress.ts # Gestão de progresso, pontuações e notas
│   │   └── useTheme.ts        # Alternância de tema Dark/Light
│   ├── screens/               # Telas focadas exclusivamente em UI (Smart Components)
│   │   ├── HomeScreen.tsx
│   │   ├── IntegrationTrackScreen.tsx
│   │   ├── ModuleViewerScreen.tsx
│   │   ├── QuizCenterScreen.tsx
│   │   ├── SqlChallengeScreen.tsx
│   │   ├── BackendChallengeScreen.tsx
│   │   ├── FrontendChallengeScreen.tsx
│   │   └── CertificateScreen.tsx
│   ├── services/              # Camada de comunicação e persistência
│   │   ├── dataService.ts     # Dados estruturados, questões e desafios
│   │   └── storageService.ts  # Persistência de progresso em LocalStorage
│   ├── types/                 # Interfaces TypeScript estritas (proibido 'any')
│   │   └── index.ts
│   ├── App.tsx                # Orquestrador central e roteamento
│   ├── index.css              # Design system com tokens, animações e regras print
│   └── main.tsx               # Ponto de entrada
├── package.json
├── tsconfig.json
└── vite.config.ts
\`\`\`

---

## 🔒 Regras de Ouro Relembradas

- **A branch principal é sagrada:** Nunca faça commit direto na \`main\` ou \`production\`.
- **Regra das 50 Linhas:** Se uma tela acumular mais de 50 linhas em lógica de estado, extraia para um Custom Hook.
- **Entity vs. SQL Nativo:** Use ORM para CRUDs simples; use SQL Nativo Parametrizado (\`$1\`, \`$2\`) para consultas complexas e proteção contra SQL Injection.
- **Respeito à Produção:** O banco \`dados_mobilidade\` possui telemetria em tempo real; sempre teste primeiro no \`bdg\`.

---

© 2026 SEMOB-DF • Subsecretaria de Tecnologia da Informação (SUTINF).
