import { describe, it, expect } from 'vitest';
import { validateStudentQuery, executeSandboxSql } from '../sqlSandboxEngine';

describe('Motor SQL Interativo em Memória (sqlSandboxEngine)', () => {
  it('deve aprovar uma query correta com junção no WHERE para a linha 0.111 (Questão b)', () => {
    const gabaritoB = `
      SELECT l.tx_linha AS nome_linha, l.cd_linha AS codigo_linha, i.lin_extensao AS extensao_km
      FROM dados_mobilidade.tab_linha l, dados_mobilidade.tab_itinerario i
      WHERE l.id_linha = i.id_linha AND l.cd_linha = '0.111'
    `;

    const tentativaAluno = `
      SELECT l.tx_linha, l.cd_linha, i.lin_extensao
      FROM dados_mobilidade.tab_linha l, dados_mobilidade.tab_itinerario i
      WHERE l.id_linha = i.id_linha AND l.cd_linha = '0.111'
    `;

    const report = validateStudentQuery(tentativaAluno, gabaritoB, true);
    expect(report.passed).toBe(true);
    expect(report.studentResult.rowCount).toBeGreaterThan(0);
  });

  it('deve reprovar uma query que não utilize a cláusula WHERE obrigatória', () => {
    const gabarito = `SELECT cd_linha, vl_tarifa FROM dados_mobilidade.tab_linha WHERE vl_tarifa = 5.50`;
    const tentativaSemWhere = `SELECT cd_linha, vl_tarifa FROM dados_mobilidade.tab_linha`;

    const report = validateStudentQuery(tentativaSemWhere, gabarito, true);
    expect(report.passed).toBe(false);
    expect(report.hasWhereClause).toBe(false);
  });

  it('deve bloquear comandos destrutivos como DROP ou DELETE (Segurança Read-Only)', () => {
    const res = executeSandboxSql('DROP TABLE tab_linha;');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Read-Only');
  });
});
