import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Etapa, Trilha } from '../types';
import { SkeletonCard } from '../components/SkeletonLoader';
import { BlocoConteudo } from '../components/BlocoConteudo';
import { QuizPerguntas } from '../components/QuizPerguntas';
import { EditorSQL } from '../components/EditorSQL';
import { StatusEntrega } from '../components/StatusEntrega';
import { GlossarioTermo } from '../components/GlossarioTermo';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Type,
  Share2,
  GitBranch,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileCode,
  Check
} from 'lucide-react';

export const EtapaVisualizador: React.FC = () => {
  const { trilhaId, etapaId } = useParams<{ trilhaId: string; etapaId: string }>();
  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [etapa, setEtapa] = useState<Etapa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucessoAviso, setSucessoAviso] = useState(false);
  const { fontSizeAdjustment, setFontSizeAdjustment } = useApp();
  const navigate = useNavigate();

  // Code submission inputs
  const [urlGitLab, setUrlGitLab] = useState('');
  const [comentarioEnvio, setComentarioEnvio] = useState('');
  const [erroValidacaoGitLab, setErroValidacaoGitLab] = useState('');

  useEffect(() => {
    carregarEtapa();
  }, [trilhaId, etapaId]);

  const carregarEtapa = async () => {
    setCarregando(true);
    try {
      const t = await api.trilhas.obterPorId(trilhaId || 'trilha-dev-semob-2026');
      setTrilha(t);
      if (t) {
        const e = t.etapas.find(item => item.id === etapaId) || t.etapas[0];
        setEtapa(e);
        if (e.entregaCodigo?.urlRepositorioEnviada) {
          setUrlGitLab(e.entregaCodigo.urlRepositorioEnviada);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const handleMarcarComoLida = async () => {
    if (!trilha || !etapa) return;
    setSalvando(true);
    try {
      await api.etapas.marcarComoLida(trilha.id, etapa.id);
      setSucessoAviso(true);
      await carregarEtapa();
      setTimeout(() => setSucessoAviso(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSalvando(false);
    }
  };

  const handleSubmeterCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacaoGitLab('');

    // Format validation: must be a valid GitLab URL
    const regexGitLab = /^(https?:\/\/)?(www\.)?(gitlab\.(com|semob\.gov\.br)|git\.[a-z0-9.-]+)\/.+/i;
    if (!regexGitLab.test(urlGitLab.trim())) {
      setErroValidacaoGitLab('Por favor, informe uma URL válida do GitLab institucional (ex: https://gitlab.semob.gov.br/... ou https://gitlab.com/...)');
      return;
    }

    if (!trilha || !etapa) return;
    setSalvando(true);
    try {
      await api.entregas.submeter(trilha.id, etapa.id, urlGitLab, comentarioEnvio);
      setComentarioEnvio('');
      setSucessoAviso(true);
      await carregarEtapa();
      setTimeout(() => setSucessoAviso(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando || !trilha || !etapa) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Next and Previous navigation
  const currentIndex = trilha.etapas.findIndex(e => e.id === etapa.id);
  const etapaAnterior = currentIndex > 0 ? trilha.etapas[currentIndex - 1] : null;
  const proximaEtapa = currentIndex < trilha.etapas.length - 1 ? trilha.etapas[currentIndex + 1] : null;

  const fontClass = {
    normal: 'text-sm md:text-base',
    large: 'text-base md:text-lg',
    larger: 'text-lg md:text-xl'
  }[fontSizeAdjustment];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          to={`/trilhas/${trilha.id}`}
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para {trilha.titulo}</span>
        </Link>

        {/* Font size accessibility adjustment for reading manuals */}
        {etapa.tipo === 'manual' && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tamanho da fonte:</span>
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => setFontSizeAdjustment('normal')}
                className={`px-2 py-1 text-xs ${fontSizeAdjustment === 'normal' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                aria-label="Tamanho de fonte normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeAdjustment('large')}
                className={`px-2 py-1 text-sm ${fontSizeAdjustment === 'large' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                aria-label="Tamanho de fonte grande"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeAdjustment('larger')}
                className={`px-2 py-1 text-base ${fontSizeAdjustment === 'larger' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                aria-label="Tamanho de fonte muito grande"
              >
                A++
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Step Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-blue-600 font-bold">Etapa {etapa.ordem} de {trilha.etapas.length}</span>
            <span>·</span>
            <span className="uppercase">{etapa.tipo.replace('_', ' ')}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {etapa.tempoEstimadoMinutos} min de estudo
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Versão: {etapa.versao}</span>
            <span>·</span>
            <span>Revisão: {etapa.dataUltimaRevisao}</span>
          </div>
        </div>

        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {etapa.titulo}
        </h1>

        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {etapa.descricaoCurta}
        </p>

        {sucessoAviso && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Etapa atualizada com sucesso no seu histórico de formação!</span>
          </div>
        )}
      </div>

      {/* Dynamic Content based on Step Type */}
      <div className="space-y-6">
        {/* TYPE 1: MANUAL (LEITURA) */}
        {etapa.tipo === 'manual' && etapa.blocosManual && (
          <div className={`space-y-6 ${fontClass}`}>
            <article className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xs">
              {etapa.blocosManual.map(bloco => (
                <BlocoConteudo key={bloco.id} bloco={bloco} />
              ))}
            </article>

            {/* Read completion mark button */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {etapa.status === 'concluida' ? 'Aula marcada como lida' : 'Concluiu a leitura técnica deste manual?'}
                </h4>
                <p className="text-xs text-slate-500">
                  Marcar como lida registrará seu progresso honesto na trilha da SEMOB.
                </p>
              </div>

              <button
                onClick={handleMarcarComoLida}
                disabled={salvando || etapa.status === 'concluida'}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs md:text-sm shadow-xs transition-colors ${
                  etapa.status === 'concluida'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{etapa.status === 'concluida' ? 'Etapa Concluída' : 'Marcar como Lida'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TYPE 2: QUIZ */}
        {etapa.tipo === 'quiz' && etapa.quiz && (
          <QuizPerguntas
            quiz={etapa.quiz}
            onConcluir={async (nota, aprovado) => {
              if (aprovado) {
                await carregarEtapa();
              }
            }}
          />
        )}

        {/* TYPE 3: DESAFIO SQL */}
        {etapa.tipo === 'desafio_sql' && etapa.desafioSQL && (
          <EditorSQL
            desafio={etapa.desafioSQL}
            onAprovado={async () => {
              await api.etapas.marcarComoLida(trilha.id, etapa.id);
              await carregarEtapa();
            }}
          />
        )}

        {/* TYPE 4: ENTREGA DE CÓDIGO & PROJETO */}
        {(etapa.tipo === 'entrega_codigo' || etapa.tipo === 'projeto') && etapa.entregaCodigo && (
          <div className="space-y-6">
            {/* Project Acceptance Criteria */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Critérios de Aceite para Revisão do Orientador
                  </h3>
                </div>
                <StatusEntrega status={etapa.entregaCodigo.status} />
              </div>

              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {etapa.entregaCodigo.descricao}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Checklist de Homologação:
                </span>
                <ul className="space-y-2 text-xs">
                  {etapa.entregaCodigo.criteriosAceite.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Submission Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-600" />
                Submeter Link do Repositório no GitLab
              </h3>

              <form onSubmit={handleSubmeterCodigo} className="space-y-4 text-xs md:text-sm">
                <div className="space-y-1.5">
                  <label htmlFor="url-gitlab" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Link do Repositório ou Merge Request (GitLab SEMOB)
                  </label>
                  <input
                    id="url-gitlab"
                    type="url"
                    value={urlGitLab}
                    onChange={(e) => setUrlGitLab(e.target.value)}
                    placeholder="https://gitlab.semob.gov.br/estagiarios/seu-usuario/sit-linhas-api"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  />
                  {erroValidacaoGitLab && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {erroValidacaoGitLab}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="comentario-envio" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Notas da Submissão para o Orientador (Opcional)
                  </label>
                  <textarea
                    id="comentario-envio"
                    rows={3}
                    value={comentarioEnvio}
                    onChange={(e) => setComentarioEnvio(e.target.value)}
                    placeholder="Descreva o que foi implementado, decisões técnicas de arquitetura ou dúvidas para o revisor..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    O supervisor receberá uma notificação para homologar o código.
                  </span>
                  <button
                    type="submit"
                    disabled={salvando || !urlGitLab.trim()}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs md:text-sm shadow-xs transition-colors"
                  >
                    {salvando ? 'Enviando...' : 'Enviar para Revisão'}
                  </button>
                </div>
              </form>
            </div>

            {/* Submission and Supervisor Review History */}
            {etapa.entregaCodigo.historicoComentarios.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Histórico de Revisões e Comentários do Supervisor
                </h3>

                <div className="space-y-3">
                  {etapa.entregaCodigo.historicoComentarios.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{rev.autorNome}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{rev.autorCargo}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                          <StatusEntrega status={rev.statusDecisao} size="sm" />
                          <span>{rev.dataHora}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {rev.comentario}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Step Pagination */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
        {etapaAnterior ? (
          <Link
            to={`/trilhas/${trilha.id}/etapas/${etapaAnterior.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="truncate max-w-[140px] sm:max-w-xs">{etapaAnterior.ordem}. {etapaAnterior.titulo}</span>
          </Link>
        ) : (
          <div />
        )}

        {proximaEtapa ? (
          <Link
            to={`/trilhas/${trilha.id}/etapas/${proximaEtapa.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-semibold"
          >
            <span className="truncate max-w-[140px] sm:max-w-xs">{proximaEtapa.ordem}. {proximaEtapa.titulo}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            to={`/certificados`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-bold"
          >
            <span>Ver Certificados</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
