import React, { useState, useEffect } from 'react';
import { ChallengeSubmission } from '../types';

interface ChallengeSubmissionPanelProps {
  challengeId: string;
  title: string;
  subtitle: string;
  prChecklist: string[];
  requireRepoUrl?: boolean;
  existingSubmission?: ChallengeSubmission;
  onSaveSubmission: (challengeId: string, data: Partial<ChallengeSubmission>) => void;
  onUnlockGabarito?: () => void;
}

export const ChallengeSubmissionPanel: React.FC<ChallengeSubmissionPanelProps> = ({
  challengeId,
  title,
  subtitle,
  prChecklist,
  requireRepoUrl = true,
  existingSubmission,
  onSaveSubmission,
  onUnlockGabarito,
}) => {
  const [repoUrl, setRepoUrl] = useState(existingSubmission?.repositoryUrl || '');
  const [checkedItems, setCheckedItems] = useState<number[]>(
    existingSubmission?.checkedPrItems || []
  );
  const [isSubmitted, setIsSubmitted] = useState(
    Boolean(existingSubmission?.checklistCompleted)
  );

  useEffect(() => {
    setRepoUrl(existingSubmission?.repositoryUrl || '');
    setCheckedItems(existingSubmission?.checkedPrItems || []);
    setIsSubmitted(Boolean(existingSubmission?.checklistCompleted));
  }, [existingSubmission]);

  const allChecked = prChecklist.every((_, idx) => checkedItems.includes(idx));
  const canSubmit = allChecked && (!requireRepoUrl || repoUrl.trim().length > 8);

  const toggleItem = (idx: number) => {
    const next = checkedItems.includes(idx)
      ? checkedItems.filter((i) => i !== idx)
      : [...checkedItems, idx];
    setCheckedItems(next);
    setIsSubmitted(false);
    onSaveSubmission(challengeId, {
      checkedPrItems: next,
      repositoryUrl: repoUrl.trim(),
      checklistCompleted: false,
    });
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSaveSubmission(challengeId, {
      repositoryUrl: repoUrl.trim(),
      checkedPrItems: checkedItems,
      checklistCompleted: true,
      reviewStatus: 'EM_REVISAO',
    });
    setIsSubmitted(true);
    if (onUnlockGabarito) onUnlockGabarito();
  };

  return (
    <section className="section-card" style={{ marginTop: '2rem' }}>
      <div className="section-header-row">
        <div>
          <span className="hero-badge" style={{ marginBottom: '0.5rem' }}>
            ✅ Definition of Done & Submissão para Revisão
          </span>
          <h2>{title}</h2>
          <p className="text-muted">{subtitle}</p>
        </div>
        <span className={`status-pill ${isSubmitted ? 'passed' : 'pending'}`}>
          {isSubmitted
            ? '✓ Submetido para Revisão do Supervisor'
            : `${checkedItems.length}/${prChecklist.length} critérios validados`}
        </span>
      </div>

      <div className="checklist-box" style={{ marginTop: '1rem' }}>
        {prChecklist.map((item, idx) => {
          const checked = checkedItems.includes(idx);
          return (
            <label
              key={idx}
              className={`checklist-item ${checked ? 'completed' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(idx)}
              />
              <span className="checklist-text">{item}</span>
            </label>
          );
        })}
      </div>

      <form onSubmit={handleConfirm} style={{ marginTop: '1.25rem' }}>
        {requireRepoUrl && (
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '0.4rem',
                fontSize: '0.9rem',
              }}
            >
              🦊 Link do Repositório de Entrega (GitLab SEMOB / Merge Request):
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://gitlab.semob.df.gov.br/estagio/seu-repositorio"
              className="sql-editor-textarea"
              style={{ minHeight: '44px', height: '44px', padding: '0.6rem 1rem' }}
              required={requireRepoUrl}
            />
          </div>
        )}

        <div className="hero-actions">
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary"
            style={{ opacity: canSubmit ? 1 : 0.5 }}
          >
            {isSubmitted
              ? '✓ Entrega Registada no Progresso Global'
              : '🚀 Validar Checklist e Submeter Entrega'}
          </button>
        </div>
      </form>
    </section>
  );
};
