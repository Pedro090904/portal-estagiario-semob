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
  Play,
} from 'lucide-react';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';
import { ChallengeSubmission } from '../types';
import {
  validateStudentQuery,
  SqlValidationReport,
} from '../services/sqlSandboxEngine';

interface SqlChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  onOpenModule: (moduleId: string) => void;
  submission?: ChallengeSubmission;
  onSaveSubmission: (challengeId: string, data: Partial<ChallengeSubmission>) => void;
}

export interface SqlQuestion {
  id: string; // 'a' até 'y'
  part: 'parte1' | 'parte2' | 'parte3';
  partLabel: string;
  points: number;
  title: string;
  badge: string;
  hint: string;
  explanation: string;
  answerSql: string;
}

export const SCHEMA_TABLES = [
  {
    name: 'dados_mobilidade.tab_linha (l)',
    pk: 'id_linha',
    columns: 'id_linha, cd_linha, tx_linha, vl_tarifa, fx_tarifaria, sentido',
  },
  {
    name: 'dados_mobilidade.tab_itinerario (i)',
    pk: 'id_itinerario',
    columns: 'id_itinerario, id_linha (FK), lin_sentido, lin_extensao, geo_linhas_lin (PostGIS)',
  },
  {
    name: 'dados_mobilidade.tab_itinerario_descritivo (d)',
    pk: 'id_itinerario_descritivo',
    columns: 'id_itinerario (FK), nm_sequencia, nm_via, localidade',
  },
  {
    name: 'dados_mobilidade.tab_operadora_linha (ol)',
    pk: 'id_operadora_linha',
    columns: 'id_operadora_linha, id_linha (FK), id_operadora (FK) — Tabela Associativa N:N',
  },
  {
    name: 'dados_mobilidade.tab_operadora (o)',
    pk: 'id_operadora',
    columns: 'id_operadora, nm_operadora, nm_cpf_cnpj',
  },
  {
    name: 'dados_mobilidade.tab_horario (h)',
    pk: 'id_horario',
    columns: 'id_horario, id_operadora_linha (FK), sentido, hr_prevista (HHMMSS), segunda..domingo',
  },
];

export const SQL_QUESTIONS: SqlQuestion[] = [
  // PARTE I: INVESTIGANDO A LINHA 0.111 (a - h)
  {
    id: 'a',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'a. Liste as linhas de ônibus disponíveis, trazendo apenas o nome e o número da linha.',
    badge: 'tab_linha',
    hint: 'Envolve apenas a tabela principal de linhas (tab_linha). Use projeção de colunas com apelidos (AS).',
    explanation: 'Consulta de catálogo simples em tabela única. Projetamos tx_linha e cd_linha aplicando apelidos legíveis.',
    answerSql: `SELECT 
    tx_linha AS nome_linha,
    cd_linha AS numero_linha
FROM 
    dados_mobilidade.tab_linha;`,
  },
  {
    id: 'b',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'b. Apresente o nome, código e extensão especificamente da linha 0.111.',
    badge: 'tab_linha + tab_itinerario',
    hint: 'Relacione tab_linha e tab_itinerario através da chave id_linha na cláusula WHERE.',
    explanation: 'O nome e o código estão em tab_linha, mas a extensão reside em tab_itinerario. Declaramos ambas no FROM e igualamos l.id_linha = i.id_linha no WHERE.',
    answerSql: `SELECT 
    l.tx_linha AS nome_linha,
    l.cd_linha AS codigo_linha,
    i.lin_extensao AS extensao_km
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND l.cd_linha = '0.111';`,
  },
  {
    id: 'c',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'c. Qual é a extensão total da linha 0.111?',
    badge: 'SUM() + GROUP BY',
    hint: 'Como a linha possui mais de um sentido cadastrado, utilize SUM(i.lin_extensao) agrupado pelo código da linha.',
    explanation: 'A linha possui trajetos de ida e volta cadastrados separadamente. Somamos os registos com SUM(i.lin_extensao) agrupando por l.cd_linha.',
    answerSql: `SELECT 
    l.cd_linha,
    SUM(i.lin_extensao) AS extensao_total_km
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND l.cd_linha = '0.111'
GROUP BY 
    l.cd_linha;`,
  },
  {
    id: 'd',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'd. Qual o traçado espacial (geometria) da linha 0.111?',
    badge: 'PostGIS • ST_AsText',
    hint: 'A coluna geométrica geo_linhas_lin é binária. Utilize a função PostGIS ST_AsText() para torná-la legível em WKT.',
    explanation: 'A coluna geo_linhas_lin é do tipo geometry(linestring, 4326). Usamos public.ST_AsText() para convertê-la em coordenadas vetoriais legíveis.',
    answerSql: `SELECT 
    l.cd_linha,
    i.lin_sentido,
    public.ST_AsText(i.geo_linhas_lin) AS wkt_geometria
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND l.cd_linha = '0.111';`,
  },
  {
    id: 'e',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'e. Qual é o itinerário em formato de texto descritivo da linha 0.111?',
    badge: '3 Tabelas via WHERE',
    hint: 'Navegue de tab_linha até tab_itinerario e desta até tab_itinerario_descritivo usando WHERE, ordenando por nm_sequencia.',
    explanation: 'O nome das vias está em tab_itinerario_descritivo (d). Ligamos l.id_linha = i.id_linha e i.id_itinerario = d.id_itinerario no WHERE.',
    answerSql: `SELECT 
    l.cd_linha,
    i.lin_sentido,
    d.nm_sequencia,
    d.nm_via,
    d.localidade
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i,
    dados_mobilidade.tab_itinerario_descritivo d
WHERE 
    l.id_linha = i.id_linha
    AND i.id_itinerario = d.id_itinerario
    AND l.cd_linha = '0.111'
ORDER BY 
    i.lin_sentido ASC,
    d.nm_sequencia ASC;`,
  },
  {
    id: 'f',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'f. Qual o valor atual da tarifa da linha 0.111?',
    badge: 'tab_linha',
    hint: 'No PostgreSQL, essa informação reside diretamente na tabela tab_linha na coluna vl_tarifa.',
    explanation: 'No banco PostgreSQL da SEMOB, o valor tarifário está desnormalizado e acessível diretamente na coluna vl_tarifa de tab_linha.',
    answerSql: `SELECT 
    cd_linha,
    tx_linha,
    vl_tarifa,
    fx_tarifaria
FROM 
    dados_mobilidade.tab_linha
WHERE 
    cd_linha = '0.111';`,
  },
  {
    id: 'g',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'g. Quais são os horários de operação da linha 0.111, detalhados por dia da semana e ordem de partida?',
    badge: 'tab_horario',
    hint: 'Relacione tab_linha, a associativa tab_operadora_linha e tab_horario no WHERE.',
    explanation: 'Associamos tab_linha com tab_operadora_linha (ol) e esta com tab_horario (h) via id_operadora_linha.',
    answerSql: `SELECT 
    l.cd_linha,
    h.sentido,
    h.hr_prevista,
    h.segunda,
    h.terca,
    h.quarta,
    h.quinta,
    h.sexta,
    h.sabado,
    h.domingo
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_operadora_linha ol,
    dados_mobilidade.tab_horario h
WHERE 
    l.id_linha = ol.id_linha
    AND ol.id_operadora_linha = h.id_operadora_linha
    AND l.cd_linha = '0.111'
ORDER BY 
    h.sentido ASC,
    h.hr_prevista ASC;`,
  },
  {
    id: 'h',
    part: 'parte1',
    partLabel: 'Parte I • Linha 0.111',
    points: 4,
    title: 'h. Qual empresa permissionária opera a linha 0.111?',
    badge: 'tab_operadora',
    hint: 'Conecte tab_linha à tab_operadora passando pela associativa tab_operadora_linha no WHERE.',
    explanation: 'A relação N:N entre linhas e operadoras é resolvida por tab_operadora_linha: l.id_linha = ol.id_linha AND ol.id_operadora = o.id_operadora.',
    answerSql: `SELECT 
    l.cd_linha,
    l.tx_linha,
    o.nm_operadora,
    o.nm_cpf_cnpj
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_operadora_linha ol,
    dados_mobilidade.tab_operadora o
WHERE 
    l.id_linha = ol.id_linha
    AND ol.id_operadora = o.id_operadora
    AND l.cd_linha = '0.111';`,
  },

  // PARTE II: COMPREENDENDO OS SENTIDOS — LINHA 0.170 (i - o)
  {
    id: 'i',
    part: 'parte2',
    partLabel: 'Parte II • Linha 0.170',
    points: 4,
    title: 'i. Apresente o nome, código e extensão da linha 0.170.',
    badge: 'tab_linha + tab_itinerario',
    hint: 'Semelhante ao exercício b, mas filtrando pelo código 0.170 no WHERE.',
    explanation: 'Junção explícita no WHERE entre tab_linha e tab_itinerario filtrando cd_linha = \'0.170\'.',
    answerSql: `SELECT 
    l.cd_linha,
    l.tx_linha,
    i.lin_extensao AS extensao_km
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND l.cd_linha = '0.170';`,
  },
  {
    id: 'j',
    part: 'parte2',
    partLabel: 'Parte II • Linha 0.170',
    points: 4,
    title: 'j. Qual a extensão da linha 0.170, separada por sentido (ida/volta)?',
    badge: 'Segmentação de Sentido',
    hint: 'Projete a coluna i.lin_sentido ao lado da extensão sem aplicar soma agregada.',
    explanation: 'Projetamos individualmente i.lin_sentido para visualizar a quilometragem na Ida (I) e na Volta (V).',
    answerSql: `SELECT 
    l.cd_linha,
    l.tx_linha,
    i.lin_sentido,
    i.lin_extensao AS extensao_km
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND l.cd_linha = '0.170'
ORDER BY 
    i.lin_sentido ASC;`,
  },
  {
    id: 'k',
    part: 'parte2',
    partLabel: 'Parte II • Linha 0.170',
    points: 4,
    title: 'k. Qual o traçado espacial da linha 0.170, segmentado por sentido?',
    badge: 'PostGIS por Sentido',
    hint: 'Aplique public.ST_AsText(i.geo_linhas_lin) projetando i.lin_sentido.',
    explanation: 'O traçado geográfico de ida difere da volta devido a vias de mão única. ST_AsText() projeta cada geometria por sentido.',
    answerSql: `SELECT 
    l.cd_linha,
    i.lin_sentido,
    public.ST_AsText(i.geo_linhas_lin) AS wkt_geometria
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND l.cd_linha = '0.170';`,
  },
  {
    id: 'l',
    part: 'parte2',
    partLabel: 'Parte II • Linha 0.170',
    points: 4,
    title: 'l. Qual o itinerário em formato de texto da linha 0.170, por sentido?',
    badge: 'Vias Ordenadas',
    hint: 'Vincule tab_itinerario_descritivo ordenando por i.lin_sentido ASC, d.nm_sequencia ASC.',
    explanation: 'Unimos as 3 tabelas via WHERE garantindo a ordenação sequencial das vias para cada sentido.',
    answerSql: `SELECT 
    l.cd_linha,
    i.lin_sentido,
    d.nm_sequencia,
    d.nm_via,
    d.localidade
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i,
    dados_mobilidade.tab_itinerario_descritivo d
WHERE 
    l.id_linha = i.id_linha
    AND i.id_itinerario = d.id_itinerario
    AND l.cd_linha = '0.170'
ORDER BY 
    i.lin_sentido ASC,
    d.nm_sequencia ASC;`,
  },
  {
    id: 'm',
    part: 'parte2',
    partLabel: 'Parte II • Linha 0.170',
    points: 4,
    title: 'm. Qual o valor da tarifa da linha 0.170?',
    badge: 'Tarifa',
    hint: 'Consulta direta em tab_linha filtrando cd_linha = \'0.170\'.',
    explanation: 'Consulta pontual sobre a coluna vl_tarifa filtrada por cd_linha = \'0.170\'.',
    answerSql: `SELECT 
    cd_linha,
    tx_linha,
    vl_tarifa
FROM 
    dados_mobilidade.tab_linha
WHERE 
    cd_linha = '0.170';`,
  },
  {
    id: 'n',
    part: 'parte2',
    partLabel: 'Parte II • Linha 0.170',
    points: 4,
    title: 'n. Quais são os horários (por dia da semana e ordem de partida) da linha 0.170, agrupados por sentido?',
    badge: 'Quadro Horário',
    hint: 'Ordene os resultados por h.sentido ASC, h.hr_prevista ASC.',
    explanation: 'Conectamos a linha até a tabela de horários através de tab_operadora_linha, ordenando pelo sentido e hora prevista.',
    answerSql: `SELECT 
    l.cd_linha,
    h.sentido,
    h.hr_prevista,
    h.segunda,
    h.terca,
    h.quarta,
    h.quinta,
    h.sexta,
    h.sabado,
    h.domingo
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_operadora_linha ol,
    dados_mobilidade.tab_horario h
WHERE 
    l.id_linha = ol.id_linha
    AND ol.id_operadora_linha = h.id_operadora_linha
    AND l.cd_linha = '0.170'
ORDER BY 
    h.sentido ASC,
    h.hr_prevista ASC;`,
  },
  {
    id: 'o',
    part: 'parte2',
    partLabel: 'Parte II • Linha 0.170',
    points: 4,
    title: 'o. Qual empresa opera a linha 0.170?',
    badge: 'Operadora',
    hint: 'Vinculação de 3 tabelas no WHERE filtrando por cd_linha = \'0.170\'.',
    explanation: 'Vinculamos tab_linha, tab_operadora_linha e tab_operadora no WHERE.',
    answerSql: `SELECT 
    l.cd_linha,
    o.nm_operadora
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_operadora_linha ol,
    dados_mobilidade.tab_operadora o
WHERE 
    l.id_linha = ol.id_linha
    AND ol.id_operadora = o.id_operadora
    AND l.cd_linha = '0.170';`,
  },

  // PARTE III: CRUZAMENTOS ESTRATÉGICOS & BI (p - y)
  {
    id: 'p',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'p. Quais linhas do sistema possuem uma extensão superior a 70 km?',
    badge: 'WHERE lin_extensao > 70',
    hint: 'Use i.lin_extensao > 70.00 no WHERE combinado com SELECT DISTINCT.',
    explanation: 'Fazemos a junção de tab_linha com tab_itinerario no WHERE e filtramos i.lin_extensao > 70.00.',
    answerSql: `SELECT DISTINCT 
    l.cd_linha,
    l.tx_linha,
    i.lin_sentido,
    i.lin_extensao
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND i.lin_extensao > 70.00
ORDER BY 
    i.lin_extensao DESC;`,
  },
  {
    id: 'q',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'q. Qual é a linha de ônibus mais curta de todo o sistema?',
    badge: 'Subconsulta / MIN()',
    hint: 'Use uma subconsulta com SELECT MIN(lin_extensao) WHERE lin_extensao > 0.',
    explanation: 'A subconsulta calcula o menor valor positivo de extensão com MIN(lin_extensao) e a consulta externa recupera os dados da linha.',
    answerSql: `SELECT 
    l.cd_linha,
    l.tx_linha,
    i.lin_sentido,
    i.lin_extensao
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND i.lin_extensao = (
        SELECT MIN(lin_extensao) 
        FROM dados_mobilidade.tab_itinerario 
        WHERE lin_extensao > 0
    );`,
  },
  {
    id: 'r',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'r. Qual é a linha de ônibus mais longa do sistema?',
    badge: 'Subconsulta / MAX()',
    hint: 'Utilize subconsulta escalar com SELECT MAX(lin_extensao).',
    explanation: 'Utilizamos a função de agregação MAX(lin_extensao) na subconsulta para encontrar o maior percurso do DF.',
    answerSql: `SELECT 
    l.cd_linha,
    l.tx_linha,
    i.lin_sentido,
    i.lin_extensao
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND i.lin_extensao = (
        SELECT MAX(lin_extensao) 
        FROM dados_mobilidade.tab_itinerario
    );`,
  },
  {
    id: 's',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 's. Quantas linhas no total operam no formato "circular"?',
    badge: 'COUNT(DISTINCT)',
    hint: 'Combine COUNT(DISTINCT l.id_linha) com o filtro de sentido circular no WHERE.',
    explanation: 'O formato circular é sinalizado por C em lin_sentido. COUNT(DISTINCT l.id_linha) garante contagem única por linha.',
    answerSql: `SELECT 
    COUNT(DISTINCT l.id_linha) AS total_linhas_circulares
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND (i.lin_sentido = 'C' OR i.lin_sentido ILIKE '%CIRC%');`,
  },
  {
    id: 't',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 't. Dentre as linhas de sentido circular, qual possui a maior extensão?',
    badge: 'ORDER BY + LIMIT 1',
    hint: 'Filtre apenas circulares no WHERE, ordene por i.lin_extensao DESC e aplique LIMIT 1.',
    explanation: 'Filtramos apenas itinerários circulares, ordenamos pela extensão de forma decrescente e cortamos no primeiro registo com LIMIT 1.',
    answerSql: `SELECT 
    l.cd_linha,
    l.tx_linha,
    i.lin_extensao
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_itinerario i
WHERE 
    l.id_linha = i.id_linha
    AND (i.lin_sentido = 'C' OR i.lin_sentido ILIKE '%CIRC%')
ORDER BY 
    i.lin_extensao DESC
LIMIT 1;`,
  },
  {
    id: 'u',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'u. Quais linhas possuem a tarifa exata de R$ 5,50?',
    badge: 'vl_tarifa = 5.50',
    hint: 'Filtro direto na coluna vl_tarifa = 5.50 na tabela tab_linha.',
    explanation: 'Filtro exato na coluna vl_tarifa = 5.50 ordenado pelo código da linha.',
    answerSql: `SELECT 
    cd_linha,
    tx_linha,
    vl_tarifa
FROM 
    dados_mobilidade.tab_linha
WHERE 
    vl_tarifa = 5.50
ORDER BY 
    cd_linha ASC;`,
  },
  {
    id: 'v',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'v. Quais linhas são operadas especificamente pela empresa "Piracicabana"?',
    badge: 'ILIKE em tab_operadora',
    hint: 'Conecte tab_linha, tab_operadora_linha e tab_operadora no WHERE e filtre o.nm_operadora ILIKE \'%PIRACICABANA%\'.',
    explanation: 'Ligamos as 3 tabelas operacionais no WHERE e aplicamos ILIKE sobre o nome da operadora.',
    answerSql: `SELECT DISTINCT 
    l.cd_linha,
    l.tx_linha,
    o.nm_operadora
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_operadora_linha ol,
    dados_mobilidade.tab_operadora o
WHERE 
    l.id_linha = ol.id_linha
    AND ol.id_operadora = o.id_operadora
    AND o.nm_operadora ILIKE '%PIRACICABANA%'
ORDER BY 
    l.cd_linha ASC;`,
  },
  {
    id: 'w',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'w. Quais linhas contêm a palavra "Gama" em sua nomenclatura?',
    badge: 'ILIKE \'%GAMA%\'',
    hint: 'Aplique busca textual com curingas na coluna tx_linha ILIKE \'%GAMA%\'.',
    explanation: 'O curinga %GAMA% localiza qualquer registo onde a palavra apareça no início, meio ou fim de tx_linha.',
    answerSql: `SELECT 
    cd_linha,
    tx_linha
FROM 
    dados_mobilidade.tab_linha
WHERE 
    tx_linha ILIKE '%GAMA%'
ORDER BY 
    cd_linha ASC;`,
  },
  {
    id: 'x',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'x. Quais linhas do sistema possuem operação compartilhada (mais de uma empresa operando)?',
    badge: 'GROUP BY + HAVING COUNT > 1',
    hint: 'Agrupe por linha e use HAVING COUNT(DISTINCT ol.id_operadora) > 1.',
    explanation: 'Agrupamos tab_operadora_linha por linha e filtramos os grupos com HAVING COUNT(DISTINCT ol.id_operadora) > 1.',
    answerSql: `SELECT 
    l.cd_linha,
    l.tx_linha,
    COUNT(DISTINCT ol.id_operadora) AS qtd_operadoras
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_operadora_linha ol
WHERE 
    l.id_linha = ol.id_linha
GROUP BY 
    l.cd_linha,
    l.tx_linha
HAVING 
    COUNT(DISTINCT ol.id_operadora) > 1
ORDER BY 
    qtd_operadoras DESC;`,
  },
  {
    id: 'y',
    part: 'parte3',
    partLabel: 'Parte III • Cruzamentos & BI',
    points: 4,
    title: 'y. Quais linhas compõem o sistema noturno e operam de madrugada (com partidas entre 00h00 e 04h00)?',
    badge: 'BETWEEN 0 AND 40000',
    hint: 'Filtre a faixa horária numérica com h.hr_prevista BETWEEN 0 AND 40000.',
    explanation: 'A coluna hr_prevista é numérica no formato HHMMSS. O intervalo entre 00h00 e 04h00 corresponde aos valores de 0 a 40000.',
    answerSql: `SELECT DISTINCT 
    l.cd_linha,
    l.tx_linha,
    h.hr_prevista,
    h.sentido
FROM 
    dados_mobilidade.tab_linha l,
    dados_mobilidade.tab_operadora_linha ol,
    dados_mobilidade.tab_horario h
WHERE 
    l.id_linha = ol.id_linha
    AND ol.id_operadora_linha = h.id_operadora_linha
    AND h.hr_prevista BETWEEN 0 AND 40000
ORDER BY 
    h.hr_prevista ASC,
    l.cd_linha ASC;`,
  },
];

export const SqlChallengeScreen: React.FC<SqlChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  onOpenModule,
  submission,
  onSaveSubmission,
}) => {
  const [selectedPart, setSelectedPart] = useState<'todos' | 'parte1' | 'parte2' | 'parte3'>('todos');
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Carrega as queries SQL salvas pelo estagiário passadas via submission
  const [userQueries, setUserQueries] = useState<Record<string, string>>(
    () => (submission?.sqlQueries as Record<string, string>) || {}
  );

  useEffect(() => {
    if (submission?.sqlQueries) {
      setUserQueries(submission.sqlQueries);
    }
  }, [submission?.sqlQueries]);

  const handleQueryChange = (qId: string, val: string) => {
    const nextQueries = { ...userQueries, [qId]: val };
    setUserQueries(nextQueries);
    onSaveSubmission('challenge-sql-relatorios', { sqlQueries: nextQueries });
  };

  const [executionReports, setExecutionReports] = useState<
    Record<string, SqlValidationReport>
  >({});

  const handleRunQuery = (q: SqlQuestion) => {
    const currentSql = userQueries[q.id] || '';
    // A questão 'a' pede listagem geral do catálogo, mas conforme a nossa diretriz,
    // incentivamos WHERE em todas ou validamos contra o gabarito:
    const report = validateStudentQuery(
      currentSql,
      q.answerSql,
      q.id !== 'a' // 'a' é catálogo simples, 'b' até 'y' exigem WHERE obrigatoriamente
    );

    setExecutionReports((prev) => ({ ...prev, [q.id]: report }));

    const itemKey = `sql-q-${q.id}`;
    if (report.passed && !completedItems.includes(itemKey)) {
      onToggleItem(itemKey);
    }
  };

  const filteredQuestions = SQL_QUESTIONS.filter(
    (q) => selectedPart === 'todos' || q.part === selectedPart
  );

  const totalPoints = SQL_QUESTIONS.reduce((acc, q) => acc + q.points, 0);
  const earnedPoints = SQL_QUESTIONS.reduce(
    (acc, q) => (completedItems.includes(`sql-q-${q.id}`) ? acc + q.points : acc),
    0
  );

  const handleCopySql = (id: string, sql: string) => {
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
          <h1>Desafio SQL — Mobilidade Urbana (25 Questões Oficiais)</h1>
          <p>
            Resolva as 25 consultas oficiais da SEMOB (Letras <code>a</code> até <code>y</code>) divididas em 3 partes no esquema{' '}
            <code>dados_mobilidade</code>. Todas as suas queries ficam salvas automaticamente e devem utilizar junções explícitas e filtros na cláusula <code>WHERE</code>.
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
              ✅ {completedItems.filter((i) => i.startsWith('sql-q-')).length} de {SQL_QUESTIONS.length} questões resolvidas
            </span>
          </div>
        </div>
      </section>

      {/* Diagrama de Entidade-Relacionamento Interativo (DER dados_mobilidade) */}
      <section className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-header-row">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <Database size={20} className="text-sky" />
              Diagrama Relacional de Entidades (DER — Schema: dados_mobilidade)
            </h2>
            <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>
              Mapeamento visual das 6 tabelas oficiais, chaves primárias [PK], chaves estrangeiras [FK] e cardinalidades para junções explícitas no WHERE.
            </p>
          </div>
        </div>

        {/* Grade do Diagrama Relacional */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Eixo 1: Linhas e Itinerários Geoespaciais (1:N ➔ 1:N) */}
          <div style={{ background: 'var(--surface-hover)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>RAMO 1 • ESPACIAL & TRAÇADOS</span>
              <strong style={{ fontSize: '0.88rem' }}>tab_linha ──(1:N)──➔ tab_itinerario ──(1:N)──➔ tab_itinerario_descritivo</strong>
            </div>

            <div className="cards-grid three-cols" style={{ gap: '0.85rem' }}>
              {/* Card tab_linha */}
              <div className="glass-card" style={{ padding: '0.85rem', borderTop: '3px solid #38bdf8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#38bdf8' }}>tab_linha (l)</strong>
                  <span className="status-pill passed" style={{ fontSize: '0.68rem' }}>Entidade Forte</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>🔑 id_linha [PK] INT</div>
                  <div>cd_linha VARCHAR(20)</div>
                  <div>tx_linha VARCHAR(200)</div>
                  <div>vl_tarifa NUMBER</div>
                  <div>fx_tarifaria VARCHAR(50)</div>
                  <div>sentido VARCHAR(20)</div>
                </div>
              </div>

              {/* Card tab_itinerario */}
              <div className="glass-card" style={{ padding: '0.85rem', borderTop: '3px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#10b981' }}>tab_itinerario (i)</strong>
                  <span className="status-pill passed" style={{ fontSize: '0.68rem' }}>PostGIS Spatial</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>🔑 id_itinerario [PK] INT</div>
                  <div style={{ color: '#38bdf8', fontWeight: 600 }}>🔗 id_linha [FK ➔ l.id_linha]</div>
                  <div>lin_sentido CHAR(1) ('I'/'V'/'C')</div>
                  <div>lin_extensao NUMBER (km)</div>
                  <div style={{ color: '#a855f7' }}>🌐 geo_linhas_lin [PostGIS]</div>
                </div>
              </div>

              {/* Card tab_itinerario_descritivo */}
              <div className="glass-card" style={{ padding: '0.85rem', borderTop: '3px solid #6366f1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#6366f1' }}>tab_itinerario_descritivo (d)</strong>
                  <span className="status-pill passed" style={{ fontSize: '0.68rem' }}>Vias & Paradas</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>🔑 id_itinerario_descritivo [PK]</div>
                  <div style={{ color: '#10b981', fontWeight: 600 }}>🔗 id_itinerario [FK ➔ i.id_itinerario]</div>
                  <div>nm_sequencia INT</div>
                  <div>nm_via VARCHAR(150)</div>
                  <div>localidade VARCHAR(100)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Eixo 2: Operadoras e Escala de Horários (N:N ➔ 1:N) */}
          <div style={{ background: 'var(--surface-hover)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>RAMO 2 • OPERADORAS & HORÁRIOS (N:N)</span>
              <strong style={{ fontSize: '0.88rem' }}>tab_linha ──(N:N via tab_operadora_linha)── tab_operadora ──(1:N)──➔ tab_horario</strong>
            </div>

            <div className="cards-grid three-cols" style={{ gap: '0.85rem' }}>
              {/* Card tab_operadora */}
              <div className="glass-card" style={{ padding: '0.85rem', borderTop: '3px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#f59e0b' }}>tab_operadora (o)</strong>
                  <span className="status-pill passed" style={{ fontSize: '0.68rem' }}>Empresas STPC</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>🔑 id_operadora [PK] INT</div>
                  <div>nm_operadora VARCHAR(150)</div>
                  <div>nm_cpf_cnpj VARCHAR(25)</div>
                </div>
              </div>

              {/* Card tab_operadora_linha */}
              <div className="glass-card" style={{ padding: '0.85rem', borderTop: '3px solid #ec4899' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#ec4899' }}>tab_operadora_linha (ol)</strong>
                  <span className="status-pill passed" style={{ fontSize: '0.68rem' }}>Associação N:N</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>🔑 id_operadora_linha [PK] INT</div>
                  <div style={{ color: '#38bdf8', fontWeight: 600 }}>🔗 id_linha [FK ➔ l.id_linha]</div>
                  <div style={{ color: '#f59e0b', fontWeight: 600 }}>🔗 id_operadora [FK ➔ o.id_operadora]</div>
                </div>
              </div>

              {/* Card tab_horario */}
              <div className="glass-card" style={{ padding: '0.85rem', borderTop: '3px solid #14b8a6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#14b8a6' }}>tab_horario (h)</strong>
                  <span className="status-pill passed" style={{ fontSize: '0.68rem' }}>Tabelas Horárias</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>🔑 id_horario [PK] INT</div>
                  <div style={{ color: '#ec4899', fontWeight: 600 }}>🔗 id_operadora_linha [FK]</div>
                  <div>sentido CHAR(1) ('I'/'V')</div>
                  <div>hr_prevista INT (HHMMSS)</div>
                  <div style={{ color: 'var(--text-dim)' }}>segunda..domingo CHAR(1) ('S'/'N')</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Filtros por Parte */}
      <section className="section-card">
        <div className="sql-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Filter size={18} /> Filtrar por Etapa:
          </div>
          <div className="sql-filter-buttons">
            {[
              { id: 'todos', label: `Todas (${SQL_QUESTIONS.length})` },
              { id: 'parte1', label: `Parte I • Linha 0.111 (${SQL_QUESTIONS.filter((q) => q.part === 'parte1').length})` },
              { id: 'parte2', label: `Parte II • Linha 0.170 (${SQL_QUESTIONS.filter((q) => q.part === 'parte2').length})` },
              { id: 'parte3', label: `Parte III • Cruzamentos & BI (${SQL_QUESTIONS.filter((q) => q.part === 'parte3').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPart(tab.id as any)}
                className={`sql-filter-btn ${selectedPart === tab.id ? 'active' : ''}`}
              >
                {tab.label}
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
                        <span className="sql-level-pill intermediario">
                          Questão {q.id.toUpperCase()} • {q.partLabel}
                        </span>
                        <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                          {q.badge}
                        </span>
                        <span className="status-pill pending">{q.points} pts</span>
                      </div>
                      <h3 style={{ marginTop: '0.35rem' }}>{q.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="sql-meta-tags">
                  <span>
                    <strong>Operação / Foco:</strong> <code>{q.badge}</code>
                  </span>
                  <span>
                    <strong>Esquema Relacional:</strong> <code>dados_mobilidade</code>
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
                    placeholder={`-- Escreva aqui a sua query SQL para a Questão [${q.id.toUpperCase()}] usando cláusula WHERE...`}
                    value={currentQuery}
                    onChange={(e) => handleQueryChange(q.id, e.target.value)}
                  />
                </div>

                {/* Botões de Ação da Questão: Executar SQL + Dica + Gabarito */}
                <div
                  className="sql-card-actions"
                  style={{
                    marginTop: '0.85rem',
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleRunQuery(q)}
                  >
                    <Play size={15} /> Executar & Validar SQL
                  </button>

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

                {/* Painel de Resultado da Execução SQL em Tempo Real */}
                {executionReports[q.id] && (
                  <div
                    className="glass-card"
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      borderLeft: `4px solid ${
                        executionReports[q.id].passed ? '#10b981' : '#ef4444'
                      }`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '0.6rem',
                      }}
                    >
                      <strong
                        style={{
                          color: executionReports[q.id].passed ? '#10b981' : '#ef4444',
                          fontSize: '0.88rem',
                        }}
                      >
                        {executionReports[q.id].feedback}
                      </strong>
                      {executionReports[q.id].studentResult.success && (
                        <span className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                          {executionReports[q.id].studentResult.rowCount} registo(s) •{' '}
                          {executionReports[q.id].studentResult.executionTimeMs} ms
                        </span>
                      )}
                    </div>

                    {/* Tabela de Dados Retornados pela Query do Aluno */}
                    {executionReports[q.id].studentResult.success &&
                      executionReports[q.id].studentResult.rows.length > 0 && (
                        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                          <table
                            style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              fontSize: '0.8rem',
                              fontFamily: 'monospace',
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  borderBottom: '1px solid rgba(148,163,184,0.3)',
                                  textAlign: 'left',
                                }}
                              >
                                {executionReports[q.id].studentResult.columns.map((col) => (
                                  <th key={col} style={{ padding: '0.45rem 0.65rem', color: '#38bdf8' }}>
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {executionReports[q.id].studentResult.rows.slice(0, 10).map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}
                                >
                                  {executionReports[q.id].studentResult.columns.map((col) => (
                                    <td key={col} style={{ padding: '0.45rem 0.65rem' }}>
                                      {String(row[col] ?? 'NULL')}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                )}

                {showHint[q.id] && (
                  <div className="sql-hint-box" style={{ marginTop: '0.85rem' }}>
                    <Sparkles size={16} />
                    <span>
                      <strong>Dica Técnica:</strong> {q.hint}
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
                          Recomendação: pratique escrevendo a sua própria query com <code>WHERE</code> no editor acima antes de marcar como resolvida!
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.82rem' }}>✅ Solução SQL Oficial de Referência:</strong>
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
                      <strong>Explicação Técnica:</strong> {q.explanation}
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
        subtitle="Confirme se todas as suas consultas respeitam o schema dados_mobilidade e as diretrizes do gabarito oficial da SEMOB."
        requireRepoUrl={false}
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Todas as 25 consultas utilizam cláusula WHERE explícita para relacionamentos e filtros?',
          'Evitei o uso de SELECT * projetando apenas as colunas necessárias com alias (AS)?',
          'Utilizei funções do PostGIS (como ST_AsText) nas questões espaciais?',
          'As agregações (SUM, COUNT, MIN, MAX, HAVING) foram aplicadas corretamente nas Partes I e III?',
        ]}
      />
    </div>
  );
};

export default SqlChallengeScreen;
