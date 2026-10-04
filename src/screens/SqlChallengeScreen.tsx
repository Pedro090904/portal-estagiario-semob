import React, { useState } from 'react';
import { SqlQuestion, ScreenType } from '../types';
import { SQL_CHALLENGE_QUESTIONS } from '../services/dataService';
import { 
  Database, 
  Search, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  HelpCircle, 
  Lightbulb, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface SqlChallengeScreenProps {
  completedChallenges: string[];
  onToggleChallenge: (challengeId: string) => void;
  notes: Record<string, string>;
  onSaveNote: (key: string, note: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SqlChallengeScreen: React.FC<SqlChallengeScreenProps> = ({
  completedChallenges,
  onToggleChallenge,
  notes,
  onSaveNote,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  const toggleSolution = (id: string) => {
    setOpenSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['Todas', 'Parte I: Linha 0.111', 'Parte II: Sentidos 0.170', 'Parte III: Cruzamentos Gerais'];

  const filteredQuestions = SQL_CHALLENGE_QUESTIONS.filter((q) => {
    const matchesCategory = selectedCategory === 'Todas' || q.category === selectedCategory;
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.letter.toLowerCase() === searchQuery.toLowerCase() ||
      q.officialQuery.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedCount = SQL_CHALLENGE_QUESTIONS.filter((q) => completedChallenges.includes(q.id)).length;

  return (
    <div className="sql-challenge-screen">
      {/* Header */}
      <div className="challenge-page-header">
        <div className="header-badge bg-emerald-pill">
          <Database size={16} />
          <span>DESAFIO PRÁTICO EM BANCO DE DADOS</span>
        </div>
        <h1 className="page-title">Explorando o Banco dados_mobilidade (25 Questões)</h1>
        <p className="page-subtitle">
          Construa as consultas SQL para responder às perguntas reais da operação de mobilidade urbana do DF. Conecte-se ao banco, escreva seu código e compare com a solução oficial.
        </p>

        {/* Progress bar */}
        <div className="challenge-status-bar">
          <div className="status-text">
            <span>Progresso no Desafio SQL: <strong>{completedCount} de {SQL_CHALLENGE_QUESTIONS.length} resolvidas</strong></span>
            <span className="status-pct">{Math.round((completedCount / SQL_CHALLENGE_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="status-track">
            <div 
              className="status-fill" 
              style={{ width: `${(completedCount / SQL_CHALLENGE_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="challenge-toolbar">
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por letra, palavra ou comando..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Question Cards List */}
      <div className="questions-card-list">
        {filteredQuestions.map((q) => {
          const isDone = completedChallenges.includes(q.id);
          const isSolOpen = !!openSolutions[q.id];
          const userNote = notes[q.id] || '';

          return (
            <div key={q.id} className={`sql-card ${isDone ? 'sql-card-done' : ''}`}>
              <div className="sql-card-header">
                <div className="sql-letter-badge">
                  <span>{q.letter.toUpperCase()}</span>
                </div>
                <div className="sql-title-wrap">
                  <div className="sql-meta">
                    <span className="sql-category-chip">{q.category}</span>
                    <span className={`sql-diff-chip diff-${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <h3 className="sql-card-title">{q.title}</h3>
                </div>
                <button
                  onClick={() => onToggleChallenge(q.id)}
                  className={`btn-check-square ${isDone ? 'checked' : ''}`}
                  title={isDone ? 'Desmarcar resolução' : 'Marcar como resolvido'}
                >
                  <CheckCircle2 size={20} />
                  <span>{isDone ? 'Resolvido' : 'Marcar como feito'}</span>
                </button>
              </div>

              <div className="sql-card-body">
                <p className="sql-objective">
                  <strong>Enunciado da Questão:</strong> {q.objective}
                </p>

                {/* User Scratchpad */}
                <div className="scratchpad-box">
                  <label className="scratchpad-label">
                    <Code size={14} />
                    <span>Seu Rascunho de Query SQL (salvo automaticamente):</span>
                  </label>
                  <textarea
                    value={userNote}
                    onChange={(e) => onSaveNote(q.id, e.target.value)}
                    placeholder="Escreva sua consulta aqui para praticar... ex: SELECT ... FROM ... WHERE ...;"
                    className="scratchpad-textarea"
                    rows={3}
                  />
                </div>

                {/* Solution Toggle Accordion */}
                <div className="solution-accordion">
                  <button onClick={() => toggleSolution(q.id)} className="btn-toggle-solution">
                    <div className="btn-toggle-left">
                      <Lightbulb size={16} className="text-amber" />
                      <span>{isSolOpen ? 'Ocultar Gabarito Oficial e Análise' : 'Revelar Gabarito Oficial & Análise Lógica'}</span>
                    </div>
                    {isSolOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isSolOpen && (
                    <div className="solution-content">
                      <div className="official-query-block">
                        <div className="query-header">
                          <Code size={14} />
                          <span>Consulta SQL Oficial (PostgreSQL / PostGIS)</span>
                        </div>
                        <pre>
                          <code>{q.officialQuery}</code>
                        </pre>
                      </div>

                      <div className="solution-explanation">
                        <div className="expl-item">
                          <HelpCircle size={16} className="text-sky" />
                          <div>
                            <strong>Raciocínio Lógico:</strong>
                            <p>{q.logicExplanation}</p>
                          </div>
                        </div>

                        <div className="expl-item">
                          <Lightbulb size={16} className="text-amber" />
                          <div>
                            <strong>Armadilhas Comuns & Dica de Produção:</strong>
                            <p>{q.trapsAndTips}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="empty-search-state">
            <p>Nenhuma questão encontrada com o filtro "{searchQuery}".</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('Todas'); }} className="btn-secondary">
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="sql-footer-banner">
        <div className="banner-text">
          <h3>Quer ver todas as resoluções formatadas em um só documento?</h3>
          <p>Acesse o Gabarito Oficial completo em formato de manual técnico com análise aprofundada.</p>
        </div>
        <button onClick={() => onNavigate('modulo-gabarito')} className="btn-primary">
          <BookOpen size={18} />
          Abrir Manual Completo do Gabarito <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};
