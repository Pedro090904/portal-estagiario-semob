import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Tag,
  ArrowRight,
  Layers,
  FileCode2,
} from 'lucide-react';
import { LearningModule } from '../types';

interface LibraryScreenProps {
  modules: LearningModule[];
  onOpenManual: (moduleId: string) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  modules,
  onOpenManual,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  const categories = [
    { id: 'todas', label: 'Todos os Manuais' },
    { id: 'fundamentos', label: 'Setup & Docker' },
    { id: 'git', label: 'Git & Versionamento' },
    { id: 'banco-dados', label: 'SQL & Bases de Dados' },
    { id: 'backend', label: 'Backend (NestJS)' },
    { id: 'frontend', label: 'Frontend (React)' },
  ];

  const filteredModules = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return modules.filter((mod) => {
      const matchesCat =
        selectedCategory === 'todas' || mod.category === selectedCategory;

      if (!q) return matchesCat;

      const inTitleOrDesc =
        mod.title.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q);

      const inSections = mod.sections.some(
        (sec) =>
          sec.heading.toLowerCase().includes(q) ||
          sec.body.toLowerCase().includes(q) ||
          sec.commandCards?.some(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.concept.toLowerCase().includes(q)
          ) ||
          sec.scenarios?.some((s) => s.title.toLowerCase().includes(q))
      );

      return matchesCat && (inTitleOrDesc || inSections);
    });
  }, [modules, searchTerm, selectedCategory]);

  return (
    <div className="screen-container">
      {/* Hero da Biblioteca */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <BookOpen size={14} /> Biblioteca Técnica & Consulta Permanente
          </span>
          <h1>Manuais, Arquitetura e Procedimentos (POPs)</h1>
          <p>
            Consulte livremente a documentação viva de engenharia, convenções de código,
            comandos SQL/Git e modelos arquiteturais sem depender da ordem da trilha.
          </p>
        </div>
      </section>

      {/* Barra de Pesquisa e Filtros por Categoria */}
      <section className="section-card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: '1 1 300px' }}>
            <Search size={18} />
            <input
              id="library-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Pesquisar nos manuais (ex: git revert, WHERE, ValidationPipe, Custom Hook)..."
              className="sql-editor-textarea"
              style={{ minHeight: '42px', height: '42px', padding: '0.5rem 1rem' }}
            />
          </div>

          <div className="sql-filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`library-filter-${cat.id}`}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`sql-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredModules.length === 0 && (
          <p className="text-muted" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            Nenhum manual encontrado para “{searchTerm}”. Tente outro termo ou limpe o filtro.
          </p>
        )}

        {/* Catálogo de Manuais */}
        <div className="cards-grid two-cols" style={{ marginTop: '1.5rem' }}>
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.35rem',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                    <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {mod.category.toUpperCase()}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> {mod.estimatedTime} • v{mod.version || '1.0.0'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{mod.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {mod.description}
                </p>

                <div style={{ marginTop: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {mod.sections.slice(0, 4).map((sec, idx) => (
                    <span
                      key={idx}
                      className="status-pill pending"
                      style={{ fontSize: '0.7rem' }}
                    >
                      <Layers size={11} style={{ display: 'inline', marginRight: 3 }} />
                      {sec.heading}
                    </span>
                  ))}
                  {mod.sections.length > 4 && (
                    <span className="status-pill pending" style={{ fontSize: '0.7rem' }}>
                      +{mod.sections.length - 4} capítulos
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.9rem', borderTop: '1px solid rgba(148,163,184,0.15)' }}>
                <button
                  id={`library-open-${mod.id}`}
                  type="button"
                  onClick={() => onOpenManual(mod.id)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <FileCode2 size={16} /> Abrir Manual Completo <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LibraryScreen;
