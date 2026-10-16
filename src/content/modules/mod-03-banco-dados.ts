import { LearningModule } from '../../types';

export const mod03BancoDados: LearningModule = {
  id: 'mod-3-banco-dados',
  order: 3,
  title: 'Manual de Bases de Dados & Engenharia SQL (PostgreSQL / Oracle)',
  category: 'banco-dados',
  estimatedTime: '3h 00min',
  description:
    'Do modelo mental das três chaves à escrita precisa de consultas: o poder da cláusula WHERE para junção de tabelas, o contraste entre PostgreSQL (dados_mobilidade) e Oracle (DFTRANS), didática dos 11 comandos SQL e regras de segurança em produção.',
  objectives: [
    'Dominar o modelo mental de Tupla, Chave Primária (PK) e Chave Estrangeira (FK)',
    'Relacionar múltiplas tabelas utilizando junções explícitas na cláusula WHERE evitando Produto Cartesiano',
    'Compreender a diferença arquitetural entre o modelo operacional PostgreSQL e o modelo regulatório Oracle',
    'Aplicar corretamente filtros, agregadores (GROUP BY / HAVING), geometrias PostGIS (ST_AsText) e subconsultas',
  ],
  sections: [
    {
      heading: '1. Fundamentos: Como Funciona uma Base de Dados Relacional',
      body: 'Uma base de dados relacional organiza a informação em tabelas estruturadas em linhas e colunas. Cada tabela representa uma entidade do mundo real (ex.: linhas de ônibus, operadoras, itinerários ou horários).',
      callouts: [
        {
          type: 'info',
          title: '💡 O Modelo Mental das Três Chaves',
          content: 'Toda navegação relacional baseia-se em três elementos fundamentais:',
          bullets: [
            'O Registo (Linha / Tupla): Representa uma ocorrência única. Por exemplo, a linha 0.111 é uma linha física cadastrada na tabela tab_linha.',
            'Chave Primária (Primary Key - PK): É a impressão digital daquela linha. O valor nunca se repete e não pode ser nulo (ex.: id_linha = 101).',
            'Chave Estrangeira (Foreign Key - FK): É o cabo de conexão. Quando a tabela de itinerários precisa dizer a que linha pertence determinado traçado, ela guarda uma coluna id_linha que aponta para a Chave Primária da tabela principal.',
          ],
        },
      ],
    },
    {
      heading: '2. Como as Tabelas se Relacionam: O Poder da Cláusula WHERE',
      body: 'No padrão relacional clássico, podemos combinar duas ou mais tabelas declarando-as na cláusula FROM e usando a cláusula WHERE para estabelecer o vínculo lógico entre a Chave Primária e a Chave Estrangeira.',
      paragraphs: [
        'O que acontece se esquecer a condição de vínculo no WHERE? O motor do banco executa um Produto Cartesiano. Se você tiver 500 linhas na tabela A e 2.000 itinerários na tabela B, o banco multiplicará 500 por 2.000, gerando 1.000.000 de linhas incorretas!',
      ],
      svgDiagramType: 'sql-where-join',
      codeBlocks: [
        {
          title: 'SQL • Junção Explícita via Cláusula WHERE',
          language: 'sql',
          code: `-- Para relacionar as tabelas sem usar o comando JOIN:
SELECT 
    l.cd_linha,
    l.tx_linha,
    i.lin_sentido,
    i.lin_extensao
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha       -- 1. Vincula a chave primária com a estrangeira
    AND l.cd_linha = '0.111';     -- 2. Aplica o filtro de negócio específico`,
        },
      ],
    },
    {
      heading: '3. Modelação Comparada: PostgreSQL vs. Oracle na SEMOB',
      body: 'Uma das principais responsabilidades de um desenvolvedor na SUTINF é compreender que a mesma pergunta operacional pode exigir caminhos estruturais distintos dependendo da base de dados utilizada.',
      svgDiagramType: 'sql-pg-vs-oracle',
      tables: [
        {
          headers: ['Informação Desejada', 'No PostgreSQL (dados_mobilidade)', 'No Oracle (DFTRANS / ATENA)'],
          rows: [
            [
              'Tarifa da Linha',
              'Está na própria tabela tab_linha (coluna vl_tarifa). Envolve 1 tabela.',
              'Exige passar por LINHAS ➔ LINHAS_ESPEC_TECNICA ➔ LINHAS_ESPEC_OPERACAO ➔ FAIXAS_TARIFARIAS. Envolve 4 tabelas.',
            ],
            [
              'Empresa Operadora',
              'tab_linha ➔ tab_operadora_linha ➔ tab_operadora. Envolve 3 tabelas.',
              'LINHAS ➔ LINHAS_ESPEC_TECNICA ➔ LINHAS_ESPEC_OPERACAO ➔ VW_OPERADORA. Envolve 4 tabelas/views.',
            ],
            [
              'Itinerário Descritivo',
              'tab_itinerario ➔ tab_itinerario_descritivo (o nome da via já está em nm_via). Envolve 2 tabelas.',
              'ITINERARIOS ➔ ITINERARIOS_DESCRITIVOS ➔ VIAS (exige vincular a tabela física de vias). Envolve 3 tabelas.',
            ],
          ],
        },
      ],
      paragraphs: [
        'Conclusão Técnica: No PostgreSQL, os dados foram desenhados para que as rotas de APIs e consultas analíticas sejam rápidas e diretas. No Oracle, o modelo prioriza a auditoria documental (decretos, contratos de permissão e histórico jurídico). Contudo, em ambos os casos, a construção do SQL baseia-se em igualar identificadores dentro do WHERE.',
      ],
    },
    {
      heading: '4. Didática dos Comandos de Consulta & Visualização (Primeiro Contato)',
      body: 'Nesta seção, cada comando é explicado a partir do seu modelo mental: o que ele faz, como o motor do banco o interpreta, a sintaxe formal e um exemplo real contextualizado na SEMOB.',
      commandCards: [
        {
          name: 'SELECT & FROM',
          role: 'A Vitrine e o Depósito',
          concept:
            'O FROM diz ao banco em qual depósito (tabela) ele deve entrar. O SELECT funciona como a lista de compras: diz quais itens (colunas) devem ser retirados das prateleiras e colocados na vitrine. Se colocar SELECT *, o banco trará todas as colunas — em APIs backend isso consome tráfego de rede e memória desnecessários.',
          code: `-- Busca apenas as colunas essenciais na tabela de linhas
SELECT 
    cd_linha AS codigo,
    tx_linha AS denominacao,
    vl_tarifa AS tarifa
FROM 
    dados_mobilidade.tab_linha;`,
        },
        {
          name: 'WHERE',
          role: 'O Filtro de Segurança e Junção',
          concept:
            'O WHERE é uma peneira. O banco de dados analisa cada linha do depósito e só deixa passar para o resultado final aquelas linhas que tornam a expressão lógica verdadeira (TRUE). Ele também faz o papel de conectar tabelas distintas, comparando suas chaves.',
          code: `-- Traz apenas linhas com tarifa de 5.50 reais
SELECT cd_linha, tx_linha, vl_tarifa
FROM dados_mobilidade.tab_linha
WHERE vl_tarifa = 5.50;`,
        },
        {
          name: 'AND, OR, NOT',
          role: 'Operadores Lógicos Combinados',
          concept: 'Permitem criar condições refinadas no WHERE:',
          details: [
            'AND: Exige que TODAS as condições sejam verdadeiras simultaneamente.',
            'OR: Basta que UMA das condições seja verdadeira para a linha ser aprovada.',
            'NOT: Inverte o resultado lógico (o que for verdadeiro vira falso e vice-versa).',
          ],
          code: `-- Linhas de tarifa 5.50 E que não comecem com 'CIRCULAR'
SELECT cd_linha, tx_linha, vl_tarifa
FROM dados_mobilidade.tab_linha
WHERE vl_tarifa = 5.50
  AND NOT (tx_linha LIKE 'CIRCULAR%');`,
        },
        {
          name: 'ORDER BY',
          role: 'A Organização da Fila',
          concept:
            'Bancos de dados relacionais guardam registros sem qualquer ordem garantida. O ORDER BY organiza o resultado final antes de exibi-lo na tela em sentido crescente (ASC, padrão) ou decrescente (DESC).',
          code: `-- Ordena os itinerários da maior extensão para a menor
SELECT id_linha, lin_sentido, lin_extensao
FROM dados_mobilidade.tab_itinerario
WHERE lin_extensao > 0
ORDER BY lin_extensao DESC;`,
        },
        {
          name: 'LIMIT (Postgres) / FETCH (Oracle)',
          role: 'O Limitador de Janela',
          concept:
            'Se uma consulta retorna 500.000 linhas, você não quer que sua IDE trave tentando renderizar tudo. O LIMIT diz ao motor: "pare de me enviar dados assim que atingir a quantidade N".',
          code: `-- No PostgreSQL: A linha com maior traçado do DF
SELECT id_linha, lin_extensao
FROM dados_mobilidade.tab_itinerario
WHERE lin_extensao IS NOT NULL
ORDER BY lin_extensao DESC
LIMIT 1;

-- No Oracle equivalente:
-- SELECT id_linha, lin_extensao FROM ... WHERE lin_extensao IS NOT NULL ORDER BY lin_extensao DESC FETCH FIRST 1 ROWS ONLY;`,
        },
        {
          name: 'DISTINCT',
          role: 'O Eliminador de Duplicatas',
          concept:
            'Se você pedir os sentidos cadastrados na tabela de itinerários, receberá milhares de linhas contendo "I", "V" e "C". O DISTINCT compara todas as linhas geradas pelo SELECT e descarta repetições.',
          code: `-- Descobre quais os tipos de sentidos existentes sem repetições
SELECT DISTINCT lin_sentido
FROM dados_mobilidade.tab_itinerario
WHERE lin_sentido IS NOT NULL;`,
        },
        {
          name: 'LIKE & ILIKE',
          role: 'A Busca Textual com Curingas',
          concept:
            'Quando não sabemos o nome exato de uma rua ou linha, usamos padrões textuais onde % significa qualquer sequência de caracteres:',
          details: [
            "'Gama%': Começa com a palavra Gama.",
            "'%Gama': Termina com a palavra Gama.",
            "'%Gama%': Contém a palavra Gama em qualquer parte do texto.",
            'ILIKE (exclusivo do PostgreSQL): Faz a busca ignorando maiúsculas e minúsculas (no Oracle usa-se UPPER(coluna) LIKE).',
          ],
          code: `-- Localiza qualquer linha que mencione 'Taguatinga'
SELECT cd_linha, tx_linha
FROM dados_mobilidade.tab_linha
WHERE tx_linha ILIKE '%TAGUATINGA%';`,
        },
        {
          name: 'IN & BETWEEN',
          role: 'Filtros de Lista e Intervalo',
          concept: 'Simplificam instruções longas com operadores OR e AND:',
          details: [
            'IN (...): Substitui múltiplos OR (ex.: vl_tarifa IN (2.70, 3.80, 5.50)).',
            'BETWEEN x AND y: Filtra valores contidos num intervalo fechado (inclusivo).',
          ],
          code: `-- Horários com partidas programadas entre 06:00 e 08:00 da manhã
SELECT id_horario, hr_prevista
FROM dados_mobilidade.tab_horario
WHERE hr_prevista BETWEEN 60000 AND 80000;`,
        },
        {
          name: 'GROUP BY & Agregadores (COUNT, SUM, AVG, MAX, MIN)',
          role: 'A Consolidação de Dados',
          concept:
            'O GROUP BY pega centenas de linhas e as "empacota" em caixas agrupadoras baseadas em valores comuns. Dentro de cada pacote, aplicamos uma função matemática:',
          details: [
            'COUNT(*): Conta a quantidade de linhas em cada pacote.',
            'SUM(coluna): Soma os valores da coluna dentro do pacote.',
            'AVG(coluna): Calcula a média aritmética dos valores.',
            'MAX(coluna) / MIN(coluna): Descobre o maior e menor valor do pacote.',
          ],
          code: `-- Conta quantos itinerários existem para cada sentido
SELECT 
    lin_sentido,
    COUNT(*) AS total_itinerarios,
    AVG(lin_extensao) AS extensao_media
FROM 
    dados_mobilidade.tab_itinerario
WHERE 
    lin_sentido IS NOT NULL
GROUP BY 
    lin_sentido;`,
        },
        {
          name: 'HAVING',
          role: 'O Filtro dos Grupos Agregados',
          concept:
            'Atenção à regra de ouro: o WHERE filtra linhas individuais ANTES do agrupamento acontecer. O HAVING filtra os grupos DEPOIS que os cálculos matemáticos foram concluídos.',
          code: `-- Mostra apenas as linhas que possuem mais de 2 itinerários cadastrados
SELECT 
    id_linha,
    COUNT(*) AS quantidade_itinerarios
FROM 
    dados_mobilidade.tab_itinerario
WHERE 
    id_linha IS NOT NULL
GROUP BY 
    id_linha
HAVING 
    COUNT(*) > 2;`,
        },
        {
          name: 'Subconsultas & WITH (CTE)',
          role: 'Consultas Modulares Aninhadas',
          concept:
            'Uma subconsulta é uma consulta SQL inserida dentro de outra para responder a uma pergunta prévia (ex.: "qual a linha que possui a extensão igual à extensão máxima?"). As CTEs (WITH nome AS (...)) nomeiam blocos auxiliares antes da consulta principal.',
          code: `-- Subconsulta no WHERE para encontrar o itinerário mais longo do sistema
SELECT id_linha, lin_extensao
FROM dados_mobilidade.tab_itinerario
WHERE lin_extensao = (
    SELECT MAX(lin_extensao) 
    FROM dados_mobilidade.tab_itinerario
    WHERE lin_extensao > 0
);`,
        },
      ],
    },
    {
      heading: '5. Tabela Resumo da Linguagem SQL & Regras de Produção',
      body: 'Referência rápida de sintaxe, posição na query e regras críticas de segurança em bancos de dados de produção:',
      tables: [
        {
          headers: ['Comando', 'Propósito Principal', 'Posição na Consulta', 'Regra de Uso na SUTINF'],
          rows: [
            ['SELECT', 'Escolhe as colunas a serem exibidas.', 'Início obrigatório', 'Evite * em APIs; projete explicitamente as colunas necessárias.'],
            ['FROM', 'Aponta a tabela ou conjunto de tabelas de origem.', 'Logo após o SELECT', 'Sempre use apelidos curtos nas tabelas (ex.: tab_linha l).'],
            ['WHERE', 'Filtra registros e conecta Chaves Primárias a Estrangeiras.', 'Após o FROM', 'Obrigatório para ligar tabelas (evita produto cartesiano) e restringir volume.'],
            ['ORDER BY', 'Ordena os resultados em ordem crescente ou decrescente.', 'Ao final da consulta', 'Use DESC para ranquear maiores valores e ASC para ordem alfabética/datas.'],
            ['LIMIT', 'Limita o total de linhas retornadas.', 'Última linha da query', 'Essencial em testes locais e para evitar estouro de memória no pgAdmin.'],
            ['DISTINCT', 'Remove linhas repetidas da projeção.', 'Imediatamente após o SELECT', 'Útil para listar empresas ou sentidos sem duplicidades.'],
            ['GROUP BY', 'Agrupa registros para consolidação matemática.', 'Após o WHERE', 'Toda coluna do SELECT que não seja agregador deve constar aqui.'],
            ['HAVING', 'Filtra os resultados consolidados pelo GROUP BY.', 'Após o GROUP BY', 'Nunca use para filtros de linhas brutas; reserve para filtros sobre COUNT/SUM.'],
          ],
        },
      ],
      callouts: [
        {
          type: 'danger',
          title: '🚨 REGRA CRÍTICA: Respeite o Banco de Produção',
          content:
            'O banco dados_mobilidade recebe posições de GPS e telemetria de frotas em tempo real. Nunca execute consultas abertas sem a cláusula WHERE ou sem LIMIT em tabelas transacionais massivas (como tab_ultima_posicao). Consultas lentas causam bloqueios (locks) e impactam a operação pública.',
        },
        {
          type: 'warning',
          title: '⚠️ Laboratório vs. Produção',
          content:
            'Para testar comandos de criação de tabelas (DDL) ou realizar testes de estresse, utilize sempre o banco bdg (Banco de Desenvolvimento e Homologação).',
        },
      ],
    },
  ],
  checklist: [
    'Compreendi o modelo mental de Tupla, Chave Primária (PK) e Chave Estrangeira (FK)',
    'Dominei a junção de tabelas declaradas no FROM utilizando vínculo explícito na cláusula WHERE',
    'Analisei as diferenças de modelagem entre PostgreSQL (dados_mobilidade) e Oracle (DFTRANS)',
    'Pratiquei os 11 comandos essenciais de SQL e as regras de proteção do banco de produção',
  ],
};
