/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Server,
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  ExternalLink,
  Code2,
  Send,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { BACKEND_CHALLENGE_DATA } from '../../services/data/seedData';
import { ApiService } from '../../services/api';
import { SubmissionEvaluation } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import { Alert } from '../ui/Alert';
import { CodeBlock } from '../ui/CodeBlock';

interface BackendChallengeLabProps {
  onNavigate: (section: string, payload?: any) => void;
}

export const BackendChallengeLab: React.FC<BackendChallengeLabProps> = ({ onNavigate }) => {
  const challenge = BACKEND_CHALLENGE_DATA;
  const [activeTab, setActiveTab] = useState<'specs' | 'tester' | 'submission'>('specs');
  const [repoUrl, setRepoUrl] = useState('https://github.com/pedro-sousa/service-orders-api');
  const [branch, setBranch] = useState('feat/rest-contract-v1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    passedCount: number;
    totalCount: number;
    evaluation: SubmissionEvaluation;
    testOutputLogs: string;
  } | null>(null);

  const { showSuccess, showError, showInfo } = useNotification();

  const handleRunTests = async () => {
    if (!repoUrl.trim()) {
      showError('Informe a URL do repositório Git');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ApiService.runBackendTests(repoUrl, branch);
      setTestResult(res);
      if (res.evaluation.status === 'approved') {
        showSuccess('Suite de Testes Aprovada!', 'Todos os testes de contrato e regras de negócio passaram.');
      } else {
        showError('Falha em casos de teste', 'Verifique o log de execução.');
      }
    } catch (e) {
      showError('Erro ao conectar com o runner de testes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
            <Server className="w-4 h-4" />
            <span>LABORATÓRIO PRÁTICO · BACKEND & APIS RESTFUL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{challenge.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dificuldade: {challenge.difficulty} · Duração estimada: {challenge.estimatedMinutes} min · {challenge.apiSpecTitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => onNavigate('challenge_sql')}
            variant="outline"
            size="sm"
          >
            ← Desafio SQL
          </Button>
          <Button
            onClick={() => onNavigate('challenge_frontend')}
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Próximo: Desafio Frontend
          </Button>
        </div>
      </div>

      {/* Segmented Mode Navigation */}
      <div className="flex items-center justify-between">
        <Tabs
          items={[
            { id: 'specs', label: '1. Especificação de Contratos & Regras' },
            { id: 'tester', label: '2. Simulador Interativo de Endpoints' },
            { id: 'submission', label: '3. Submissão & Runner Automatizado' },
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          variant="segmented"
        />

        <a
          href={challenge.starterCodeRepoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hidden sm:flex"
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Repositório Template</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Tab 1: Specs */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card padding="lg" className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Contexto e Requisitos do Negócio</h2>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {challenge.problemStatement}
              </p>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 mb-2">Requisitos Funcionais da API:</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {challenge.functionalRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 mb-2">Restrições Técnicas & Padrões:</h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {challenge.restrictions.map((res, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Endpoints specification */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Contratos de Endpoints HTTP</h2>
              {challenge.endpoints.map((ep, i) => (
                <Card key={i} padding="md" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          ep.method === 'POST'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-bold text-slate-900">{ep.path}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      HTTP {ep.expectedStatusCode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{ep.description}</p>

                  {ep.requestBodySchema && (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">
                        Corpo da Requisição (JSON Schema):
                      </p>
                      <CodeBlock code={ep.requestBodySchema} language="json" />
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">
                      Exemplo de Resposta de Sucesso:
                    </p>
                    <CodeBlock code={ep.responseBodyExample} language="json" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Acceptance criteria & hints */}
          <div className="space-y-5">
            <Card padding="md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Critérios de Aceitação da Suite
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {challenge.acceptanceCriteria.map((crit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card padding="md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Dicas de Arquitetura
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                {challenge.hints.map((hint, i) => (
                  <p key={i} className="leading-relaxed">
                    • {hint}
                  </p>
                ))}
              </div>
            </Card>

            <Button
              onClick={() => setActiveTab('submission')}
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ir para o Runner de Testes
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Tester */}
      {activeTab === 'tester' && (
        <div className="space-y-5 max-w-4xl">
          <Card padding="lg" className="space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Simulador de Chamadas HTTP</h2>
              <p className="text-xs text-slate-500">
                Teste mentalmente os contratos de requisição e resposta contra a especificação OpenAPI
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3">
              <div className="text-slate-400"># Exemplo de chamada via cURL</div>
              <div className="text-emerald-400 whitespace-pre-wrap">
                curl -X POST https://api.nexora.internal/api/v1/orders \
                <br />
                &nbsp;&nbsp;-H "Content-Type: application/json" \
                <br />
                &nbsp;&nbsp;-d '&#123; "clientId": "cli-101", "title": "Troca de servidor", "priority": "alta", "description": "Substituição emergencial de fonte de energia", "estimatedHours": 4 &#125;'
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700">Resposta Esperada (201 Created):</span>
              <CodeBlock
                code={`{
  "id": "ord-8921-992a",
  "clientId": "cli-101",
  "title": "Troca de servidor",
  "priority": "alta",
  "status": "aberta",
  "createdAt": "2026-10-19T15:30:00Z"
}`}
                language="json"
              />
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Submission & Test Runner */}
      {activeTab === 'submission' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submission Form */}
          <div className="lg:col-span-5 space-y-5">
            <Card padding="lg" className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                <span>Submissão de Repositório Git</span>
              </div>
              <p className="text-xs text-slate-500">
                O runner de integração contínua (CI) clonará a branch informada, executará os testes de contrato e analisará a cobertura.
              </p>

              <Input
                label="URL do Repositório Git (GitHub / GitLab)"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/seu-usuario/service-orders-api"
                required
              />

              <Input
                label="Nome da Branch com a Solução"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="ex: feat/rest-contract-v1"
                required
              />

              <Button
                onClick={handleRunTests}
                isLoading={isSubmitting}
                size="lg"
                className="w-full"
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Executar Testes Automatizados no CI
              </Button>
            </Card>
          </div>

          {/* Test Runner Visualization */}
          <div className="lg:col-span-7 space-y-5">
            {testResult ? (
              <div className="space-y-5">
                {/* Result Card */}
                <Card
                  padding="lg"
                  className={`border-2 ${
                    testResult.evaluation.status === 'approved'
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Resultado: {testResult.evaluation.scorePercentage}% Aprovado
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      APROVADO NO CI
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    {testResult.evaluation.summaryFeedback}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    {testResult.evaluation.criteriaResults.map((crit) => (
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

                {/* Console Logs */}
                <Card padding="none" className="overflow-hidden border border-slate-800 bg-slate-950 text-white">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Console de Execução CI / Testes</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">Status: 0</span>
                  </div>
                  <div className="p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                    {testResult.testOutputLogs}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                <Terminal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">Runner Aguardando Submissão</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Clique no botão ao lado para submeter sua branch e visualizar a execução dos testes em tempo real.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
