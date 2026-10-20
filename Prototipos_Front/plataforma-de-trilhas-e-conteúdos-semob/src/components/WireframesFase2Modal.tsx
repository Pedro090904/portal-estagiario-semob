import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Layers, BarChart3, HelpCircle, FilePlus, ChevronRight } from 'lucide-react';

export const WireframesFase2Modal: React.FC = () => {
  const { isWireframesOpen, setIsWireframesOpen } = useApp();
  const [wireframeAtivo, setWireframeAtivo] = useState<'secretaria' | 'competencias_aluno' | 'competencias_supervisor' | 'chamado' | 'artigo'>('secretaria');

  if (!isWireframesOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wireframes de Telas de FASE 2 e FUTURO"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in"
      onClick={() => setIsWireframesOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
              Propostas Arquiteturais · Planejamento Futuro
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
              Wireframes das Telas de [FASE 2] e [FUTURO]
            </h2>
          </div>
          <button
            onClick={() => setIsWireframesOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg"
            aria-label="Fechar modal de wireframes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs">
          <button
            onClick={() => setWireframeAtivo('secretaria')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              wireframeAtivo === 'secretaria' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            1. Trilha de Secretaria [FASE 2]
          </button>
          <button
            onClick={() => setWireframeAtivo('competencias_aluno')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              wireframeAtivo === 'competencias_aluno' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            2. Radar de Competências Aluno [FASE 2]
          </button>
          <button
            onClick={() => setWireframeAtivo('competencias_supervisor')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              wireframeAtivo === 'competencias_supervisor' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            3. Padrões de Erro Supervisor [FASE 2]
          </button>
          <button
            onClick={() => setWireframeAtivo('chamado')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              wireframeAtivo === 'chamado' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            4. Abertura de Chamado [FASE 2]
          </button>
          <button
            onClick={() => setWireframeAtivo('artigo')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              wireframeAtivo === 'artigo' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            5. Envio de Artigo [FUTURO]
          </button>
        </div>

        {/* Wireframe Display Canvas */}
        <div className="overflow-y-auto p-6 flex-1 text-xs md:text-sm">
          {wireframeAtivo === 'secretaria' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                <span className="font-mono text-xs uppercase text-amber-600 dark:text-amber-400 font-bold">
                  [WIREFRAME FASE 2] · Rota: /trilhas/secretaria-sei
                </span>
                <span className="text-slate-500">Público: Servidores e Assessores</span>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center font-mono text-slate-500">
                  Banner da Trilha: "Gestão de Processos SEI e Normativas de Mobilidade"
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Módulo 1: Autuação no SEI</span>
                    <p className="text-slate-500 text-xs">Criação de processos, tipos de documentos e minutas padrão.</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Módulo 2: POPs de Secretaria</span>
                    <p className="text-slate-500 text-xs">Protocolos de resposta ao cidadão e ouvidoria municipal.</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Módulo 3: Agendas e Termos</span>
                    <p className="text-slate-500 text-xs">Agendamentos de vistorias técnicas e termos de permissão.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {wireframeAtivo === 'competencias_aluno' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                <span className="font-mono text-xs uppercase text-amber-600 dark:text-amber-400 font-bold">
                  [WIREFRAME FASE 2] · Painel de Competências por Cores
                </span>
                <span className="text-slate-500">Visão do Aluno / Estagiário</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Matriz de Competências</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Modelagem SQL Relacional</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium font-mono">Avançado (94%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fluxo Git e GitLab CI</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium font-mono">Proficiente (82%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Testes Unitários em NestJS</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium font-mono">Em Nivelamento (68%)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-2">
                  <BarChart3 className="w-12 h-12 text-slate-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Gráfico Radar de Habilidades</span>
                  <p className="text-slate-500 text-xs">Calculado a partir das tentativas em quizzes e correções de entregas.</p>
                </div>
              </div>
            </div>
          )}

          {wireframeAtivo === 'competencias_supervisor' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                <span className="font-mono text-xs uppercase text-amber-600 dark:text-amber-400 font-bold">
                  [WIREFRAME FASE 2] · Análise de Padrões de Erro da Turma
                </span>
                <span className="text-slate-500">Visão do Supervisor / Orientador</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-semibold text-rose-700 dark:text-rose-400 block">
                    Gargalo Identificado: 45% dos alunos erram a diferença entre WHERE e HAVING
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Ação recomendada pelo sistema: Incluir exercício prático adicional na etapa 3 antes de liberar o quiz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {wireframeAtivo === 'chamado' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                <span className="font-mono text-xs uppercase text-amber-600 dark:text-amber-400 font-bold">
                  [WIREFRAME FASE 2] · Abertura de Chamado de Suporte
                </span>
                <span className="text-slate-500">Qualquer Usuário</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Tipo de Chamado:</span>
                    <div className="p-2 border rounded mt-1 bg-slate-50 dark:bg-slate-900 text-slate-500">[Dúvida | Reclamação | Erro Técnico]</div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Conteúdo Relacionado:</span>
                    <div className="p-2 border rounded mt-1 bg-slate-50 dark:bg-slate-900 text-slate-500">Etapa 4: Desafio SQL</div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">Descrição do Problema:</span>
                  <div className="h-16 border rounded mt-1 bg-slate-50 dark:bg-slate-900 p-2 text-slate-400 text-xs">Ex: Não consegui compreender por que o JOIN exige a chave estrangeira...</div>
                </div>
              </div>
            </div>
          )}

          {wireframeAtivo === 'artigo' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                <span className="font-mono text-xs uppercase text-amber-600 dark:text-amber-400 font-bold">
                  [WIREFRAME FASE 3 / FUTURO] · Envio Comunitário de Artigo para a Biblioteca
                </span>
                <span className="text-slate-500">Colaboração de Desenvolvedores</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Permite que desenvolvedores experientes redijam manuais técnicos ou POPs e submetam para aprovação editorial do administrador antes de entrar no catálogo oficial da SEMOB.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
