import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  Circle,
  HelpCircle,
  Eye,
  EyeOff,
  Terminal,
  Filter,
  Award,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';

interface SqlChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  onOpenModule: (moduleId: string) => void;
}

interface SqlQuestion {
  id: number;
  level: 'basico' | 'intermediario' | 'avancado';
  levelLabel: string;
  points: number;
  title: string;
  context: string;
  tablesUsed: string[];
  hint: string;
  expectedColumns: string[];
  answerSql: string;
  explanation: string;
}

const SQL_QUESTIONS: SqlQuestion[] = [
  // NÍVEL BÁSICO
  {
    id: 1,
    level: 'basico',
    levelLabel: 'Básico',
    points: 5,
    title: 'Listagem de Linhas Ativas com Filtro WHERE',
    context:
      'A equipe de operação precisa visualizar todas as linhas de ônibus que estão atualmente ativas no sistema, ordenadas pelo código da linha.',
    tablesUsed: ['semob.linhas'],
    hint: 'Filtre pela coluna st_ativa = true na cláusula WHERE e ordene por cd_linha.',
    expectedColumns: ['cd_linha', 'nm_linha', 'vl_tarifa'],
    answerSql: `SELECT cd_linha, nm_linha, vl_tarifa
FROM semob.linhas
WHERE st_ativa = true
ORDER BY cd_linha ASC;`,
    explanation:
      'Selecionamos apenas as colunas necessárias (evitando SELECT *) e aplicamos o filtro booleano explícito no WHERE.',
  },
  {
    id: 2,
    level: 'basico',
    levelLabel: 'Básico',
    points: 5,
    title: 'Frota Fabricada a partir de 2022 com Ar-Condicionado',
    context:
      'Levante todos os veículos fabricados a partir de 2022 que possuem ar-condicionado para o relatório de modernização da frota.',
    tablesUsed: ['semob.veiculos'],
    hint: 'Combine duas condições no WHERE utilizando o operador AND (nr_ano_fabricacao >= 2022 e fl_ar_condicionado = true).',
    expectedColumns: ['nr_prefixo', 'nr_placa', 'nr_ano_fabricacao', 'qt_capacidade'],
    answerSql: `SELECT nr_prefixo, nr_placa, nr_ano_fabricacao, qt_capacidade
FROM semob.veiculos
WHERE nr_ano_fabricacao >= 2022
  AND fl_ar_condicionado = true
ORDER BY nr_ano_fabricacao DESC;`,
    explanation:
      'O operador AND garante que ambas as condições de corte sejam atendidas simultaneamente na cláusula WHERE.',
  },
  {
    id: 3,
    level: 'basico',
    levelLabel: 'Básico',
    points: 5,
    title: 'Busca Textual de Linhas com Destino ao Plano Piloto / Rodoviária',
    context:
      'Identifique todas as linhas ativas cujo nome mencione "Rodoviária" ou "Plano Piloto" (independentemente de maiúsculas/minúsculas).',
    tablesUsed: ['semob.linhas'],
    hint: 'Use o operador ILIKE no PostgreSQL combinado com % no WHERE.',
    expectedColumns: ['cd_linha', 'nm_linha', 'tp_servico'],
    answerSql: `SELECT cd_linha, nm_linha, tp_servico
FROM semob.linhas
WHERE st_ativa = true
  AND (nm_linha ILIKE '%Rodoviária%' OR nm_linha ILIKE '%Plano Piloto%');`,
    explanation:
      'O uso de parênteses ao redor do OR é essencial para não anular o filtro obrigatório st_ativa = true.',
  },
  {
    id: 4,
    level: 'basico',
    levelLabel: 'Básico',
    points: 5,
    title: 'Motoristas com CNH Categoria D ou E Ativos',
    context:
      'Liste o nome, matrícula e validade da CNH dos motoristas ativos habilitados nas categorias D ou E.',
    tablesUsed: ['semob.motoristas'],
    hint: 'Utilize o operador IN (\'D\', \'E\') juntamente com st_ativo = true no WHERE.',
    expectedColumns: ['nm_motorista', 'nr_matricula', 'tp_categoria_cnh', 'dt_validade_cnh'],
    answerSql: `SELECT nm_motorista, nr_matricula, tp_categoria_cnh, dt_validade_cnh
FROM semob.motoristas
WHERE st_ativo = true
  AND tp_categoria_cnh IN ('D', 'E')
ORDER BY dt_validade_cnh ASC;`,
    explanation:
      'O operador IN torna a leitura mais limpa do que múltiplos OR para verificar valores de uma mesma coluna.',
  },
  {
    id: 5,
    level: 'basico',
    levelLabel: 'Básico',
    points: 5,
    title: 'Faixa Tarifária Intermediária (BETWEEN)',
    context:
      'Retorne as linhas ativas cuja tarifa esteja entre R$ 3,80 e R$ 5,50.',
    tablesUsed: ['semob.linhas'],
    hint: 'Use BETWEEN 3.80 AND 5.50 na cláusula WHERE.',
    expectedColumns: ['cd_linha', 'nm_linha', 'vl_tarifa'],
    answerSql: `SELECT cd_linha, nm_linha, vl_tarifa
FROM semob.linhas
WHERE st_ativa = true
  AND vl_tarifa BETWEEN 3.80 AND 5.50
ORDER BY vl_tarifa DESC;`,
    explanation:
      'O operador BETWEEN é inclusivo nas duas extremidades (>= 3.80 e <= 5.50).',
  },
  {
    id: 6,
    level: 'basico',
    levelLabel: 'Básico',
    points: 5,
    title: 'Ocorrências Graves Pendentes de Resolução',
    context:
      'Liste as ocorrências de gravidade "ALTA" que ainda não possuem data de encerramento (dt_resolvido nulo).',
    tablesUsed: ['semob.ocorrencias'],
    hint: 'Em SQL, valores nulos devem ser filtrados no WHERE com IS NULL (nunca com = NULL).',
    expectedColumns: ['id_ocorrencia', 'id_viagem', 'tp_ocorrencia', 'dt_registro'],
    answerSql: `SELECT id_ocorrencia, id_viagem, tp_ocorrencia, dt_registro
FROM semob.ocorrencias
WHERE ds_gravidade = 'ALTA'
  AND dt_resolvido IS NULL
ORDER BY dt_registro DESC;`,
    explanation:
      'A verificação IS NULL no WHERE é indispensável para localizar registos em aberto.',
  },

  // NÍVEL INTERMEDIÁRIO
  {
    id: 7,
    level: 'intermediario',
    levelLabel: 'Intermediário',
    points: 10,
    title: 'Relação de Linhas e suas respetivas Operadoras (INNER JOIN)',
    context:
      'Exiba o código da linha, nome da linha e a sigla/nome do órgão/operadora responsável apenas para operadoras e linhas ativas.',
    tablesUsed: ['semob.linhas', 'semob.orgaos'],
    hint: 'Faça INNER JOIN entre semob.linhas l e semob.orgaos o usando id_orgao e filtre ambos no WHERE.',
    expectedColumns: ['cd_linha', 'nm_linha', 'sg_orgao', 'nm_orgao'],
    answerSql: `SELECT l.cd_linha, l.nm_linha, o.sg_orgao, o.nm_orgao
FROM semob.linhas l
INNER JOIN semob.orgaos o ON o.id_orgao = l.id_orgao
WHERE l.st_ativa = true
  AND o.st_ativo = true
ORDER BY o.sg_orgao, l.cd_linha;`,
    explanation:
      'Aliases curtos (l, o) deixam o JOIN legível e evitam ambiguidade nas colunas do SELECT e do WHERE.',
  },
  {
    id: 8,
    level: 'intermediario',
    levelLabel: 'Intermediário',
    points: 10,
    title: 'Total de Viagens e Passageiros Transportados por Linha',
    context:
      'Calcule a quantidade de viagens concluídas e o total de passageiros transportados por cada linha ativa.',
    tablesUsed: ['semob.linhas', 'semob.viagens'],
    hint: 'Use COUNT() e SUM(qt_passageiros) com GROUP BY e filtre viagens com st_viagem = \'CONCLUIDA\' no WHERE.',
    expectedColumns: ['cd_linha', 'nm_linha', 'total_viagens', 'total_passageiros'],
    answerSql: `SELECT
  l.cd_linha,
  l.nm_linha,
  COUNT(v.id_viagem) AS total_viagens,
  COALESCE(SUM(v.qt_passageiros), 0) AS total_passageiros
FROM semob.linhas l
INNER JOIN semob.viagens v ON v.id_linha = l.id_linha
WHERE l.st_ativa = true
  AND v.st_viagem = 'CONCLUIDA'
GROUP BY l.id_linha, l.cd_linha, l.nm_linha
ORDER BY total_passageiros DESC;`,
    explanation:
      'O WHERE filtra as viagens concluídas antes do agrupamento, e o COALESCE evita retorno NULL na soma.',
  },
  {
    id: 9,
    level: 'intermediario',
    levelLabel: 'Intermediário',
    points: 10,
    title: 'Linhas com Média Superior a 40 Passageiros por Viagem (HAVING)',
    context:
      'Identifique quais linhas ativas possuem média de passageiros por viagem concluída acima de 40.',
    tablesUsed: ['semob.linhas', 'semob.viagens'],
    hint: 'Filtre linhas/viagens no WHERE, agrupe com GROUP BY e aplique o corte da função agregada AVG() no HAVING.',
    expectedColumns: ['cd_linha', 'nm_linha', 'media_passageiros'],
    answerSql: `SELECT
  l.cd_linha,
  l.nm_linha,
  ROUND(AVG(v.qt_passageiros), 2) AS media_passageiros
FROM semob.linhas l
INNER JOIN semob.viagens v ON v.id_linha = l.id_linha
WHERE l.st_ativa = true
  AND v.st_viagem = 'CONCLUIDA'
GROUP BY l.id_linha, l.cd_linha, l.nm_linha
HAVING AVG(v.qt_passageiros) > 40
ORDER BY media_passageiros DESC;`,
    explanation:
      'WHERE filtra linhas individuais antes do GROUP BY; HAVING filtra o resultado agregado depois do GROUP BY.',
  },
  {
    id: 10,
    level: 'intermediario',
    levelLabel: 'Intermediário',
    points: 10,
    title: 'Veículos Ativos Sem Nenhuma Viagem Registada (LEFT JOIN)',
    context:
      'A auditoria quer descobrir quais veículos ativos da frota nunca realizaram uma viagem registada no sistema.',
    tablesUsed: ['semob.veiculos', 'semob.viagens'],
    hint: 'Use LEFT JOIN de veiculos para viagens e filtre no WHERE onde v.id_viagem IS NULL.',
    expectedColumns: ['nr_prefixo', 'nr_placa', 'nm_modelo'],
    answerSql: `SELECT ve.nr_prefixo, ve.nr_placa, ve.nm_modelo
FROM semob.veiculos ve
LEFT JOIN semob.viagens vi ON vi.id_veiculo = ve.id_veiculo
WHERE ve.st_status = 'ATIVO'
  AND vi.id_viagem IS NULL
ORDER BY ve.nr_prefixo;`,
    explanation:
      'O padrão LEFT JOIN + chave da direita IS NULL no WHERE é a forma clássica de encontrar registos órfãos/sem correspondência.',
  },
  {
    id: 11,
    level: 'intermediario',
    levelLabel: 'Intermediário',
    points: 10,
    title: 'Relatório Completo de Viagens com Motorista, Veículo e Linha',
    context:
      'Monte a visão operacional contendo código da linha, prefixo do veículo, nome do motorista e horário de partida das viagens concluídas.',
    tablesUsed: ['semob.viagens', 'semob.linhas', 'semob.veiculos', 'semob.motoristas'],
    hint: 'Encadeie 3 INNER JOINs a partir de semob.viagens e aplique o filtro no WHERE.',
    expectedColumns: ['cd_linha', 'nr_prefixo', 'nm_motorista', 'dt_partida', 'qt_passageiros'],
    answerSql: `SELECT
  l.cd_linha,
  ve.nr_prefixo,
  m.nm_motorista,
  vi.dt_partida,
  vi.qt_passageiros
FROM semob.viagens vi
INNER JOIN semob.linhas l ON l.id_linha = vi.id_linha
INNER JOIN semob.veiculos ve ON ve.id_veiculo = vi.id_veiculo
INNER JOIN semob.motoristas m ON m.id_motorista = vi.id_motorista
WHERE vi.st_viagem = 'CONCLUIDA'
ORDER BY vi.dt_partida DESC;`,
    explanation:
      'Relacionamos a tabela fato (viagens) com as três dimensões operacionais mantendo filtro explícito no WHERE.',
  },
  {
    id: 12,
    level: 'intermediario',
    levelLabel: 'Intermediário',
    points: 10,
    title: 'Receita Estimada por Operadora (Multiplicação Agregada)',
    context:
      'Calcule a receita bruta estimada (passageiros × tarifa da linha) agrupada por operadora apenas para viagens concluídas.',
    tablesUsed: ['semob.orgaos', 'semob.linhas', 'semob.viagens'],
    hint: 'Multiplique vi.qt_passageiros * l.vl_tarifa dentro do SUM() e filtre no WHERE.',
    expectedColumns: ['sg_orgao', 'nm_orgao', 'receita_estimada'],
    answerSql: `SELECT
  o.sg_orgao,
  o.nm_orgao,
  SUM(vi.qt_passageiros * l.vl_tarifa) AS receita_estimada
FROM semob.orgaos o
INNER JOIN semob.linhas l ON l.id_orgao = o.id_orgao
INNER JOIN semob.viagens vi ON vi.id_linha = l.id_linha
WHERE vi.st_viagem = 'CONCLUIDA'
  AND o.st_ativo = true
GROUP BY o.id_orgao, o.sg_orgao, o.nm_orgao
ORDER BY receita_estimada DESC;`,
    explanation:
      'A agregação financeira exige que o cálculo seja feito linha a linha dentro do SUM() após filtrar apenas viagens válidas no WHERE.',
  },

  // NÍVEL AVANÇADO
  {
    id: 13,
    level: 'avancado',
    levelLabel: 'Avançado',
    points: 15,
    title: 'Linhas com Tarifa Acima da Média Geral (Subquery + WHERE)',
    context:
      'Liste as linhas ativas cuja tarifa é superior à média tarifária de todas as linhas ativas do sistema.',
    tablesUsed: ['semob.linhas'],
    hint: 'Compare vl_tarifa > (SELECT AVG(vl_tarifa) FROM semob.linhas WHERE st_ativa = true).',
    expectedColumns: ['cd_linha', 'nm_linha', 'vl_tarifa'],
    answerSql: `SELECT cd_linha, nm_linha, vl_tarifa
FROM semob.linhas
WHERE st_ativa = true
  AND vl_tarifa > (
    SELECT AVG(vl_tarifa)
    FROM semob.linhas
    WHERE st_ativa = true
  )
ORDER BY vl_tarifa DESC;`,
    explanation:
      'Tanto a consulta externa quanto a subconsulta utilizam cláusula WHERE para garantir que linhas inativas não distorçam a média.',
  },
  {
    id: 14,
    level: 'avancado',
    levelLabel: 'Avançado',
    points: 15,
    title: 'Ranking das Top 3 Linhas por Operadora (CTE + ROW_NUMBER)',
    context:
      'Utilizando Window Functions e CTE (WITH), classifique as 3 linhas com maior volume de passageiros dentro de cada operadora.',
    tablesUsed: ['semob.orgaos', 'semob.linhas', 'semob.viagens'],
    hint: 'Crie uma CTE com ROW_NUMBER() OVER (PARTITION BY o.id_orgao ORDER BY SUM(vi.qt_passageiros) DESC) e filtre rn <= 3 no WHERE externo.',
    expectedColumns: ['sg_orgao', 'cd_linha', 'total_passageiros', 'ranking'],
    answerSql: `WITH ranking_linhas AS (
  SELECT
    o.sg_orgao,
    l.cd_linha,
    l.nm_linha,
    SUM(vi.qt_passageiros) AS total_passageiros,
    ROW_NUMBER() OVER (
      PARTITION BY o.id_orgao
      ORDER BY SUM(vi.qt_passageiros) DESC
    ) AS ranking
  FROM semob.orgaos o
  INNER JOIN semob.linhas l ON l.id_orgao = o.id_orgao
  INNER JOIN semob.viagens vi ON vi.id_linha = l.id_linha
  WHERE vi.st_viagem = 'CONCLUIDA'
    AND l.st_ativa = true
  GROUP BY o.id_orgao, o.sg_orgao, l.id_linha, l.cd_linha, l.nm_linha
)
SELECT sg_orgao, cd_linha, nm_linha, total_passageiros, ranking
FROM ranking_linhas
WHERE ranking <= 3
ORDER BY sg_orgao, ranking;`,
    explanation:
      'A CTE organiza a partição analítica por operadora e a query principal filtra o top 3 no WHERE.',
  },
  {
    id: 15,
    level: 'avancado',
    levelLabel: 'Avançado',
    points: 15,
    title: 'Taxa de Ocorrências por 100 Viagens (Indicador de Risco)',
    context:
      'Calcule o percentual de viagens que tiveram ocorrências registadas por linha ativa.',
    tablesUsed: ['semob.linhas', 'semob.viagens', 'semob.ocorrencias'],
    hint: 'Use COUNT(DISTINCT oc.id_viagem) dividido por NULLIF(COUNT(DISTINCT vi.id_viagem), 0).',
    expectedColumns: ['cd_linha', 'total_viagens', 'viagens_com_ocorrencia', 'taxa_percentual'],
    answerSql: `SELECT
  l.cd_linha,
  COUNT(DISTINCT vi.id_viagem) AS total_viagens,
  COUNT(DISTINCT oc.id_viagem) AS viagens_com_ocorrencia,
  ROUND(
    (COUNT(DISTINCT oc.id_viagem)::numeric / NULLIF(COUNT(DISTINCT vi.id_viagem), 0)) * 100,
    2
  ) AS taxa_percentual
FROM semob.linhas l
INNER JOIN semob.viagens vi ON vi.id_linha = l.id_linha
LEFT JOIN semob.ocorrencias oc ON oc.id_viagem = vi.id_viagem
WHERE l.st_ativa = true
  AND vi.st_viagem = 'CONCLUIDA'
GROUP BY l.id_linha, l.cd_linha
ORDER BY taxa_percentual DESC;`,
    explanation:
      'O uso de NULLIF previne erro de divisão por zero e COUNT(DISTINCT) evita duplicar viagens que tiveram mais de uma ocorrência.',
  },
  {
    id: 16,
    level: 'avancado',
    levelLabel: 'Avançado',
    points: 15,
    title: 'Classificação de Ocupação das Viagens (CASE WHEN + WHERE)',
    context:
      'Classifique cada viagem concluída em "LOTADO" (>= 90% da capacidade do veículo), "NORMAL" (entre 40% e 89%) ou "BAIXA OCUPAÇÃO" (< 40%).',
    tablesUsed: ['semob.viagens', 'semob.veiculos', 'semob.linhas'],
    hint: 'Compare vi.qt_passageiros com ve.qt_capacidade dentro de uma expressão CASE WHEN.',
    expectedColumns: ['id_viagem', 'cd_linha', 'qt_passageiros', 'qt_capacidade', 'nivel_ocupacao'],
    answerSql: `SELECT
  vi.id_viagem,
  l.cd_linha,
  vi.qt_passageiros,
  ve.qt_capacidade,
  CASE
    WHEN vi.qt_passageiros >= (ve.qt_capacidade * 0.9) THEN 'LOTADO'
    WHEN vi.qt_passageiros >= (ve.qt_capacidade * 0.4) THEN 'NORMAL'
    ELSE 'BAIXA OCUPAÇÃO'
  END AS nivel_ocupacao
FROM semob.viagens vi
INNER JOIN semob.veiculos ve ON ve.id_veiculo = vi.id_veiculo
INNER JOIN semob.linhas l ON l.id_linha = vi.id_linha
WHERE vi.st_viagem = 'CONCLUIDA'
  AND ve.qt_capacidade > 0
ORDER BY vi.dt_partida DESC;`,
    explanation:
      'Garantimos ve.qt_capacidade > 0 no WHERE e aplicamos a regra de negócio diretamente na projeção com CASE WHEN.',
  },
  {
    id: 17,
    level: 'avancado',
    levelLabel: 'Avançado',
    points: 15,
    title: 'Auditoria de Motoristas com Viagens em Veículos em Manutenção (EXISTS)',
    context:
      'Verifique se existe algum motorista ativo que possua viagem associada a um veículo cujo status atual é "MANUTENCAO".',
    tablesUsed: ['semob.motoristas', 'semob.viagens', 'semob.veiculos'],
    hint: 'Utilize EXISTS no WHERE correlacionando o id_motorista com a subconsulta.',
    expectedColumns: ['id_motorista', 'nm_motorista', 'nr_matricula'],
    answerSql: `SELECT m.id_motorista, m.nm_motorista, m.nr_matricula
FROM semob.motoristas m
WHERE m.st_ativo = true
  AND EXISTS (
    SELECT 1
    FROM semob.viagens vi
    INNER JOIN semob.veiculos ve ON ve.id_veiculo = vi.id_veiculo
    WHERE vi.id_motorista = m.id_motorista
      AND ve.st_status = 'MANUTENCAO'
  );`,
    explanation:
      'O operador EXISTS interrompe a busca assim que encontra a primeira ocorrência, sendo mais performático que IN em tabelas grandes.',
  },
  {
    id: 18,
    level: 'avancado',
    levelLabel: 'Avançado',
    points: 15,
    title: 'Atualização Segura de Tarifa em Lote com Filtro Estrito WHERE',
    context:
      'Aplique um reajuste de 5% apenas nas linhas ativas do serviço "CONVENCIONAL" pertencentes ao órgão de ID 1.',
    tablesUsed: ['semob.linhas'],
    hint: 'Jamais execute UPDATE sem WHERE! Especifique st_ativa = true, tp_servico = \'CONVENCIONAL\' e id_orgao = 1.',
    expectedColumns: ['Comando DML UPDATE com WHERE explícito'],
    answerSql: `UPDATE semob.linhas
SET vl_tarifa = ROUND(vl_tarifa * 1.05, 2)
WHERE st_ativa = true
  AND tp_servico = 'CONVENCIONAL'
  AND id_orgao = 1;`,
    explanation:
      'Em produção, todo comando UPDATE ou DELETE deve obrigatoriamente conter cláusula WHERE restritiva validada previamente com um SELECT.',
  },
];

const SCHEMA_TABLES = [
  {
    name: 'semob.orgaos',
    pk: 'id_orgao',
    columns: 'id_orgao, sg_orgao, nm_orgao, st_ativo',
  },
  {
    name: 'semob.linhas',
    pk: 'id_linha',
    columns: 'id_linha, id_orgao (FK), cd_linha, nm_linha, vl_tarifa, tp_servico, st_ativa',
  },
  {
    name: 'semob.veiculos',
    pk: 'id_veiculo',
    columns: 'id_veiculo, id_orgao (FK), nr_prefixo, nr_placa, nm_modelo, nr_ano_fabricacao, qt_capacidade, fl_ar_condicionado, st_status',
  },
  {
    name: 'semob.motoristas',
    pk: 'id_motorista',
    columns: 'id_motorista, id_orgao (FK), nm_motorista, nr_matricula, tp_categoria_cnh, dt_validade_cnh, st_ativo',
  },
  {
    name: 'semob.viagens',
    pk: 'id_viagem',
    columns: 'id_viagem, id_linha (FK), id_veiculo (FK), id_motorista (FK), dt_partida, dt_chegada, qt_passageiros, vl_km_percorrido, st_viagem',
  },
  {
    name: 'semob.ocorrencias',
    pk: 'id_ocorrencia',
    columns: 'id_ocorrencia, id_viagem (FK), tp_ocorrencia, ds_gravidade, ds_observacao, dt_registro, dt_resolvido',
  },
];

export const SqlChallengeScreen: React.FC<SqlChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  onOpenModule,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'todos' | 'basico' | 'intermediario' | 'avancado'>('todos');
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Carrega as queries SQL já salvas pelo estagiário no storageService
  const [userQueries, setUserQueries] = useState<Record<number, string>>(() => {
    const saved = storageService.getProgress().challengeSubmissions?.['challenge-sql-relatorios'];
    return saved?.sqlQueries || {};
  });

  // Persiste automaticamente cada alteração nas queries para o futuro motor SQL
  useEffect(() => {
    storageService.saveChallengeSubmission('challenge-sql-relatorios', {
      sqlQueries: userQueries,
    });
  }, [userQueries]);

  const filteredQuestions = SQL_QUESTIONS.filter(
    (q) => selectedLevel === 'todos' || q.level === selectedLevel
  );

  const totalPoints = SQL_QUESTIONS.reduce((acc, q) => acc + q.points, 0);
  const earnedPoints = SQL_QUESTIONS.reduce(
    (acc, q) => (completedItems.includes(`sql-q-${q.id}`) ? acc + q.points : acc),
    0
  );

  const handleCopySql = (id: number, sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasWhereClause = (queryText?: string) => {
    if (!queryText) return false;
    return /\bwhere\b/i.test(queryText);
  };

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Database size={14} /> Desafio Prático • Engenharia de Dados & SQL
          </span>
          <h1>Desafio SQL — Mobilidade Urbana (18 Questões)</h1>
          <p>
            Resolva problemas reais de consulta, relacionamento e agregação no esquema{' '}
            <code>semob</code>. Todas as suas queries ficam salvas automaticamente no seu navegador e
            devem utilizar cláusula <code>WHERE</code> explícita.
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-3-banco-dados')}>
              <BookOpen size={16} /> Revisar Módulo de Banco de Dados na Plataforma
            </button>
          </div>
        </div>

        <div className="hero-stats-card">
          <div className="stat-circle">
            <Award size={28} />
            <div>
              <strong>
                {earnedPoints} / {totalPoints} pts
              </strong>
              <span>Pontuação acumulada</span>
            </div>
          </div>
          <div className="hero-mini-meta">
            <span>
              ✅ {completedItems.length} de {SQL_QUESTIONS.length} questões resolvidas
            </span>
          </div>
        </div>
      </section>

      {/* Referência Rápida do Esquema Relacional */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>🗄️ Mapa Rápido do Esquema Relacional (Schema: semob)</h2>
            <p className="text-muted">
              Consulte as 6 tabelas e suas chaves estrangeiras para montar os seus JOINs e filtros WHERE.
            </p>
          </div>
        </div>

        <div className="cards-grid three-cols" style={{ marginTop: '1rem' }}>
          {SCHEMA_TABLES.map((tb) => (
            <div key={tb.name} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>{tb.name}</strong>
                <span className="status-pill passed" style={{ fontSize: '0.7rem' }}>
                  PK: {tb.pk}
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'monospace', lineHeight: 1.5 }}>
                {tb.columns}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Barra de Filtros por Nível */}
      <section className="section-card">
        <div className="sql-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Filter size={18} /> Filtrar por complexidade:
          </div>
          <div className="sql-filter-buttons">
            {(['todos', 'basico', 'intermediario', 'avancado'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`sql-filter-btn ${selectedLevel === lvl ? 'active' : ''}`}
              >
                {lvl === 'todos'
                  ? 'Todas (18)'
                  : lvl === 'basico'
                  ? 'Básico (6)'
                  : lvl === 'intermediario'
                  ? 'Intermediário (6)'
                  : 'Avançado (6)'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Questões */}
        <div className="sql-questions-list" style={{ marginTop: '1.5rem' }}>
          {filteredQuestions.map((q) => {
            const itemKey = `sql-q-${q.id}`;
            const isCompleted = completedItems.includes(itemKey);
            const currentQuery = userQueries[q.id] || '';
            const queryHasWhere = hasWhereClause(currentQuery);

            return (
              <div
                key={q.id}
                className={`sql-question-card ${isCompleted ? 'completed' : ''}`}
              >
                <div className="sql-question-header">
                  <div className="sql-question-title-group">
                    <button
                      onClick={() => onToggleItem(itemKey)}
                      className="sql-check-btn"
                      title={isCompleted ? 'Desmarcar questão' : 'Marcar como resolvida'}
                    >
                      {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className={`sql-level-pill ${q.level}`}>
                          Questão #{q.id} • {q.levelLabel}
                        </span>
                        <span className="status-pill pending">{q.points} pts</span>
                      </div>
                      <h3 style={{ marginTop: '0.35rem' }}>{q.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="sql-question-context">{q.context}</p>

                <div className="sql-meta-tags">
                  <span>
                    <strong>Tabelas:</strong> {q.tablesUsed.join(', ')}
                  </span>
                  <span>
                    <strong>Colunas esperadas:</strong> {q.expectedColumns.join(', ')}
                  </span>
                </div>

                {/* Área de Escrita da Query pelo Aluno (Persistida no storageService) */}
                <div className="sql-editor-box" style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Terminal size={14} /> Sua Query SQL (salva automaticamente):
                    </label>
                    {currentQuery.trim().length > 0 && (
                      <span
                        className={`status-pill ${queryHasWhere ? 'passed' : 'pending'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {queryHasWhere ? '✓ Cláusula WHERE detetada' : '⚠️ Adicione cláusula WHERE'}
                      </span>
                    )}
                  </div>
                  <textarea
                    className="sql-editor-textarea"
                    placeholder={`-- Escreva aqui a sua query SQL para a Questão #${q.id} (use sempre WHERE)...`}
                    value={currentQuery}
                    onChange={(e) =>
                      setUserQueries((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                  />
                </div>

                {/* Botões de Dica e Gabarito Embutido */}
                <div className="sql-card-actions" style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      setShowHint((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                  >
                    <HelpCircle size={15} />
                    {showHint[q.id] ? 'Ocultar Dica' : 'Ver Dica Técnica'}
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      setShowAnswer((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                  >
                    {showAnswer[q.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                    {showAnswer[q.id] ? 'Ocultar Gabarito Comentado' : 'Comparar com Gabarito Oficial'}
                  </button>
                </div>

                {showHint[q.id] && (
                  <div className="sql-hint-box" style={{ marginTop: '0.85rem' }}>
                    <Sparkles size={16} />
                    <span>
                      <strong>Dica:</strong> {q.hint}
                    </span>
                  </div>
                )}

                {showAnswer[q.id] && (
                  <div className="sql-answer-box" style={{ marginTop: '0.85rem' }}>
                    {!queryHasWhere && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                          marginBottom: '0.6rem',
                          color: '#f59e0b',
                        }}
                      >
                        <AlertTriangle size={15} />
                        <span>
                          Recomendação: escreva a sua própria query com <code>WHERE</code> no editor acima antes de marcar como concluída!
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.82rem' }}>✅ Solução SQL de Referência:</strong>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => handleCopySql(q.id, q.answerSql)}
                      >
                        {copiedId === q.id ? <Check size={13} /> : <Copy size={13} />}
                        {copiedId === q.id ? 'Copiado!' : 'Copiar SQL'}
                      </button>
                    </div>
                    <pre className="code-block">
                      <code>{q.answerSql}</code>
                    </pre>
                    <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>
                      <strong>Explicação:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Painel Padronizado de Revisão e Entrega do Desafio SQL */}
      <ChallengeSubmissionPanel
        challengeId="challenge-sql-relatorios"
        title="Validação Final do Desafio de Banco de Dados (SQL)"
        subtitle="Confirme se todas as suas queries respeitam as diretrizes de segurança e performance antes de registar a entrega."
        requireRepoUrl={false}
        prChecklist={[
          'Todas as 18 consultas e comandos de atualização possuem cláusula WHERE explícita?',
          'Evitei o uso de SELECT * projetando apenas as colunas pedidas em cada relatório?',
          'Utilizei IS NULL corretamente para filtrar campos vazios (Questões 6 e 10)?',
          'Apliquei HAVING apenas para filtrar funções agregadas após o GROUP BY (Questão 9)?',
        ]}
      />
    </div>
  );
};
export default SqlChallengeScreen;
