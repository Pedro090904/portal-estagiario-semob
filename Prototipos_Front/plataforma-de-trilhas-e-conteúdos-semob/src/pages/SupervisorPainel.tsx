import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  AlunoSupervisorView,
  ItemFilaEntrega,
  ItemFilaCertificado,
  EntregaStatus
} from '../types';
import { SkeletonTable, SkeletonCard } from '../components/SkeletonLoader';
import { StatusEntrega } from '../components/StatusEntrega';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  ExternalLink,
  MessageSquare,
  X,
  Send,
  BarChart2,
  AlertOctagon
} from 'lucide-react';

export const SupervisorPainel: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'entregas' | 'certificados' | 'alunos' | 'relatorios'>('entregas');
  const [alunos, setAlunos] = useState<AlunoSupervisorView[]>([]);
  const [filaEntregas, setFilaEntregas] = useState<ItemFilaEntrega[]>([]);
  const [filaCertificados, setFilaCertificados] = useState<ItemFilaCertificado[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Review Modal state
  const [itemRevisao, setItemRevisao] = useState<ItemFilaEntrega | null>(null);
  const [decisaoRevisao, setDecisaoRevisao] = useState<EntregaStatus>('aprovada');
  const [comentarioRevisao, setComentarioRevisao] = useState('');
  const [erroComentario, setErroComentario] = useState('');
  const [salvandoRevisao, setSalvandoRevisao] = useState(false);

  // Anulacao Modal state
  const [certAnular, setCertAnular] = useState<string | null>(null);
  const [motivoAnulacao, setMotivoAnulacao] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [als, fe, fc] = await Promise.all([
        api.supervisor.listarAlunos(),
        api.supervisor.obterFilaEntregas(),
        api.supervisor.obterFilaCertificados()
      ]);
      setAlunos(als);
      setFilaEntregas(fe);
      setFilaCertificados(fc);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmeterRevisao = async () => {
    if (!itemRevisao) return;
    setErroComentario('');

    if (decisaoRevisao === 'precisa_de_correcao' && !comentarioRevisao.trim()) {
      setErroComentario('O comentário é obrigatório ao devolver a entrega para correção do estagiário.');
      return;
    }

    setSalvandoRevisao(true);
    try {
      await api.supervisor.revisarEntrega(itemRevisao.id, decisaoRevisao, comentarioRevisao);
      setItemRevisao(null);
      setComentarioRevisao('');
      await carregarDados();
    } catch (e) {
      console.error(e);
    } finally {
      setSalvandoRevisao(false);
    }
  };

  const handleHomologarCertificado = async (itemId: string) => {
    try {
      await api.supervisor.homologarCertificado(itemId);
      await carregarDados();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnularCertificado = async () => {
    if (!certAnular || !motivoAnulacao.trim()) return;
    try {
      await api.supervisor.anularCertificado(certAnular, motivoAnulacao);
      setCertAnular(null);
      setMotivoAnulacao('');
      await carregarDados();
    } catch (e) {
      console.error(e);
    }
  };

  if (carregando) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Supervisão e Orientação de Estágio Técnico
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Painel do Orientador Técnico
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          Acompanhamento dos estagiários da SEMOB, fila de revisão de repositórios GitLab e homologação de certificados com processo SEI.
        </p>
      </div>

      {/* KPI Stats Strip (Anti-slop: clean row below header) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Entregas Pendentes
          </span>
          <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
            {filaEntregas.length}
          </span>
          <span className="text-[11px] text-slate-500 block">Fila por antiguidade</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Certificados Elegíveis
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {filaCertificados.length}
          </span>
          <span className="text-[11px] text-slate-500 block">Aguardando assinatura</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Estagiários Ativos
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {alunos.length}
          </span>
          <span className="text-[11px] text-slate-500 block">Em formação no SIT</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Média Quizzes Turma
          </span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            87%
          </span>
          <span className="text-[11px] text-slate-500 block">Mínimo exigido: 70%</span>
        </div>
      </div>

      {/* Navigation Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setAbaAtiva('entregas')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            abaAtiva === 'entregas'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Fila de Revisão de Entregas ({filaEntregas.length})
        </button>

        <button
          onClick={() => setAbaAtiva('certificados')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            abaAtiva === 'certificados'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Homologação de Certificados ({filaCertificados.length})
        </button>

        <button
          onClick={() => setAbaAtiva('alunos')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            abaAtiva === 'alunos'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Acompanhamento dos Alunos ({alunos.length})
        </button>

        <button
          onClick={() => setAbaAtiva('relatorios')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            abaAtiva === 'relatorios'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Relatórios & Gargalos Técnicos
        </button>
      </div>

      {/* TAB 1: FILA DE ENTREGAS */}
      {abaAtiva === 'entregas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Ordenadas por antiguidade da submissão (tempo de espera)</span>
            <span>{filaEntregas.length} itens aguardando ação</span>
          </div>

          {filaEntregas.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Fila de entregas zerada!</h3>
              <p className="text-xs text-slate-500">Todas as submissões de código e projetos foram avaliadas pelo orientador.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filaEntregas.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.alunoNome}</span>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="text-slate-500">{item.trilhaNome}</span>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="text-amber-700 dark:text-amber-400 font-mono">
                        Aguardando há {item.tempoEsperaHoras}h
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                      {item.etapaTitulo} (Submissão #{item.tentativaNumero})
                    </h4>

                    <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 truncate">
                      <span>Repositório:</span>
                      <a
                        href={item.urlRepositorio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate"
                      >
                        {item.urlRepositorio}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => setItemRevisao(item)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      Avaliar & Registrar Parecer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FILA DE CERTIFICADOS */}
      {abaAtiva === 'certificados' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Alunos que cumpriram 100% dos critérios e aguardam homologação oficial</span>
            <span>{filaCertificados.length} elegíveis</span>
          </div>

          {filaCertificados.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-2">
              <Award className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Nenhum certificado pendente</h3>
              <p className="text-xs text-slate-500">Novos certificados serão listados assim que os alunos concluírem todas as etapas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filaCertificados.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.alunoNome}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-mono">Processo SEI: {item.processoSei}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Trilha: {item.trilhaNome} · Carga Horária: {item.cargaHoraria}h
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Todas as {item.totalEtapas} etapas concluídas e validadas
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleHomologarCertificado(item.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      Aprovar & Homologar Certificado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACOMPANHAMENTO DOS ALUNOS */}
      {abaAtiva === 'alunos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  <th className="p-4">Estagiário / Aluno</th>
                  <th className="p-4">Área de Atuação</th>
                  <th className="p-4">Progresso Oficial</th>
                  <th className="p-4">Média Quizzes</th>
                  <th className="p-4">Último Acesso</th>
                  <th className="p-4">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {alunos.map(aluno => (
                  <tr key={aluno.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{aluno.nome}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{aluno.email}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{aluno.area}</td>
                    <td className="p-4 font-mono font-medium">
                      {aluno.etapasConcluidas} de {aluno.totalEtapas} etapas
                    </td>
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {aluno.mediaQuiz}%
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">{aluno.ultimoAcesso}</td>
                    <td className="p-4">
                      {aluno.situacao === 'concluido' ? (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">Concluído</span>
                      ) : aluno.situacao === 'aguardando_revisao' ? (
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200">Revisão Pendente</span>
                      ) : aluno.situacao === 'atencao' ? (
                        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200">Sem Acesso Há Dias</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200">Em Dia</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RELATORIOS */}
      {abaAtiva === 'relatorios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              Taxa de Conclusão por Etapa da Trilha
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { nome: '1. Cultura e Arquitetura SEMOB', taxa: 100 },
                { nome: '2. Git e Fluxo no GitLab', taxa: 100 },
                { nome: '3. Modelagem PostgreSQL SIT', taxa: 92 },
                { nome: '4. Desafio Prático SQL (Atrasos)', taxa: 78 },
                { nome: '5. Quiz de Avaliação de Banco', taxa: 85 },
                { nome: '6. Back-end NestJS', taxa: 70 },
                { nome: '7. Entrega de Código GitLab', taxa: 60 }
              ].map(item => (
                <div key={item.nome} className="space-y-1">
                  <div className="flex justify-between">
                    <span>{item.nome}</span>
                    <span className="font-mono font-bold">{item.taxa}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${item.taxa}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Questões e Conceitos Mais Desafiadores nos Quizzes
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  Diferença entre WHERE e HAVING em agregações (42% de erro na 1ª tentativa)
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  Orientadores notaram que estagiários tentam aplicar funções de soma diretamente na cláusula WHERE.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Nomenclatura semântica em branches do GitLab (28% de erro)
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  Esquecimento de incluir o identificador de chamado (ex: SIT-482).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CODE REVIEW MODAL */}
      {itemRevisao && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in"
          onClick={() => setItemRevisao(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Avaliação do Orientador</span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Revisão de Código: {itemRevisao.alunoNome}
                </h3>
              </div>
              <button
                onClick={() => setItemRevisao(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <span className="font-semibold block">Etapa: {itemRevisao.etapaTitulo}</span>
                <a
                  href={itemRevisao.urlRepositorio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  {itemRevisao.urlRepositorio}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Decision options */}
              <div className="space-y-1.5">
                <span className="font-semibold block text-slate-700 dark:text-slate-300">
                  Decisão da Revisão:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'aprovada', label: 'Aprovar', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200' },
                    { id: 'aprovada_com_ajustes', label: 'Aprovar com Ressalvas', color: 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200' },
                    { id: 'precisa_de_correcao', label: 'Devolver p/ Correção', color: 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDecisaoRevisao(opt.id as EntregaStatus)}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-colors ${
                        decisaoRevisao === opt.id ? `${opt.color} ring-1 ring-blue-500` : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviewer Comment Field (Mandatory on rejection as per section 2.8) */}
              <div className="space-y-1.5">
                <label className="font-semibold block text-slate-700 dark:text-slate-300">
                  Parecer Técnico e Instruções ao Aluno:
                  {decisaoRevisao === 'precisa_de_correcao' && (
                    <span className="text-rose-600 font-bold ml-1">(Obrigatório em caso de devolução)</span>
                  )}
                </label>
                <textarea
                  rows={4}
                  value={comentarioRevisao}
                  onChange={(e) => setComentarioRevisao(e.target.value)}
                  placeholder="Explique os pontos avaliados, cobertura de testes do Jest, boas práticas ou correções necessárias no branch..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {erroComentario && (
                  <p className="text-rose-600 font-medium">{erroComentario}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setItemRevisao(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmeterRevisao}
                disabled={salvandoRevisao}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
              >
                {salvandoRevisao ? 'Registrando...' : 'Confirmar Avaliação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
