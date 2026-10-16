import { LearningModule } from '../../types';

export const mod02Git: LearningModule = {
  id: 'mod-2-git',
  order: 2,
  title: 'Manual Completo de Git & Engenharia Colaborativa',
  category: 'git',
  estimatedTime: '2h 30min',
  description:
    'Do zero absoluto à esteira profissional de deploy: fundamentos, analogias, as 4 zonas do Git, comandos essenciais, viagem no tempo, tags SemVer (Dev, Homolog e Prod), Conventional Commits e base de cenários.',
  objectives: [
    'Compreender o modelo mental do Git e a diferença entre Git Local, GitHub e GitLab',
    'Dominar o fluxo de dados entre Working Directory, Staging Area, Repositório Local e Remoto',
    'Executar branches, merges, reversões seguras (revert vs reset) e tags de release (SemVer)',
    'Aplicar o padrão Conventional Commits e resolver conflitos de equipa com segurança',
  ],
  sections: [
    {
      heading: '1. O que é o Git, Para que Serve e Como Pensar Nele',
      body: 'O Git é um Sistema de Controlo de Versões Distribuído (DVCS). Em termos práticos, ele monitoriza cada alteração feita no código-fonte de um projeto ao longo do tempo, registando exatamente quem alterou, quando alterou, quais linhas mudaram e qual o propósito daquela alteração.',
      callouts: [
        {
          type: 'info',
          title: '💡 A Analogia Mental do Git (Máquina do Tempo e RPG)',
          content:
            'Pense no Git como uma Máquina do Tempo com Universos Paralelos e Pontos de Salvamento (Checkpoints):',
          bullets: [
            'O Checkpoint (Commit): Imagine que está a jogar um RPG difícil. Antes de entrar numa sala perigosa, guarda o progresso. Se morrer, volta para o save exato. No Git, cada commit é esse ponto de salvamento imutável.',
            'O Universo Paralelo (Branch): Se quer experimentar uma magia nova arriscada sem perder o progresso no jogo principal, cria um "clone da realidade". Se a experiência correr bem, funde essa realidade com a principal (Merge). Se correr mal, descarta o universo sem danificar nada.',
            'O Livro de Histórias (Log): Cada decisão tomada no código tem data, autor e motivo registado. Ninguém precisa de adivinhar por que razão uma linha de código foi escrita há 2 anos.',
          ],
        },
      ],
    },
    {
      heading: '2. Git Local vs. Plataformas na Nuvem (GitHub & GitLab)',
      body: 'Um erro clássico de quem está a iniciar na área é confundir o Git com o GitHub ou GitLab. Eles não são a mesma coisa: o Git é o motor local, enquanto o GitHub e o GitLab são plataformas na nuvem para colaboração.',
      tables: [
        {
          headers: ['Aspeto', 'Git (Ferramenta Local)', 'GitHub / GitLab (Plataformas na Nuvem)'],
          rows: [
            ['O que é?', 'O motor de software instalado no seu computador.', 'Plataformas web que hospedam repositórios Git remotos na nuvem.'],
            ['Onde corre?', '100% offline no seu terminal / máquina de desenvolvimento.', 'Em servidores corporativos ou servidores na nuvem (SaaS).'],
            ['Função Principal', 'Rastrear ficheiros, criar branches, comitar histórico localmente.', 'Colaboração em equipa, code review, automações e segurança.'],
            ['Recursos Chave', 'git commit, git branch, git merge, git log', 'Pull Request / Merge Request, Issues, Kanban, CI/CD Pipelines.'],
          ],
        },
      ],
      callouts: [
        {
          type: 'important',
          title: '🔄 GitHub vs. GitLab: Terminologia Equivalente',
          content: 'As duas plataformas utilizam nomes diferentes para os mesmos conceitos fundamentais:',
          bullets: [
            'GitHub Pull Request (PR) = GitLab Merge Request (MR): Uma solicitação formal para mesclar o código da sua branch de desenvolvimento para a branch principal, onde colegas revisam o código linha por linha antes de aceitar.',
            'GitHub Actions = GitLab CI/CD: Robôs automatizados configurados para correr testes unitários, verificar regras de estilo (linting) e realizar o deploy automático nos servidores de homologação ou produção sempre que um código novo é aprovado.',
          ],
        },
      ],
    },
    {
      heading: '3. A Arquitetura das 4 Zonas do Git',
      body: 'Para dominar o Git, não deve apenas decorar comandos: precisa de enxergar onde o seu ficheiro está fisicamente dentro das 4 camadas fundamentais.',
      svgDiagramType: 'git-4-zones',
      bullets: [
        '1. Working Directory: É a pasta onde trabalha diariamente na sua IDE (VS Code, IntelliJ, etc.). O ficheiro aqui está modificado (Modified) ou não rastreado (Untracked).',
        '2. Staging Area (Index): É a antessala do commit (o "palco" de preparação). Escolhe exatamente o que vai entrar no próximo pacote de salvamento usando git add. Isso permite criar commits limpos e atómicos.',
        '3. Repositório Local (.git): O banco de dados interno na sua máquina onde os commits são guardados em definitivo. Se a internet cair, continua a comitar normalmente aqui.',
        '4. Repositório Remoto: O servidor centralizado na nuvem (GitHub, GitLab) onde os outros membros da equipa buscam e enviam códigos.',
      ],
    },
    {
      heading: '4. Comandos Essenciais do Dia a Dia',
      body: 'Domine os comandos para conectar o seu código local com a nuvem, guardar o trabalho no ciclo de vida do commit, gerir branches paralelas e mesclar funcionalidades.',
      codeBlocks: [
        {
          title: '4.1 Conexões Remotas (Gerindo a Ponte Local ➔ Nuvem)',
          language: 'bash',
          code: `# 1. Clonar um repositório existente na nuvem para o seu computador
git clone https://github.com/organizacao/projeto-backend.git

# 2. Listar todas as conexões remotas configuradas no projeto atual
git remote -v

# 3. Adicionar uma nova conexão remota (geralmente chamada 'origin')
git remote add origin https://gitlab.com/organizacao/meu-novo-repo.git

# 4. Remover / Cortar uma conexão remota existente
git remote remove origin

# 5. Alterar a URL de uma conexão remota que mudou de endereço
git remote set-url origin https://github.com/organizacao/novo-endereco.git`,
        },
        {
          title: '4.2 Ciclo de Vida do Commit (Guardando o Trabalho)',
          language: 'bash',
          code: `# 1. Ver o estado atual (quais ficheiros foram criados, alterados ou apagados)
git status

# 2. Ver as alterações linha a linha feitas nos ficheiros antes de adicionar ao palco
git diff

# 3. Adicionar um ficheiro específico para a Staging Area
git add src/services/user.service.ts

# 4. Adicionar TODAS as alterações de uma só vez
git add .

# 5. Criar o ponto de salvamento (commit) com mensagem descritiva padronizada
git commit -m "feat(auth): adiciona validação de token JWT no login"

# 6. Enviar os commits locais para o servidor remoto (primeira vez)
git push -u origin feature/login-jwt

# 7. Atualizar a sua branch com as novidades que os colegas enviaram
git pull origin main`,
        },
        {
          title: '4.3 Gestão de Branches (Linhas de Desenvolvimento Paralelo)',
          language: 'bash',
          code: `# 1. Listar todas as branches locais
git branch

# 2. Criar uma nova branch e entrar nela imediatamente (Método Moderno)
git switch -c feature/calculo-tarifa
# (Método Clássico equivalente: git checkout -b feature/calculo-tarifa)

# 3. Trocar entre branches já existentes
git switch main

# 4. Apagar uma branch local que já foi mesclada e finalizada
git branch -d feature/calculo-tarifa

# 5. Forçar a exclusão de uma branch local mesmo se não foi mesclada
git branch -D feature/calculo-tarifa`,
        },
        {
          title: '4.4 Mesclando Códigos (Merge)',
          language: 'bash',
          code: `# Cenário: Quer trazer o código da 'feature/nova-api' para dentro da 'main'
git switch main
git pull origin main
git merge feature/nova-api`,
        },
      ],
      callouts: [
        {
          type: 'warning',
          title: '⚠️ Atenção: Merge Local vs. Pull Request / Merge Request',
          content:
            'Em ambientes profissionais, raramente fará git merge direto na sua máquina para a branch principal (main ou master). O fluxo correto em equipa é:',
          bullets: [
            '1. Envia a sua branch para a nuvem: git push origin feature/minha-tela.',
            '2. Abre um Pull Request (GitHub) ou Merge Request (GitLab) pelo navegador.',
            '3. Colegas de equipa revisam o código, a esteira de CI/CD corre os testes, e o botão de Merge é clicado na plataforma web.',
          ],
        },
      ],
    },
    {
      heading: '5. Viagem no Tempo: Desfazendo Alterações e Restaurando Versões',
      body: 'Erros acontecem. A grande vantagem do Git é que quase nada é irrecuperável se foi comitado. Veja as 5 ferramentas para voltar atrás com segurança:',
      tables: [
        {
          headers: ['Comando', 'O que faz?', 'Quando Usar?', 'Impacto / Risco'],
          rows: [
            [
              'git restore <ficheiro>',
              'Descarta as alterações locais não comitadas de um ficheiro no Working Directory.',
              'Fiz asneira no código hoje e quero voltar para a versão do último commit.',
              'Médio (Descarta alterações locais não guardadas)',
            ],
            [
              'git checkout <hash>',
              'Move a sua visão (HEAD) para um commit passado específico em modo de leitura (Detached HEAD).',
              'Quero compilar e ver como o sistema funcionava no commit a1b2c3d sem alterar o código atual.',
              'Zero (Modo leitura, seguro)',
            ],
            [
              'git revert <hash>',
              'Cria um NOVO commit que faz exatamente o inverso das alterações do commit especificado.',
              'O código já subiu para a nuvem/produção e causou um bug. Preciso desfazer sem reescrever a história.',
              'Seguríssimo (Ideal para branches partilhadas)',
            ],
            [
              'git reset --soft <hash>',
              'Desfaz os commits até àquele ponto, mas mantém todo o código modificado na Staging Area.',
              'Fiz um commit antes da hora ou errei o texto e quero agrupar tudo num novo commit.',
              'Baixo (Nenhum código é perdido)',
            ],
            [
              'git reset --hard <hash>',
              'Apaga completamente todos os commits e alterações do disco até ao commit escolhido.',
              'Quero deitar tudo o que fiz fora e voltar à estaca zero de um commit passado.',
              'Perigo Alto (Apaga código permanentemente)',
            ],
          ],
        },
      ],
      codeBlocks: [
        {
          title: 'Exemplos Práticos de Reversão e Restauração',
          language: 'bash',
          code: `# 1. Descobrir a identificação (Hash) dos commits anteriores
git log --oneline -n 5

# 2. Desfazer o commit '3c4d5e6' criando um commit de reversão (SEGURO PARA PRODUÇÃO):
git revert 3c4d5e6
git push origin main

# 3. Voltar atrás apenas localmente mantendo o código no editor (para ajustar e recommitar):
git reset --soft HEAD~1

# 4. Descartar alterações de um ficheiro antes de adicionar ao git:
git restore src/app.controller.ts`,
        },
      ],
    },
    {
      heading: '6. Tags de Ambientes: Produção, Homologação e Desenvolvimento',
      body: 'Uma Tag no Git é um marcador de posição fixo e imutável que aponta para um commit específico no histórico. Enquanto as branches se movem continuamente para a frente a cada novo commit, as tags ficam paradas para sempre naquele exato ponto.',
      svgDiagramType: 'git-tags-pipeline',
      tables: [
        {
          headers: ['Ambiente', 'Padrão de Nomenclatura de Tag', 'Propósito e Quem Utiliza', 'Gatilho no CI/CD'],
          rows: [
            [
              '1. Desenvolvimento (DEV)',
              'dev-latest ou v1.2.0-alpha.1',
              'Usado exclusivamente por programadores para testar integrações entre microsserviços e banco partilhado.',
              'Qualquer merge na branch develop ou push de tag dev-* sobe nos containers de teste interno.',
            ],
            [
              '2. Homologação / Staging (HML)',
              'v1.2.0-rc.1, v1.2.0-beta.2 (RC = Release Candidate)',
              'Ambiente idêntico à produção. Utilizado por QA, Tech Leads e clientes para homologar antes da libertação.',
              'Ao criar uma tag *-rc.*, o CI/CD gera a imagem Docker e publica no ambiente de Homologação.',
            ],
            [
              '3. Produção (PROD)',
              'v1.0.0, v1.2.0, v1.2.1 (Seguindo SemVer)',
              'O ambiente real onde os utilizadores finais operam. Código estável, auditado e imutável.',
              'A publicação da tag vX.Y.Z dispara o pipeline de produção nos clusters Kubernetes.',
            ],
          ],
        },
      ],
      bullets: [
        'MAJOR (v2.0.0): Alterações incompatíveis na API (quebra de contratos antigos).',
        'MINOR (v1.1.0): Adição de novas funcionalidades mantendo compatibilidade com o que já existia.',
        'PATCH (v1.0.1): Correções rápidas de bugs emergenciais (hotfixes) sem novas funcionalidades.',
      ],
      codeBlocks: [
        {
          title: 'Como Criar, Enviar e Gerir Tags no Git',
          language: 'bash',
          code: `# 1. Listar todas as tags do repositório
git tag

# 2. Criar uma Tag Anotada (PADRÃO DE PRODUÇÃO)
git tag -a v1.2.0 -m "Release v1.2.0: Módulo de integração com bilhetagem e GPS"

# 3. Criar uma Tag de Homologação (Release Candidate)
git tag -a v1.2.0-rc.1 -m "Candidato a release para validação da equipa de QA"

# 4. IMPORTANTE: 'git push' convencional NÃO envia tags! Envie explicitamente:
git push origin v1.2.0
git push origin --tags

# 5. Apagar uma tag local e na nuvem (caso tenha criado por engano):
git tag -d v1.2.0-rc.1
git push origin --delete v1.2.0-rc.1`,
        },
      ],
    },
    {
      heading: '7. Padronização de Nomenclatura (Conventional Commits & Branches)',
      body: 'Num projeto profissional partilhado, a mensagem de commit gera documentação viva e changelogs automáticos. O formato oficial é: <tipo>(<escopo opcional>): <descrição sucinta no presente>.',
      tables: [
        {
          headers: ['Prefixo', 'Propósito', 'Exemplo de Mensagem'],
          rows: [
            ['feat', 'Adição de uma nova funcionalidade no sistema.', 'feat(auth): adiciona autenticação de utilizadores via JWT'],
            ['fix', 'Correção de um bug ou comportamento incorreto.', 'fix(api): corrige estouro de memória no cálculo de rotas'],
            ['docs', 'Alterações exclusivamente em documentação (README, Swagger).', 'docs: documenta variáveis de ambiente no manual de onboarding'],
            ['style', 'Ajustes de formatação, ponto e vírgula, indentação (sem alterar lógica).', 'style: formata ficheiros com prettier e eslint'],
            ['refactor', 'Reescrita interna de código que não adiciona recurso nem corrige bug.', 'refactor(service): desacopla lógica de envio de email'],
            ['perf', 'Otimização de performance de código ou consultas SQL.', 'perf(db): adiciona índice na coluna cd_linha para busca rápida'],
            ['test', 'Criação ou ajuste de baterias de testes unitários ou e2e.', 'test(user): adiciona casos de teste para senha fraca'],
            ['chore', 'Tarefas rotineiras de manutenção, build, dockerfile ou dependências.', 'chore(deps): atualiza versão do node para 20-alpine'],
            ['ci', 'Alterações nos scripts e configurações de pipelines (GitHub Actions, GitLab CI).', 'ci: adiciona etapa de validação de testes antes do deploy'],
          ],
        },
      ],
      bullets: [
        'feature/nome-da-funcionalidade: Ex: feature/login-govbr, feature/exportacao-csv',
        'fix/nome-do-bug: Ex: fix/calculo-tarifa-feriado',
        'hotfix/correcao-urgente: Ex: hotfix/vazamento-memoria-prod',
        'refactor/modulo-alterado: Ex: refactor/repositorios-typeorm',
      ],
    },
    {
      heading: '8. As 6 Regras de Ouro em Repositórios Partilhados',
      body: 'O trabalho em equipa exige disciplina para não sobrescrever o código dos colegas nem quebrar a esteira principal.',
      callouts: [
        {
          type: 'danger',
          title: '🚨 REGRA 1: NUNCA dê commit ou push direto na "main" ou "master"',
          content:
            'A branch principal é sagrada. Ela reflete código que pode ir para produção a qualquer instante. Todo o trabalho deve ser feito em branches separadas e incorporado via Pull Request / Merge Request com aprovação de pares.',
        },
        {
          type: 'warning',
          title: '⚠️ REGRA 2: Cuidado Extremo com "git push --force" (-f)',
          content:
            'O push --force reescreve a história remota. Se correr esse comando numa branch que outros programadores estão a usar, poderá apagar commits de outras pessoas permanentemente. Nunca use force push em branches públicas.',
        },
      ],
      bullets: [
        '3. Faça Commits Atómicos: Não acumule 3 dias de trabalho num único commit com 50 ficheiros chamado "ajustes gerais".',
        '4. Atualize a sua branch logo no início do expediente: Vá na main, dê git pull, volte para a sua branch e traga as novidades (git merge main).',
        '5. Não comite ficheiros gerados ou segredos: Nunca suba node_modules/, dist/ ou .env com senhas de banco.',
        '6. Revise o seu próprio Diff antes de abrir PR/MR: Encontrará facilmente console.log esquecidos e códigos comentados.',
      ],
    },
    {
      heading: '9. Base de Conhecimento e Cenários Rápidos ("O que fazer quando...?")',
      body: 'Guia prático interativo para consultar rapidamente na hora da dúvida ou de algum imprevisto no trabalho diário com Git:',
      scenarios: [
        {
          title: '1. Errei a mensagem do último commit que fiz e AINDA NÃO enviei para a nuvem.',
          badgeText: 'Fácil / Seguro',
          badgeType: 'info',
          description: 'Basta usar o modificador --amend para corrigir a mensagem imediatamente:',
          commands: ['git commit --amend -m "feat(auth): mensagem correta agora"'],
        },
        {
          title: '2. Fiz um commit mas esqueci-me de incluir um ficheiro nele.',
          badgeText: 'Fácil / Seguro',
          badgeType: 'info',
          description: 'Adicione o ficheiro esquecido ao palco e agrupe no commit anterior sem criar um commit novo:',
          commands: ['git add ficheiro-esquecido.ts', 'git commit --amend --no-edit'],
        },
        {
          title: '3. Comecei a programar na branch "main" por engano e ainda não comitei nada!',
          badgeText: 'Atenção',
          badgeType: 'warning',
          description: 'O Git permite mover o seu trabalho não guardado diretamente para uma branch nova:',
          commands: ['git switch -c feature/minha-tarefa-correta'],
          extraNote: 'Todas as alterações não comitadas migrarão consigo para a nova branch intactas.',
        },
        {
          title: '4. Preciso de trocar de branch agora para ajudar um colega, mas o meu código atual está incompleto.',
          badgeText: 'Uso Diário',
          badgeType: 'info',
          description: 'Use o "esconderijo" temporário do Git (Stash):',
          commands: [
            'git stash              # Guarda as suas alterações numa gaveta limpa',
            'git switch outra-branch  # Faz o que precisa na outra branch',
            'git switch minha-branch # Volta para a sua branch',
            'git stash pop          # Recupera as suas alterações exatamente de onde parou',
          ],
        },
        {
          title: '5. Enviei um commit com BUG para a nuvem/produção e preciso de anular IMEDIATAMENTE.',
          badgeText: 'Crítico / Produção',
          badgeType: 'danger',
          description: 'Nunca use reset em produção. Crie um commit reverso que desfaz as alterações com segurança:',
          commands: [
            'git log --oneline -n 3           # Localize o hash do commit com bug (ex: 8b3d4f1)',
            'git revert 8b3d4f1                # Cria o commit desfazendo',
            'git push origin main               # Envia a correção para produção',
          ],
        },
        {
          title: '6. Deu Conflito de Merge (CONFLICT). O que fazer?',
          badgeText: 'Resolução de Conflito',
          badgeType: 'warning',
          description:
            'Abra o ficheiro no VS Code, escolha a versão correta (Accept Current, Accept Incoming ou edite manualmente), guarde o ficheiro e finalize:',
          commands: [
            'git add ficheiro-resolvido.ts',
            'git commit -m "chore: resolve conflito de merge com a main"',
          ],
        },
        {
          title: '7. Quero pegar apenas UM commit específico de outra branch sem mesclar ela inteira.',
          badgeText: 'Avançado',
          badgeType: 'info',
          description: 'Use o comando Cherry-Pick informando o hash do commit desejado:',
          commands: ['git cherry-pick <hash-do-commit-desejado>'],
        },
      ],
    },
  ],
  checklist: [
    'Compreendi a diferença entre Working Directory, Staging Area, Repositório Local e Remoto',
    'Criei uma branch seguindo o padrão feature/nome-da-tarefa usando git switch -c',
    'Realizei commits atómicos formatados no padrão Conventional Commits',
    'Pratiquei o uso de git stash e git revert em ambiente controlado',
  ],
};
