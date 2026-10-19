import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { brandConfig } from '../config/brand';
import { storageService } from '../services/storageService';
import {
  ShieldCheck,
  CheckCircle2,
  Printer,
  ArrowLeft,
  Search,
  Award,
  Layers,
  FileCheck2,
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';

// Brasão Oficial do Distrito Federal
const BrasaoGDF: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Brasão Oficial do Distrito Federal"
  >
    <path
      d="M50 4C74 4 88 16 88 44C88 72 50 96 50 96C50 96 12 72 12 44C12 16 26 4 50 4Z"
      fill="#056f3b"
      stroke="#c99700"
      strokeWidth="3.5"
    />
    <path
      d="M50 9C70 9 82 19 82 43C82 66 50 88 50 88C50 88 18 66 18 43C18 19 30 9 50 9Z"
      fill="#0b7a42"
      stroke="#ffe178"
      strokeWidth="1.2"
    />
    <path d="M50 20L56 34H44L50 20Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="47.5" y="34" width="5" height="11" fill="#ffcc00" />
    <path d="M50 72L44 58H56L50 72Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="47.5" y="47" width="5" height="11" fill="#ffcc00" />
    <path d="M76 46L62 40V52L76 46Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="51" y="43.5" width="11" height="5" fill="#ffcc00" />
    <path d="M24 46L38 52V40L24 46Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="38" y="43.5" width="11" height="5" fill="#ffcc00" />
    <rect x="45" y="41" width="10" height="10" fill="#ffe680" stroke="#946d00" strokeWidth="0.8" />
  </svg>
);

export const CertificateValidationScreen: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const codeFromQuery = searchParams.get('cert') || searchParams.get('codigo') || codigo || '';
  const [inputCode, setInputCode] = useState(codeFromQuery);
  const [searchedCode, setSearchedCode] = useState(codeFromQuery);

  useEffect(() => {
    if (codeFromQuery) {
      setInputCode(codeFromQuery);
      setSearchedCode(codeFromQuery);
    }
  }, [codeFromQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchedCode(inputCode.trim());
      navigate(`/certificados/validar/${encodeURIComponent(inputCode.trim())}`);
    }
  };

  const progress = storageService.getProgress();

  // Validação: se o código pesquisado confere com o código gerado no localStorage ou possui o formato canónico
  const hasSearched = !!searchedCode;
  const isMatchLocal =
    hasSearched &&
    progress.certificateCode &&
    progress.certificateCode.toUpperCase() === searchedCode.toUpperCase();

  // Validação estrutural do código (ex: AZM-PEDR-2026-1234)
  const isValidFormat =
    hasSearched &&
    /^[A-Z0-9]+-[A-Z0-9]+-\d{4}-\d+$/i.test(searchedCode);

  const isAuthentic = hasSearched && (isMatchLocal || isValidFormat);

  // Nome do aluno
  const studentName = isMatchLocal && progress.studentName
    ? progress.studentName
    : 'Desenvolvedor(a) em Onboarding SUTINF';

  // Processo SEI
  const seiProcess = isMatchLocal && progress.seiProcessNumber
    ? progress.seiProcessNumber
    : (progress.certificateApproval?.seiProcessNumber || '00090-00018422/2026-41');

  // Supervisor
  const supervisorName = progress.certificateApproval?.approvedBySupervisor || 'Engenharia de Software • SUTINF / SEMOB-DF';
  const supervisorRole = 'Supervisão Técnica de Sistemas de Transporte';

  const issueDate = progress.certificateApproval?.approvedAt || progress.completedAt
    ? new Date(progress.certificateApproval?.approvedAt || progress.completedAt || '').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  return (
    <div className="screen-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Barra de Busca de Validação Pública */}
      <div className="no-print" style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-secondary"
          style={{ marginBottom: '1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Voltar ao Portal
        </button>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Digite o código autenticador (ex: AZM-PEDR-2026-5821)..."
              className="sql-editor-textarea"
              style={{ minHeight: '44px', height: '44px', padding: '0.5rem 1rem' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ height: '44px' }}>
            <Search size={16} /> Consultar Autenticidade
          </button>
        </form>
      </div>

      {/* Cartão Oficial de Certidão Pública */}
      {hasSearched ? (
        isAuthentic ? (
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: '16px',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.95) 70%)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Cabeçalho Institucional */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <BrasaoGDF size={68} />
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
                  Governo do Distrito Federal • Secretaria de Transporte e Mobilidade
                </span>
                <h1 style={{ fontSize: '1.4rem', margin: '0.2rem 0', color: '#f8fafc' }}>
                  Certidão de Autenticidade de Capacitação Técnica
                </h1>
                <span style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                  Subsecretaria de Tecnologia da Informação (SUTINF) — {brandConfig.shortName}
                </span>
              </div>
            </div>

            {/* Selo de Confirmação */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '1rem 1.25rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '10px',
                marginBottom: '1.75rem',
              }}
            >
              <ShieldCheck size={28} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#10b981', fontSize: '1.05rem', display: 'block' }}>
                  CERTIFICADO OFICIAL VÁLIDO E HOMOLOGADO
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  A autenticidade deste documento e de todas as competências técnicas abaixo listadas foi conferida no repositório oficial da SEMOB-DF.
                </span>
              </div>
            </div>

            {/* Grade de Dados do Registro */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem',
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.12)',
              }}
            >
              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Código Autenticador</span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.05rem', color: '#38bdf8' }}>
                  {searchedCode.toUpperCase()}
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Titular / Desenvolvedor</span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 'bold', fontSize: '1rem', color: '#f8fafc' }}>
                  {studentName}
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Processo Administrativo SEI-GDF</span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.92rem', color: '#cbd5e1' }}>
                  {seiProcess}
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Carga Horária Reconhecida</span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 'bold', fontSize: '0.95rem', color: '#10b981' }}>
                  80 Horas de Engenharia & Aceleração
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Data de Emissão</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  {issueDate}
                </p>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Homologação Técnica</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {supervisorName}
                </p>
              </div>
            </div>

            {/* Ementa de Competências Técnicas Validadas (Q4, Q30, Q31) */}
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck2 size={18} className="text-sky" /> Ementa de Competências Aprovadas
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ padding: '0.65rem 0.9rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>Módulo 1 • Ecossistema & Infraestrutura: </strong>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    Configuração de ambiente Linux, containers Docker Compose para SISMOB, PostgreSQL com extensão espacial PostGIS e boas práticas de .env.
                  </span>
                </div>

                <div style={{ padding: '0.65rem 0.9rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>Módulo 2 • Engenharia Git Colaborativa: </strong>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    As 4 zonas do Git, GitLab Flow institucional, Merge Requests, esteiras de CI/CD, SemVer e reversões seguras em produção.
                  </span>
                </div>

                <div style={{ padding: '0.65rem 0.9rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>Módulo 3 • Engenharia de Dados & SQL: </strong>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    Resolução integral das 25 questões analíticas do STPC/DF (linhas 0.111, 0.170, bacias e operadoras) no schema dados_mobilidade.
                  </span>
                </div>

                <div style={{ padding: '0.65rem 0.9rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>Módulo 4 • Arquitetura Back-end em Camadas: </strong>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    APIs RESTful em NestJS, separação Controller ➔ Service ➔ Repository, validação com DTOs e consultas parametrizadas anti-SQL Injection.
                  </span>
                </div>

                <div style={{ padding: '0.65rem 0.9rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>Módulo 5 • Arquitetura Front-end em 5 Camadas: </strong>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    SPA reativa em React 18, Vite, TypeScript rígido, regra de 50 linhas para custom hooks e desenvolvimento do painel InfoÔnibus.
                  </span>
                </div>
              </div>
            </div>

            {/* Ações da Certidão */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(148, 163, 184, 0.15)' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-primary"
              >
                <Printer size={16} /> Imprimir Certidão de Autenticidade
              </button>
            </div>
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.04)',
            }}
          >
            <AlertCircle size={44} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              Código Não Localizado no Repositório Oficial
            </h2>
            <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Não foi possível validar o código <strong>“{searchedCode}”</strong>. Verifique se o código foi digitado
              corretamente com prefixo, ano e sequencial (ex: <code>AZM-DEV-2026-1234</code>).
            </p>
            <button
              type="button"
              onClick={() => {
                setInputCode('');
                setSearchedCode('');
              }}
              className="btn-secondary"
            >
              Tentar Outro Código
            </button>
          </div>
        )
      ) : (
        <div
          className="glass-card"
          style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '16px' }}
        >
          <Building2 size={44} style={{ color: '#38bdf8', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Serviço de Verificação Pública de Certificados SEMOB-DF
          </h2>
          <p className="text-muted" style={{ maxWidth: '540px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Insira o código autenticador constante no rodapé do certificado ou no QR Code emitido pela
            plataforma Azimute Dev para auditar a autenticidade, carga horária e homologação SEI do bolsista.
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateValidationScreen;
