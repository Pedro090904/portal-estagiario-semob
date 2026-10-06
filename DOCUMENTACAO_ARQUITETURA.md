# Documentação Técnica e Arquitetural — Portal do Desenvolvedor SEMOB-DF (SUTINF)

> **Documento Oficial de Engenharia de Software**  
> **Subsecretaria de Tecnologia da Informação (SUTINF) / Secretaria de Estado de Transporte e Mobilidade (SEMOB-DF)**  
> **Versão:** 2.0 (Mobile-Ready & Padrão SUTINF)  
> **Classificação:** Documentação Técnica e Roteiro de Evolução

---

## 1. Visão Geral do Sistema

O **Portal do Desenvolvedor SEMOB** é uma plataforma educacional e de integração técnica (*onboarding*) concebida para transformar novos estagiários e desenvolvedores em profissionais alinhados aos padrões arquiteturais da **SUTINF**.

### 1.1 Objetivos Centrais
1. **Nivelamento Técnico Padronizado:** Capacitar os novos integrantes nos 5 pilares institucionais:
   - Git & GitLab Flow governamental;
   - Bancos de dados relacionais e espaciais (`dados_mobilidade`, PostgreSQL, PostGIS, Oracle);
   - Back-end em microsserviços em 3 camadas com NestJS, TypeORM e autenticação JWT;
   - Front-end reativo e componentizado em 5 camadas com React 18, Vite e TypeScript;
   - Regras de negócio do ecossistema de transporte público do Distrito Federal (SISMOB, INFOMOB, bilhetagem e telemetria GPS).
2. **Avaliação Contínua e Objetiva:** Quizzes segmentados com pontuação mínima de suficiência (75%), gabarito didático comentado e justificativas técnicas detalhadas para cada alternativa.
3. **Desafios Práticos Reais:** 25 consultas analíticas em SQL contra dados reais de linhas e bacias, além da implementação guiada de recursos no back-end (SISMOB Boilerplate) e no front-end (InfoÔnibus).
4. **Certificação Institucional:** Emissão de certificado oficial de capacitação (40h) em conformidade com o padrão visual do Governo do Distrito Federal (GDF) e referência a processos do Sistema Eletrônico de Informações (SEI-GDF).

---

## 2. Arquitetura Atual do Front-end (Padrão SUTINF em 5 Camadas)

A aplicação foi estruturada segundo a metodologia de separação de responsabilidades corporativa da SUTINF, com **zero dependência de bibliotecas de componentes externas pesadas** e **tipagem TypeScript estrita (sem uso de `any`)**.

```
p:\Projetos Git\Tutorial Estagiário\
├── public/                     # Manuais técnicos originais e ativos estáticos
│   ├── manual-git-guia-completo.html
│   ├── manual-banco-dados-semob.html
│   ├── gabarito-desafio-sql-semob.html
│   ├── MANUAL_DESENVOLVIMENTO_BACKEND.html
│   └── guia_pratico_arquitetura_frontend.html
├── src/
│   ├── types/                  # Camada 1: Contratos e Interfaces de Domínio
│   │   └── index.ts
│   ├── services/               # Camada 2: Provedores de Dados e Persistência
│   │   ├── dataService.ts      # Catálogo centralizado de conteúdo, módulos e questões
│   │   └── storageService.ts   # Abstração de persistência (LocalStorage / API Ready)
│   ├── hooks/                  # Camada 3: Lógica de Estado e Regras de Negócio
│   │   ├── useStudentProgress.ts # Cálculo de progresso ponderado e critérios
│   │   └── useTheme.ts         # Controle reativo de Dark/Light mode
│   ├── components/             # Camada 4: Componentes Reutilizáveis de Apresentação
│   │   ├── Navbar.tsx          # Header adaptativo, drawer lateral e dock mobile
│   │   ├── Footer.tsx          # Rodapé institucional governamental
│   │   └── QuizBlock.tsx       # Motor de avaliação e gabarito interativo
│   ├── screens/                # Camada 5: Telas / Páginas Principais
│   │   ├── HomeScreen.tsx
│   │   ├── IntegrationTrackScreen.tsx
│   │   ├── ModuleViewerScreen.tsx
│   │   ├── QuizCenterScreen.tsx
│   │   ├── SqlChallengeScreen.tsx
│   │   ├── BackendChallengeScreen.tsx
│   │   ├── FrontendChallengeScreen.tsx
│   │   └── CertificateScreen.tsx
│   ├── index.css               # Design System SEMOB (Tokens, Layout, Mobile-First)
│   ├── App.tsx                 # Roteador de estado e composição principal
│   └── main.tsx                # Ponto de entrada da aplicação React
├── vercel.json                 # Regras de rewrite SPA para deploy em nuvem
├── package.json
└── tsconfig.json
```

---

## 3. Guia de Parametrização da Plataforma

A plataforma foi intencionalmente projetada para que qualquer aspecto didático, visual ou regulatório possa ser parametrizado sem a necessidade de reescrever lógica de renderização ou CSS.

### 3.1 Parametrização de Critérios de Aprovação e Pesos
No arquivo `src/hooks/useStudentProgress.ts`:

* **Pesos da Formação Global:**
  ```typescript
  const modulesWeight = 0.35;    // Peso dos manuais lidos (35%)
  const quizzesWeight = 0.45;    // Peso dos quizzes aprovados (45%)
  const challengesWeight = 0.20; // Peso dos desafios práticos (20%)
  ```
* **Critério de Liberação do Certificado Oficial:**
  ```typescript
  // Atualmente exige aprovação em 4 quizzes e leitura de 3 manuais
  const isCertificateUnlocked = passedQuizzesCount >= 4 && completedModulesCount >= 3;
  ```

### 3.2 Parametrização de Quizzes, Questões e Gabaritos
No arquivo `src/services/dataService.ts`:

* **Adicionar ou Alterar Perguntas:**
  Basta incluir novos objetos no array `questions` do módulo desejado. O sistema recalcula automaticamente denominadores, aproveitamentos e médias:
  ```typescript
  {
    id: 'git-q6',
    question: 'Qual flag do comando git checkout cria e já comuta para a nova branch?',
    codeSnippet: 'git checkout ___ feature/nova-tela',
    language: 'bash',
    options: [
      { id: 'a', text: '-b' },
      { id: 'c', text: '-m' },
      { id: 'd', text: '--force' }
    ],
    correctOptionId: 'a',
    explanation: 'A flag -b cria a branch caso ela não exista e move o ponteiro HEAD.',
    category: 'Git Branches'
  }
  ```
* **Nota Mínima por Bloco:**
  O campo `passingScore` (ex: `75` para 75%) pode ser ajustado individualmente para cada módulo.

### 3.3 Parametrização dos Desafios SQL (25 Questões)
Também em `src/services/dataService.ts`:
* O array `SQL_CHALLENGE_QUESTIONS` permite adicionar novos itens com:
  - `letter`: Identificador da questão (A, B, C...);
  - `category`: Bacia ou contexto (`Parte I: Linha 0.111`, etc.);
  - `difficulty`: `Fácil`, `Médio` ou `Avançado`;
  - `objective`: Enunciado do problema de transporte público;
  - `officialQuery`: Query SQL padronizada oficial;
  - `logicExplanation`: Passo a passo didático da consulta.

### 3.4 Parametrização Visual e Institucional do Certificado
No arquivo `src/screens/CertificateScreen.tsx`:
* **Carga Horária:** Ajustável no texto (`40 (quarenta) horas`);
* **Processo SEI:** Variável `processSEI` (ex: `00090-00012485/2026-11`);
* **Cargos e Assinaturas:** Setores e titulares configuráveis no JSX do rodapé.

---

## 4. Roteiro Técnico para Implementação do Back-end (Roadmap SUTINF)

Para transformar este protótipo de alto impacto em uma solução corporativa de produção adotada oficialmente pela SEMOB-DF, o back-end deve seguir a **arquitetura de microsserviços em 3 camadas com NestJS e PostgreSQL**, ensinada no próprio manual da casa.

### 4.1 Stack Tecnológica Recomendada
* **Linguagem & Framework:** Node.js (v20+ LTS) com **NestJS (^10.x)** e TypeScript;
* **ORM:** **TypeORM** com Migrations controladas;
* **Banco de Dados:** **PostgreSQL 16** com extensão espacial **PostGIS**;
* **Autenticação:** **JWT (JSON Web Tokens)** + `Passport-JWT` + `bcrypt`;
* **Documentação Viva:** **Swagger / OpenAPI 3.0** (`/api/docs`);
* **Infraestrutura:** Contêineres **Docker** e `docker-compose.yml`.

---

### 4.2 Modelagem de Dados Relacional (Entidades do Banco)

```sql
-- 1. Usuários e Perfis de Estágio
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula VARCHAR(20) UNIQUE,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    papel VARCHAR(30) DEFAULT 'ESTAGIARIO', -- 'ESTAGIARIO', 'SUPERVISOR', 'GESTOR_SUTINF'
    universidade VARCHAR(100),
    data_inicio_estagio DATE NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Progresso de Módulos Didáticos
CREATE TABLE progresso_modulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    modulo_id VARCHAR(50) NOT NULL,
    concluido BOOLEAN DEFAULT FALSE,
    concluido_em TIMESTAMP,
    UNIQUE(usuario_id, modulo_id)
);

-- 3. Tentativas e Notas dos Quizzes
CREATE TABLE tentativas_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    quiz_id VARCHAR(50) NOT NULL,
    pontuacao INT NOT NULL,
    respostas_json JSONB NOT NULL,
    aprovado BOOLEAN NOT NULL,
    realizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Desafios Práticos Resolvidos (SQL, Back-end, Front-end)
CREATE TABLE progresso_desafios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    desafio_id VARCHAR(50) NOT NULL,
    codigo_submetido TEXT,
    aprovado BOOLEAN DEFAULT TRUE,
    concluido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, desafio_id)
);

-- 5. Certificados Emitidos com Validação Pública
CREATE TABLE certificados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo_verificador VARCHAR(60) UNIQUE NOT NULL,
    codigo_crc VARCHAR(20) NOT NULL,
    processo_sei VARCHAR(50) NOT NULL,
    carga_horaria_horas INT DEFAULT 40,
    media_aproveitamento INT NOT NULL,
    hash_sha256 VARCHAR(64) NOT NULL,
    emitido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4.3 Módulos de Back-end a Desenvolver

1. **`AuthModule`:**
   - `POST /api/auth/login`: Autentica estagiário e retorna token JWT;
   - `POST /api/auth/register`: Cadastro inicial com validação de matrícula institucional;
   - `GET /api/auth/me`: Retorna perfil do usuário logado e permissões.

2. **`ProgressModule`:**
   - `GET /api/progress`: Retorna progresso completo consolidado do estagiário logado;
   - `PUT /api/progress/modules/:id`: Alterna status de leitura do manual;
   - `POST /api/progress/quizzes/:id/submit`: Recebe respostas do quiz, calcula nota no servidor (blindagem contra fraudes no front-end) e grava histórico;
   - `PUT /api/progress/challenges/:id`: Salva rascunho de queries SQL e status de desafio.

3. **`CertificatesModule` (Validação Pública com QR Code):**
   - `POST /api/certificates/issue`: Valida se o aluno cumpriu todos os pré-requisitos no banco de dados e gera o registro oficial com hash SHA-256;
   - `GET /api/certificates/validate/:code`: **Endpoint público (sem necessidade de login)** que qualquer pessoa ou departamento de RH/universidade pode acessar para certificar a autenticidade do documento;
   - `GET /api/certificates/:id/pdf`: Renderiza o PDF vetorial oficial diretamente pelo servidor (usando Puppeteer ou PDFKit).

4. **`SupervisorDashboardModule` (Gestão SUTINF):**
   - `GET /api/admin/estagiarios`: Lista todos os estagiários, média de notas, horas cumpridas e gargalos de aprendizado;
   - `GET /api/admin/relatorio-semestral/:usuarioId`: Gera minuta do Relatório Semestral de Estágio com notas e atividades para assinatura da chefia e envio à SUAG/CAGEP.

---

## 5. Como Fazer a Transição do Front-end Atual para o Back-end

A transição será extremamente suave porque o front-end já isola toda a comunicação no `src/services/storageService.ts`.

Para conectar a uma API real:
1. Criar um serviço HTTP com `fetch` ou `axios` (`src/services/apiClient.ts`) com base URL apontando para `import.meta.env.VITE_API_URL`;
2. Substituir as chamadas de `localStorage` em `storageService.ts` por métodos assíncronos que chamam a API REST;
3. Adicionar uma tela simples de Login (`LoginScreen.tsx`) solicitando matrícula/e-mail e senha.
