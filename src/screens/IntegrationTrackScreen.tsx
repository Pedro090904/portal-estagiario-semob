import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { INTEGRATION_STEPS_DATA } from '../content/integrationTrackCatalog';
import {
  Compass,
  CheckCircle2,
  Circle,
  BookOpen,
  Code2,
  Award,
  Layers,
  Server,
  Database,
  GitBranch,
  Layout,
  CheckSquare,
  ShieldCheck,
  FileCheck2,
  Boxes
} from 'lucide-react';

interface IntegrationTrackScreenProps {
  completedItems?: string[];
  onToggleItem?: (key: string) => void;
  onOpenModule?: (moduleId: string) => void;
  onNavigateChallenge?: (screen: string) => void;
  onNavigate?: (screen: ScreenType) => void;
}

const STORAGE_ACTIVE_STEP_KEY = 'azimute_active_track_step';

export const IntegrationTrackScreen: React.FC<IntegrationTrackScreenProps> = ({
  completedItems = [],
  onToggleItem,
  onOpenModule,
  onNavigateChallenge,
  onNavigate,
}) => {
  const steps = INTEGRATION_STEPS_DATA;

  // Carrega a última etapa ativa salva para que ao voltar do manual retorne à mesma etapa
  const [activeStepIndex, setActiveStepIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_STEP_KEY);
      const parsed = saved ? parseInt(saved, 10) : 0;
      return (!isNaN(parsed) && parsed >= 0 && parsed < steps.length) ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const [localChecked, setLocalChecked] = useState<Record<string, boolean>>({});

  const handleStepChange = (idx: number) => {
    setActiveStepIndex(idx);
    try {
      localStorage.setItem(STORAGE_ACTIVE_STEP_KEY, String(idx));
    } catch (e) {
      console.warn('Não foi possível salvar a etapa ativa:', e);
    }
  };

  const isItemChecked = (itemKey: string) => {
    if (completedItems && completedItems.length > 0) {
      return completedItems.includes(itemKey);
    }
    return !!localChecked[itemKey];
  };

  const handleToggle = (itemKey: string) => {
    if (onToggleItem) {
      onToggleItem(itemKey);
    } else {
      setLocalChecked((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
    }
  };

  const handleOpenMod = (moduleId?: string) => {
    if (!moduleId) return;
    // Salva a etapa atual antes de abrir o manual
    try {
      localStorage.setItem(STORAGE_ACTIVE_STEP_KEY, String(activeStepIndex));
    } catch {}

    if (onOpenModule) {
      onOpenModule(moduleId);
    } else if (onNavigate) {
      const map: Record<string, ScreenType> = {
        'mod-1-ambiente': 'modulo-ambiente',
        'mod-2-git': 'modulo-git',
        'mod-3-banco-dados': 'modulo-sql',
        'mod-4-backend': 'modulo-backend',
        'mod-5-frontend': 'modulo-frontend',
      };
      onNavigate(map[moduleId] || 'roteiro');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoChallenge = (stepId?: string) => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_STEP_KEY, String(activeStepIndex));
    } catch {}

    if (stepId === 'step-3') {
      if (onNavigateChallenge) onNavigateChallenge('sql-challenge');
      else if (onNavigate) onNavigate('desafio-sql');
    } else if (stepId === 'step-4') {
      if (onNavigateChallenge) onNavigateChallenge('backend-challenge');
      else if (onNavigate) onNavigate('desafio-backend');
    } else if (stepId === 'step-5') {
      if (onNavigateChallenge) onNavigateChallenge('frontend-challenge');
      else if (onNavigate) onNavigate('desafio-frontend');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cálculo de progresso de entregas da trilha
  const totalDeliverables = steps.reduce((acc, s) => acc + (s.deliverables?.length || 0), 0);
  const completedDeliverablesCount = steps.reduce((acc, s) => {
    const checkedInStep = (s.deliverables || []).filter((_, idx) =>
      isItemChecked(`${s.id}-${idx}`)
    ).length;
    return acc + checkedInStep;
  }, 0);

  const trackPercentage = totalDeliverables > 0
    ? Math.round((completedDeliverablesCount / totalDeliverables) * 100)
    : 0;

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="screen-container">
      {/* Header / Hero */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Compass size={14} /> Roteiro Oficial de Integração • SEMOB-DF / SUTINF
          </span>
          <h1>Trilha Guiada de Acolhimento & Formação</h1>
          <p>
            O percurso sequencial obrigatório de onboarding: do primeiro dia ao desenvolvimento de
            soluções completas no ecossistema SISMOB e emissão do Certificado Oficial de Capacitação.
          </p>
        </div>
      </section>

      {/* Como Funciona a Trilha & Critérios Oficiais de Homologação */}
      <section className="section-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={22} className="text-sky" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Como Funciona a Trilha e Critérios de Conclusão</h2>
        </div>
        <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          A formação na <strong>SUTINF / SEMOB-DF</strong> é estruturada em 5 etapas sequenciais.
          Para que o(a) desenvolvedor(a) tenha o seu Certificado de Capacitação Técnica (80h) homologado pelo Supervisor
          e instruído no processo administrativo SEI-GDF, é necessário cumprir cumulativamente os requisitos:
        </p>

        <div className="cards-grid three-cols" style={{ gap: '0.85rem' }}>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <BookOpen size={16} className="text-sky" />
              <strong style={{ fontSize: '0.9rem' }}>1. Leitura dos 5 Manuais</strong>
            </div>
            <p className="text-muted" style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Estudo dos 5 manuais oficiais: Setup & Docker, Git GitLab Flow, Modelagem SQL, Back-end NestJS e Front-end React.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <CheckSquare size={16} className="text-emerald" />
              <strong style={{ fontSize: '0.9rem' }}>2. Quizzes Oficiais (≥ 70%)</strong>
            </div>
            <p className="text-muted" style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Aprovação com aproveitamento mínimo de 70% em cada um dos 5 testes teóricos para comprovar fixação técnica.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Code2 size={16} className="text-indigo" />
              <strong style={{ fontSize: '0.9rem' }}>3. Desafios Práticos & SEI</strong>
            </div>
            <p className="text-muted" style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Executar as 25 queries SQL no schema <code>dados_mobilidade</code>, submeter os repositórios GitLab e obter parecer do supervisor.
            </p>
          </div>
        </div>

        {/* Pilares do Ecossistema SUTINF */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Layers size={16} className="text-amber" />
            <strong style={{ fontSize: '0.92rem' }}>Arquitetura & Engenharia de Transporte Público (STPC/DF)</strong>
          </div>
          <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
            A SEMOB-DF gerencia mais de <strong>1,3 milhão de passageiros diários</strong> em 5 bacias operacionais.
            O novo ecossistema <strong>SISMOB</strong> unifica telemetria GPS em tempo real, itinerários geoespaciais com PostGIS,
            arquitetura back-end estrita em 3 camadas (Controller ➔ Service ➔ Repository) e interfaces front-end em 5 camadas.
            Nossa política DevSecOps proíbe commits diretos na branch principal, exigindo revisão por pares via Merge Requests.
          </p>
        </div>
      </section>

      {/* Barra de Progresso Global de Entregas */}
      <section className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Progresso das Entregas Obrigatórias</h3>
            <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
              {completedDeliverablesCount} de {totalDeliverables} itens de checklist concluídos ({trackPercentage}%)
            </p>
          </div>
          <span className="status-pill passed" style={{ fontSize: '0.8rem' }}>
            Etapa {activeStepIndex + 1} de {steps.length}: {currentStep?.dayOrPhase ? currentStep.dayOrPhase.split('•')[0].trim() : ''}
          </span>
        </div>

        <div style={{ width: '100%', height: '8px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '999px', marginTop: '0.85rem', overflow: 'hidden' }}>
          <div
            style={{
              width: `${trackPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </section>

      {/* Navegação Sequencial das Etapas (Tabs / Stepper) */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {steps.map((st, idx) => {
          const stepChecklistCount = (st.deliverables || []).filter((_, dIdx) =>
            isItemChecked(`${st.id}-${dIdx}`)
          ).length;
          const isStepComplete = (st.deliverables || []).length > 0 && stepChecklistCount === (st.deliverables || []).length;
          const isActive = idx === activeStepIndex;

          return (
            <button
              key={st.id || idx}
              type="button"
              onClick={() => handleStepChange(idx)}
              className={`sql-filter-btn ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                padding: '0.6rem 1rem',
              }}
            >
              {isStepComplete ? (
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
              ) : (
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{idx + 1}.</span>
              )}
              <span>{st.dayOrPhase ? st.dayOrPhase.split('•')[0].trim() : `Etapa ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {/* Detalhe da Etapa Selecionada */}
      <section className="section-card" style={{ padding: '1.75rem' }}>
        {/* Cabeçalho da Etapa: Título, Descrição e Botões de Ação Padronizados */}
        <div>
          <span className="status-pill passed" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
            {currentStep.dayOrPhase}
          </span>
          <h2 style={{ fontSize: '1.45rem', marginTop: '0.5rem', marginBottom: '0.35rem' }}>
            {currentStep.title}
          </h2>
          <p className="text-muted" style={{ fontSize: '0.92rem', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
            {currentStep.description}
          </p>

          {/* BOTÕES DE AÇÃO PADRONIZADOS (Abaixo do texto em TODAS as etapas) */}
          <div
            className="track-step-actions-row"
            style={{
              display: 'flex',
              gap: '0.65rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '1.15rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
            }}
          >
            {currentStep.relatedModuleId && (
              <button
                type="button"
                onClick={() => handleOpenMod(currentStep.relatedModuleId)}
                className="btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                <BookOpen size={15} /> Abrir Manual Oficial da Etapa
              </button>
            )}

            {currentStep.id === 'step-1' && (
              <span className="status-pill pending" style={{ fontSize: '0.75rem' }}>
                <Boxes size={12} style={{ display: 'inline', marginRight: 4 }} />
                Docker Compose: PostgreSQL + pgAdmin
              </span>
            )}

            {currentStep.id === 'step-2' && (
              <span className="status-pill pending" style={{ fontSize: '0.75rem' }}>
                <GitBranch size={12} style={{ display: 'inline', marginRight: 4 }} />
                GitLab SEMOB: 4 Zonas & Branches
              </span>
            )}

            {currentStep.id === 'step-3' && (
              <button
                type="button"
                onClick={() => handleGoChallenge('step-3')}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <Code2 size={15} /> Abrir Desafio SQL (25 Questões)
              </button>
            )}

            {currentStep.id === 'step-4' && (
              <button
                type="button"
                onClick={() => handleGoChallenge('step-4')}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <Server size={15} /> Abrir Desafio Back-end (Veículos)
              </button>
            )}

            {currentStep.id === 'step-5' && (
              <button
                type="button"
                onClick={() => handleGoChallenge('step-5')}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <Layout size={15} /> Abrir Desafio Front-end (InfoÔnibus)
              </button>
            )}
          </div>
        </div>

        {/* Lista de Entregas & Checklist Obrigatório */}
        <div style={{ marginTop: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={16} className="text-sky" /> Entregas & Critérios de Conclusão da Etapa
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(currentStep.deliverables || []).map((deliverable, dIdx) => {
              const itemKey = `${currentStep.id}-${dIdx}`;
              const checked = isItemChecked(itemKey);

              return (
                <div
                  key={itemKey}
                  onClick={() => handleToggle(itemKey)}
                  className={`track-deliverable-item ${checked ? 'completed' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    background: checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface-hover)',
                    border: checked ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {checked ? (
                    <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                  ) : (
                    <Circle size={18} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                  )}
                  {/* Cor adaptativa que funciona com total nitidez no modo claro e escuro */}
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: checked ? 500 : 600,
                      color: checked ? 'var(--text-muted)' : 'var(--text)',
                      textDecoration: checked ? 'line-through' : 'none',
                      opacity: checked ? 0.75 : 1,
                    }}
                  >
                    {deliverable}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navegação entre Etapas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <button
            type="button"
            disabled={activeStepIndex === 0}
            onClick={() => handleStepChange(Math.max(0, activeStepIndex - 1))}
            className="btn-secondary"
            style={{ opacity: activeStepIndex === 0 ? 0.4 : 1, cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Etapa Anterior
          </button>

          {activeStepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => handleStepChange(Math.min(steps.length - 1, activeStepIndex + 1))}
              className="btn-primary"
            >
              Próxima Etapa ({activeStepIndex + 2} de {steps.length}) →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('certificado');
                else if (onNavigateChallenge) onNavigateChallenge('certificado');
              }}
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Award size={16} /> Ir para Homologação do Certificado
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default IntegrationTrackScreen;
