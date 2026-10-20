import alasql from 'alasql';

export interface SqlExecutionResult {
  success: boolean;
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export interface SqlValidationReport {
  studentResult: SqlExecutionResult;
  passed: boolean;
  feedback: string;
  hasWhereClause: boolean;
  usedSelectStar: boolean;
  expectedRowCount?: number;
}

let isInitialized = false;

/**
 * Inicializa o banco relacional em memória com as 6 tabelas de dados_mobilidade
 * e regista funções compatíveis com PostgreSQL / PostGIS (ST_AsText).
 */
export function initSqlSandbox(): void {
  if (isInitialized) return;

  // Regista a função espacial PostGIS ST_AsText para as questões 'd' e 'k'
  alasql.fn.ST_AsText = (geomHexOrWkt: unknown) => {
    if (!geomHexOrWkt || typeof geomHexOrWkt !== 'string') return null;
    if (geomHexOrWkt.startsWith('LINESTRING')) return geomHexOrWkt;
    return `LINESTRING(-47.8825 -15.7942, -47.8910 -15.7801)`;
  };
  alasql.fn.st_astext = alasql.fn.ST_AsText;

  // Limpa tabelas caso já existam
  const tables = [
    'tab_linha',
    'tab_itinerario',
    'tab_itinerario_descritivo',
    'tab_operadora',
    'tab_operadora_linha',
    'tab_horario',
  ];
  tables.forEach((tb) => {
    alasql(`DROP TABLE IF EXISTS ${tb}`);
  });

  // 1. Tabela tab_linha
  alasql(`
    CREATE TABLE tab_linha (
      id_linha INT PRIMARY KEY,
      cd_linha VARCHAR(20),
      tx_linha VARCHAR(200),
      vl_tarifa NUMBER,
      fx_tarifaria VARCHAR(50),
      sentido VARCHAR(20)
    )
  `);

  alasql(`
    INSERT INTO tab_linha VALUES
    (1, '0.111', 'Rodoviária do Plano Piloto / Asa Norte (UnB)', 3.80, 'CURTA', 'CIRCULAR'),
    (2, '0.170', 'Taguatinga Sul / Rodoviária do Plano Piloto', 5.50, 'LONGA', 'IDA_VOLTA'),
    (3, '2204', 'Gama (Terminal BRT) / Rodoviária do Plano Piloto', 5.50, 'LONGA', 'IDA_VOLTA'),
    (4, '0.152', 'Ceilândia Centro / Esplanada dos Ministérios', 5.50, 'LONGA', 'IDA_VOLTA'),
    (5, '0.024', 'Circular W3 Norte / Sul (Eixo Monumental)', 2.70, 'CURTA', 'CIRCULAR'),
    (6, '0.812', 'Gama Sul / ParkShopping / EPIG', 5.50, 'LONGA', 'IDA_VOLTA')
  `);

  // 2. Tabela tab_itinerario
  alasql(`
    CREATE TABLE tab_itinerario (
      id_itinerario INT PRIMARY KEY,
      id_linha INT,
      lin_sentido VARCHAR(10),
      lin_extensao NUMBER,
      geo_linhas_lin VARCHAR(255)
    )
  `);

  alasql(`
    INSERT INTO tab_itinerario VALUES
    (101, 1, 'I', 14.50, 'LINESTRING(-47.8825 -15.7942, -47.8680 -15.7630)'),
    (102, 1, 'V', 15.20, 'LINESTRING(-47.8680 -15.7630, -47.8825 -15.7942)'),
    (103, 2, 'I', 38.40, 'LINESTRING(-48.0550 -15.8320, -47.8825 -15.7942)'),
    (104, 2, 'V', 39.10, 'LINESTRING(-47.8825 -15.7942, -48.0550 -15.8320)'),
    (105, 3, 'I', 74.80, 'LINESTRING(-48.0650 -16.0150, -47.8825 -15.7942)'),
    (106, 3, 'V', 76.20, 'LINESTRING(-47.8825 -15.7942, -48.0650 -16.0150)'),
    (107, 4, 'I', 71.50, 'LINESTRING(-48.1100 -15.8150, -47.8600 -15.7990)'),
    (108, 5, 'C', 8.90,  'LINESTRING(-47.8825 -15.7942, -47.8950 -15.8100, -47.8825 -15.7942)'),
    (109, 1, 'C', 29.70, 'LINESTRING(-47.8825 -15.7942, -47.8700 -15.7550, -47.8825 -15.7942)'),
    (110, 6, 'I', 42.30, 'LINESTRING(-48.0600 -16.0200, -47.9500 -15.8300)')
  `);

  // 3. Tabela tab_itinerario_descritivo
  alasql(`
    CREATE TABLE tab_itinerario_descritivo (
      id_itinerario_descritivo INT PRIMARY KEY,
      id_itinerario INT,
      nm_sequencia INT,
      nm_via VARCHAR(150),
      localidade VARCHAR(100)
    )
  `);

  alasql(`
    INSERT INTO tab_itinerario_descritivo VALUES
    (1, 101, 1, 'Plataforma E - Rodoviária do Plano Piloto', 'Plano Piloto'),
    (2, 101, 2, 'Eixo Rodoviário Norte (Eixão)', 'Asa Norte'),
    (3, 101, 3, 'Via L2 Norte - Quadras 406/408', 'Asa Norte'),
    (4, 101, 4, 'Campus Universitário Darcy Ribeiro (UnB)', 'Asa Norte'),
    (5, 102, 1, 'Campus Universitário Darcy Ribeiro (UnB)', 'Asa Norte'),
    (6, 102, 2, 'Eixo Rodoviário Norte (Sentido Sul)', 'Asa Norte'),
    (7, 103, 1, 'Avenida Comercial Sul - Taguatinga', 'Taguatinga'),
    (8, 103, 2, 'Via EPTG (Estrada Parque Taguatinga)', 'Guará / Águas Claras'),
    (9, 103, 3, 'Eixo Monumental - Rodoviária', 'Plano Piloto'),
    (10, 104, 1, 'Rodoviária do Plano Piloto - Plataforma D', 'Plano Piloto'),
    (11, 104, 2, 'Via EPTG (Sentido Taguatinga)', 'Taguatinga')
  `);

  // 4. Tabela tab_operadora
  alasql(`
    CREATE TABLE tab_operadora (
      id_operadora INT PRIMARY KEY,
      nm_operadora VARCHAR(150),
      nm_cpf_cnpj VARCHAR(25)
    )
  `);

  alasql(`
    INSERT INTO tab_operadora VALUES
    (10, 'Viação Piracicabana Ltda', '00.111.222/0001-01'),
    (20, 'Auto Viação Marechal', '00.333.444/0001-02'),
    (30, 'Viação Pioneira Ltda', '00.555.666/0001-03'),
    (40, 'Urbi Mobilidade Urbana', '00.777.888/0001-04')
  `);

  // 5. Tabela associativa tab_operadora_linha (N:N)
  alasql(`
    CREATE TABLE tab_operadora_linha (
      id_operadora_linha INT PRIMARY KEY,
      id_linha INT,
      id_operadora INT
    )
  `);

  alasql(`
    INSERT INTO tab_operadora_linha VALUES
    (501, 1, 10), -- Linha 0.111 -> Piracicabana
    (502, 2, 20), -- Linha 0.170 -> Marechal
    (503, 3, 30), -- Linha 2204  -> Pioneira
    (504, 3, 10), -- Linha 2204 também operada por Piracicabana (Operação Compartilhada - Questão x!)
    (505, 4, 20), -- Linha 0.152 -> Marechal
    (506, 5, 10), -- Linha 0.024 -> Piracicabana
    (507, 6, 30), -- Linha 0.812 -> Pioneira
    (508, 6, 40)  -- Linha 0.812 também operada por Urbi (Operação Compartilhada - Questão x!)
  `);

  // 6. Tabela tab_horario
  alasql(`
    CREATE TABLE tab_horario (
      id_horario INT PRIMARY KEY,
      id_operadora_linha INT,
      sentido VARCHAR(10),
      hr_prevista INT,
      segunda CHAR(1),
      terca CHAR(1),
      quarta CHAR(1),
      quinta CHAR(1),
      sexta CHAR(1),
      sabado CHAR(1),
      domingo CHAR(1)
    )
  `);

  alasql(`
    INSERT INTO tab_horario VALUES
    (901, 501, 'I', 61500,  'S', 'S', 'S', 'S', 'S', 'N', 'N'),
    (902, 501, 'I', 73000,  'S', 'S', 'S', 'S', 'S', 'S', 'N'),
    (903, 501, 'V', 181500, 'S', 'S', 'S', 'S', 'S', 'N', 'N'),
    (904, 502, 'I', 54500,  'S', 'S', 'S', 'S', 'S', 'S', 'S'),
    (905, 502, 'I', 63000,  'S', 'S', 'S', 'S', 'S', 'N', 'N'),
    (906, 502, 'V', 173000, 'S', 'S', 'S', 'S', 'S', 'N', 'N'),
    (907, 503, 'I', 13000,  'S', 'S', 'S', 'S', 'S', 'S', 'S'), -- Madrugada 01:30 (Questão y)
    (908, 505, 'I', 24500,  'S', 'S', 'S', 'S', 'S', 'S', 'S')  -- Madrugada 02:45 (Questão y)
  `);

  isInitialized = true;
}

/**
 * Converte sintaxes específicas do PostgreSQL (como prefixo de schema dados_mobilidade.,
 * public.ST_AsText e operador ILIKE) para execução transparente no motor em memória.
 */
function preprocessPostgresSql(rawSql: string): string {
  return rawSql
    .trim()
    // Remove comentários de linha SQL
    .replace(/--.*$/gm, '')
    // Remove prefixos de schema dados_mobilidade. e public.
    .replace(/\bdados_mobilidade\./gi, '')
    .replace(/\bpublic\./gi, '')
    // Converte ILIKE para LIKE (no AlaSQL pode usar LIKE case-insensitive)
    .replace(/\bILIKE\b/gi, 'LIKE');
}

/**
 * Executa uma query SQL somente-leitura no banco em memória.
 */
export function executeSandboxSql(rawSql: string): SqlExecutionResult {
  initSqlSandbox();
  const start = performance.now();

  const cleaned = rawSql.trim();
  if (!cleaned) {
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      error: 'Digite uma consulta SQL antes de executar.',
    };
  }

  // Bloqueio de segurança contra comandos de mutação/destruição
  if (/\b(DROP|DELETE|UPDATE|INSERT|ALTER|TRUNCATE|CREATE)\b/i.test(cleaned)) {
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      error:
        'Ambiente de consulta seguro (Read-Only): apenas instruções SELECT são permitidas neste laboratório.',
    };
  }

  try {
    const normalizedSql = preprocessPostgresSql(cleaned);
    const result = alasql(normalizedSql);
    const rows = Array.isArray(result) ? (result as Record<string, unknown>[]) : [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return {
      success: true,
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.round((performance.now() - start) * 100) / 100,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round((performance.now() - start) * 100) / 100,
      error: `Erro de sintaxe ou execução SQL: ${msg}`,
    };
  }
}

/**
 * Compara os valores das linhas retornadas pela query do aluno com as linhas do gabarito,
 * independentemente dos apelidos (AS alias) dados às colunas.
 */
export function validateStudentQuery(
  studentSql: string,
  expectedGabaritoSql: string,
  requireWhere = true
): SqlValidationReport {
  const studentResult = executeSandboxSql(studentSql);
  const hasWhereClause = /\bwhere\b/i.test(studentSql);
  const usedSelectStar = /select\s+\*/i.test(studentSql);

  if (!studentResult.success) {
    return {
      studentResult,
      passed: false,
      hasWhereClause,
      usedSelectStar,
      feedback: studentResult.error || 'A consulta contém erros de sintaxe.',
    };
  }

  if (requireWhere && !hasWhereClause) {
    return {
      studentResult,
      passed: false,
      hasWhereClause,
      usedSelectStar,
      feedback:
        '⚠️ A sua consulta executou, mas não utiliza a cláusula WHERE obrigatória. Todas as consultas na plataforma exigem filtro ou junção explícita via WHERE.',
    };
  }

  const expectedResult = executeSandboxSql(expectedGabaritoSql);
  if (!expectedResult.success) {
    return {
      studentResult,
      passed: studentResult.rowCount > 0,
      hasWhereClause,
      usedSelectStar,
      feedback: '✅ Consulta executada com sucesso!',
    };
  }

  // Compara quantidade de linhas retornadas
  if (studentResult.rowCount !== expectedResult.rowCount) {
    return {
      studentResult,
      passed: false,
      hasWhereClause,
      usedSelectStar,
      expectedRowCount: expectedResult.rowCount,
      feedback: `❌ O número de registos retornados (${studentResult.rowCount}) difere do esperado pelo gabarito (${expectedResult.rowCount} registos). Verifique os seus filtros no WHERE ou agrupamentos.`,
    };
  }

  // Compara os valores célula a célula (ignorando diferenças de alias de coluna)
  const serializeRows = (rows: Record<string, unknown>[]) =>
    rows
      .map((r) =>
        Object.values(r)
          .map((v) => String(v ?? '').trim().toUpperCase())
          .sort()
          .join('|')
      )
      .sort()
      .join(';;');

  const studentSignature = serializeRows(studentResult.rows);
  const expectedSignature = serializeRows(expectedResult.rows);

  const valuesMatch = studentSignature === expectedSignature;

  if (!valuesMatch) {
    return {
      studentResult,
      passed: false,
      hasWhereClause,
      usedSelectStar,
      expectedRowCount: expectedResult.rowCount,
      feedback:
        '⚠️ A quantidade de linhas está correta, mas as colunas projetadas ou valores retornados diferem do esperado pela questão. Confira as colunas pedidas no enunciado!',
    };
  }

  return {
    studentResult,
    passed: true,
    hasWhereClause,
    usedSelectStar,
    expectedRowCount: expectedResult.rowCount,
    feedback: usedSelectStar
      ? '✅ Resultado exato! (Dica de boa prática: evite usar SELECT * em APIs de produção, especificando apenas as colunas pedidas).'
      : '🎯 Perfeito! A sua query retornou exatamente os mesmos dados do gabarito oficial com cláusula WHERE!',
  };
}
