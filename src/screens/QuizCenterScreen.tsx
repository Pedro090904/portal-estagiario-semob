import React, { useState } from 'react';
import { QuizBlockData, QuizAttempt, ScreenType } from '../types';
import { QUIZZES } from '../services/dataService';
import { QuizBlock } from '../components/QuizBlock';
import { 
  CheckSquare, 
  Award, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';

interface QuizCenterScreenProps {
  quizAttempts: Record<string, QuizAttempt>;
  onSaveQuizAttempt: (attempt: QuizAttempt) => void;
  onNavigate: (screen: ScreenType) => void;
  onResetProgress: () => void;
}

export const QuizCenterScreen: React.FC<QuizCenterScreenProps> = ({
  quizAttempts,
  onSaveQuizAttempt,
  onNavigate,
  onResetProgress,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(QUIZZES[0].id);

  const selectedQuiz = QUIZZES.find((q) => q.id === selectedQuizId) || QUIZZES[0];

  const totalQuizzes = QUIZZES.length;
  const passedCount = QUIZZES.filter((q) => quizAttempts[q.id]?.passed).length;
  const attemptedCount = Object.keys(quizAttempts).length;

  const averageScore = (() => {
    const scores = Object.values(quizAttempts).map((a) => a.score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  return (
    <div className="quiz-center-screen">
      {/* Header */}
      <div className="center-header">
        <div className="header-badge">
          <Brain size={16} />
          <span>AVALIAÇÃO CONTÍNUA DE COMPETÊNCIAS</span>
        </div>
        <h1 className="page-title">Central de Quizzes & Simulados SUTINF</h1>
        <p className="page-subtitle">
          Teste seus conhecimentos segmentados por bloco de estudo. Cada quiz possui correção instantânea, gabarito didático comentado e justificativas técnicas detalhadas para cada alternativa.
        </p>

        {/* Stats Row */}
        <div className="quiz-stats-grid">
          <div className="stat-card">
            <span className="stat-label">Quizzes Aprovados</span>
            <div className="stat-num text-emerald">{passedCount} / {totalQuizzes}</div>
            <span className="stat-sub">Mínimo de 75% exigido</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Média Geral de Acertos</span>
            <div className="stat-num text-sky">{averageScore}%</div>
            <span className="stat-sub">{attemptedCount} simulado(s) concluído(s)</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Status da Certificação</span>
            <div className="stat-num text-indigo">
              {passedCount >= 4 ? 'Elegível 🏆' : `${4 - passedCount} faltante(s)`}
            </div>
            <span className="stat-sub">Atingir 4 ou mais aprovações</span>
          </div>
        </div>
      </div>

      {/* Quiz Selector Navigation Tabs */}
      <div className="quiz-selector-bar">
        {QUIZZES.map((quiz, index) => {
          const attempt = quizAttempts[quiz.id];
          const isPassed = attempt?.passed;
          const isSelected = quiz.id === selectedQuizId;

          return (
            <button
              key={quiz.id}
              onClick={() => setSelectedQuizId(quiz.id)}
              className={`quiz-tab-button ${isSelected ? 'active' : ''} ${isPassed ? 'tab-passed' : ''}`}
            >
              <div className="tab-top">
                <span className="tab-idx">Bloco 0{index + 1}</span>
                {attempt && (
                  <span className={`tab-score ${isPassed ? 'score-good' : 'score-low'}`}>
                    {attempt.score}%
                  </span>
                )}
              </div>
              <div className="tab-title">{quiz.badge}</div>
              <div className="tab-status-icon">
                {isPassed ? (
                  <CheckCircle2 size={16} className="text-emerald" />
                ) : attempt ? (
                  <XCircle size={16} className="text-amber" />
                ) : (
                  <span className="dot-pending"></span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Quiz Block */}
      <div className="active-quiz-container">
        <QuizBlock
          quiz={selectedQuiz}
          existingAttempt={quizAttempts[selectedQuiz.id]}
          onSaveAttempt={onSaveQuizAttempt}
        />
      </div>

      {/* Summary Table of Attempts */}
      <div className="attempts-summary-section">
        <div className="section-header-compact">
          <h3>Resumo Consolidado de Desempenho</h3>
          <p className="text-muted">Acompanhe suas notas e tente novamente para melhorar sua pontuação.</p>
        </div>

        <div className="table-wrapper">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Bloco de Conhecimento</th>
                <th>Questões</th>
                <th>Sua Pontuação</th>
                <th>Resultado</th>
                <th>Data da Tentativa</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {QUIZZES.map((q) => {
                const attempt = quizAttempts[q.id];
                return (
                  <tr key={q.id}>
                    <td>
                      <strong>{q.title}</strong>
                      <div className="text-muted text-xs">{q.subtitle}</div>
                    </td>
                    <td>{q.questions.length} itens</td>
                    <td>
                      {attempt ? (
                        <strong>{attempt.score}%</strong>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {attempt ? (
                        attempt.passed ? (
                          <span className="pill-badge pill-green">Aprovado</span>
                        ) : (
                          <span className="pill-badge pill-red">Não Atingiu</span>
                        )
                      ) : (
                        <span className="pill-badge pill-gray">Não Realizado</span>
                      )}
                    </td>
                    <td>
                      {attempt ? (
                        new Date(attempt.completedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedQuizId(q.id)}
                        className="btn-link"
                      >
                        {attempt ? 'Refazer / Revisar' : 'Iniciar Quiz'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="quiz-center-footer">
        <div className="footer-left">
          <p>Deseja zerar suas respostas e reiniciar os testes do zero?</p>
          <button onClick={onResetProgress} className="btn-danger btn-sm">
            <RotateCcw size={14} />
            Zerar Histórico de Quizzes
          </button>
        </div>

        <button onClick={() => onNavigate('certificado')} className="btn-primary">
          <Award size={18} />
          Ver Status do Certificado
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
