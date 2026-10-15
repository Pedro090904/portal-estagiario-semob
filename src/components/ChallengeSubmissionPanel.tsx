import React, { useState } from 'react';
import { storageService } from '../services/storageService';

interface ChallengeSubmissionPanelProps {
  challengeId: string;
  title: string;
  subtitle: string;
  prChecklist: string[];
  requireRepoUrl?: boolean;
  onUnlockGabarito?: () => void;
}

export const ChallengeSubmissionPanel: React.FC<ChallengeSubmissionPanelProps> = ({
  challengeId,
  title,
  subtitle,
  prChecklist,
  requireRepoUrl = true,
  onUnlockGabarito,
}) => {
  const existing = storageService.getProgress().challengeSubmissions?.[challengeId];

  const [repoUrl, setRepoUrl] = useState(existing?.repositoryUrl || '');
  const [checkedItems, setCheckedItems] = useState<number[]>(existing?.checkedPrItems || []);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(existing?.checklistCompleted));

  const allChecked = prChecklist.every((_, idx) => checkedItems.includes(idx));
  const canSubmit = allChecked && (!requireRepoUrl || repoUrl.trim().length > 5);

  const toggleItem = (idx: number) => {
    const next = checkedItems.includes(idx)
      ? checkedItems.filter((i) => i !== idx)
      : [...checkedItems, idx];
    setCheckedItems(next);
    storageService.saveChallengeSubmission(challengeId, {
      checkedPrItems: next,
      repositoryUrl: repoUrl,
      checklistCompleted: false,
    });
    setIsSubmitted(false);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    storageService.saveChallengeSubmission(challengeId, {
      repositoryUrl: repoUrl.trim(),
      checkedPrItems: checkedItems,
      checklistCompleted: true,
    });
    setIsSubmitted(true);
    if (onUnlockGabarito) onUnlockGabarito();
  };

  return (
    <section className="section-card" style={{ marginTop: '2rem' }}>
      <div className="section-header-row">
        <div>
          <span className="hero-badge" style={{ marginBottom: '0.5rem' }}>
            ✅ Definition of Done & Revisão de PR
          </span>
          <h2>{title}</h2>
          <p className="text-muted">{subtitle}</p>
        </div>
        <span className={`status-pill ${isSubmitted ? 'passed' : 'pending'}`}>
          {isSubmitted ? '✓ Entrega Validada' : `${checkedItems.length}/${prChecklist.length} itens verificados`}
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
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              🔗 Link do Repositório Git / Pull Request da sua entrega:
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/seu-usuario/desafio-azimute"
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
            {isSubmitted ? '✓ Submissão Registada no Progresso' : '🚀 Validar Checklist e Registar Entrega'}
          </button>
        </div>
      </form>
    </section>
  );
};
export default ChallengeSubmissionPanel;
