/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Table as TableIcon,
  ChevronRight,
  ChevronDown,
  Info,
} from 'lucide-react';
import { SQL_CHALLENGE_DATA } from '../../services/data/seedData';
import { ApiService } from '../../services/api';
import { SubmissionEvaluation } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Tabs } from '../ui/Tabs';

interface SqlChallengeLabProps {
  onNavigate: (section: string, payload?: any) => void;
}

export const SqlChallengeLab: React.FC<SqlChallengeLabProps> = ({ onNavigate }) => {
  const challenge = SQL_CHALLENGE_DATA;
  const [query, setQuery] = useState(challenge.initialQuery);
  const [activeSchemaTab, setActiveSchemaTab] = useState('clientes');
  const [isRunning, setIsRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: Record<string, any>[];
    rowCount: number;
    executionTimeMs: number;
    evaluation?: SubmissionEvaluation;
    error?: string;
  } | null>({
    columns: challenge.expectedColumns,
    rows: [
      { segmento: 'Tecnologia', total_pedidos: 2, faturamento_total: 36400.0, ticket_medio: 18200.0 },
      { segmento: 'Finanças', total_pedidos: 1, faturamento_total: 35000.0, ticket_medio: 35000.0 },
      { segmento: 'Saúde', total_pedidos: 2, faturamento_total: 20600.5, ticket_medio: 10300.25 },
    ],
    rowCount: 3,
    executionTimeMs: 42,
  });
  const [showHints, setShowHints] = useState(false);
  const { showSuccess, showError, showInfo } = useNotification();

  const schemaTabs = challenge.schemas.map((s) => ({
    id: s.tableName,
    label: `Tabela: ${s.tableName}`,
  }));

  const activeSchema = challenge.schemas.find((s) => s.tableName === activeSchemaTab) || challenge.schemas[0];

  const handleRunQuery = async () => {
    setIsRunning(true);
    try {
      const res = await ApiService.executeSqlQuery(query);
      setQueryResult(res);
      if (res.error) {
        showError('Erro de Execução SQL', res.error);
      } else if (res.evaluation?.status === 'approved') {
        showSuccess('Consulta Executada com Sucesso!', '100% dos critérios de aceitação foram cumpridos.');
      } else {
        showInfo('Consulta Executada com Avisos', 'Verifique a lista de critérios abaixo.');
      }
    } catch (e) {
      showError('Falha no motor de execução');
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetQuery = () => {
    setQuery(challenge.initialQuery);
    showInfo('Editor restaurado para o template inicial');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <Database className="w-4 h-4" />
            <span>LABORATÓRIO PRÁTICO · BANCO DE DADOS & SQL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{challenge.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dificuldade: {challenge.difficulty} · Duração estimada: {challenge.estimatedMinutes} min
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => onNavigate('track_detail')}
            variant="outline"
            size="sm"
          >
            Voltar à Trilha
          </Button>
          <Button
            onClick={() => onNavigate('challenge_backend')}
            size="sm"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Próximo: Desafio Backend
          </Button>
        </div>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel (5 columns): Problem Statement, Requirements, Schemas */}
        <div className="lg:col-span-5 space-y-5">
          {/* Problem Statement Card */}
          <Card padding="md" className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Enunciado do Problema
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {challenge.problemStatement}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Requisitos da Consulta:</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {challenge.functionalRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Toggle Hints */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHints ? 'Ocultar Dicas Técnicas' : 'Ver Dicas Técnicas de Otimização'}</span>
              </button>
              {showHints && (
                <div className="mt-2.5 p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-1.5">
                  {challenge.hints.map((hint, i) => (
                    <p key={i}>• {hint}</p>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Database Schema Viewer */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Esquema das Tabelas do Laboratório
              </h2>
              <TableIcon className="w-4 h-4 text-slate-400" />
            </div>

            {/* Schema tabs */}
            <Tabs
              items={schemaTabs}
              activeId={activeSchemaTab}
              onChange={setActiveSchemaTab}
              variant="segmented"
            />

            {/* Columns Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Coluna</th>
                    <th className="py-2 px-3 font-semibold">Tipo</th>
                    <th className="py-2 px-3 font-semibold">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {activeSchema.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {col.name}
                        {col.isPrimary && (
                          <span className="ml-1 text-[9px] text-amber-600 font-sans font-bold bg-amber-50 px-1 rounded">
                            PK
                          </span>
                        )}
                        {col.isForeign && (
                          <span className="ml-1 text-[9px] text-indigo-600 font-sans font-bold bg-indigo-50 px-1 rounded">
                            FK
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-500">{col.type}</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sample Rows Preview */}
            <div>
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                Amostra de Registros ({activeSchema.sampleRows.length} linhas de teste):
              </p>
              <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-slate-200 overflow-x-auto max-h-40">
                <pre>{JSON.stringify(activeSchema.sampleRows, null, 2)}</pre>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel (7 columns): SQL Editor, Actions, Tabular Result, Criteria Evaluation */}
        <div className="lg:col-span-7 space-y-5">
          {/* SQL Editor Card */}
          <Card padding="none" className="overflow-hidden border border-slate-800 bg-slate-950 text-white">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">query_analytics.sql</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetQuery}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resetar</span>
                </button>
              </div>
            </div>

            <div className="p-4">
              <label htmlFor="sql-editor" className="sr-only">Editor SQL</label>
              <textarea
                id="sql-editor"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={9}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-indigo-300 focus:outline-none resize-y selection:bg-indigo-600 leading-relaxed"
                placeholder="SELECT ... FROM ..."
                spellCheck={false}
              />
            </div>

            <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Atalho: Clique em Executar para testar contra a base
              </span>
              <Button
                onClick={handleRunQuery}
                isLoading={isRunning}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 font-semibold"
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                Executar Consulta SQL
              </Button>
            </div>
          </Card>

          {/* Results Table & Messages */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resultado da Execução
              </h2>
              {queryResult && !queryResult.error && (
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span>{queryResult.rowCount} linhas retornadas</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Clock className="w-3 h-3" />
                    {queryResult.executionTimeMs} ms
                  </span>
                </div>
              )}
            </div>

            {queryResult?.error ? (
              <Alert type="error" title="Erro na Execução da Query">
                {queryResult.error}
              </Alert>
            ) : queryResult ? (
              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      {queryResult.columns.map((col) => (
                        <th key={col} className="py-2.5 px-3 font-mono">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {queryResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        {queryResult.columns.map((col) => (
                          <td key={col} className="py-2 px-3 text-slate-800">
                            {typeof row[col] === 'number' && col.includes('faturamento')
                              ? `R$ ${row[col].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                              : typeof row[col] === 'number' && col.includes('ticket')
                              ? `R$ ${row[col].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                              : row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Nenhuma consulta executada ainda.
              </div>
            )}
          </Card>

          {/* Criteria Evaluation Card */}
          {queryResult?.evaluation && (
            <Card padding="md" className="space-y-4 border-2 border-emerald-500/40 bg-emerald-50/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Avaliação Automatizada: {queryResult.evaluation.scorePercentage}/100 Pontos
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  APROVADO
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {queryResult.evaluation.summaryFeedback}
              </p>

              <div className="space-y-2 pt-2 border-t border-emerald-200/60">
                {queryResult.evaluation.criteriaResults.map((crit) => (
                  <div key={crit.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="text-slate-800 font-medium">{crit.title}</span>
                    </div>
                    <span className="font-mono text-emerald-700 font-bold">
                      {crit.pointsAwarded}/{crit.maxPoints} pts
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
