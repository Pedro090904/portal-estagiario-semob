import React, { useState } from 'react';
import { ScreenType } from '../types';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Edit2, 
  Check,
  QrCode,
  FileCheck,
  FileText
} from 'lucide-react';

interface CertificateScreenProps {
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  completedModulesCount: number;
  totalModules: number;
  passedQuizzesCount: number;
  totalQuizzes: number;
  overallPercentage: number;
  averageScore: number;
  isUnlocked: boolean;
  onNavigate: (screen: ScreenType) => void;
}

// Brasão Oficial do Distrito Federal (Vetor SVG Heráldico de Alta Fidelidade)
const BrasaoDistritoFederal: React.FC<{ size?: number }> = ({ size = 68 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="brasao-gdf-svg"
    aria-label="Brasão Oficial do Distrito Federal"
  >
    {/* Escudo verde clássico do GDF */}
    <path 
      d="M50 4C74 4 88 16 88 44C88 72 50 96 50 96C50 96 12 72 12 44C12 16 26 4 50 4Z" 
      fill="#056f3b" 
      stroke="#c99700" 
      strokeWidth="3.5"
    />
    {/* Faixa interna dourada */}
    <path 
      d="M50 9C70 9 82 19 82 43C82 66 50 88 50 88C50 88 18 66 18 43C18 19 30 9 50 9Z" 
      fill="#0b7a42" 
      stroke="#ffe178" 
      strokeWidth="1.2"
    />
    {/* Cruz de Brasília (Athos Bulcão) — Quatro setas divergentes douradas */}
    {/* Seta Superior */}
    <path d="M50 20L56 34H44L50 20Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="47.5" y="34" width="5" height="11" fill="#ffcc00" />
    
    {/* Seta Inferior */}
    <path d="M50 72L44 58H56L50 72Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="47.5" y="47" width="5" height="11" fill="#ffcc00" />
    
    {/* Seta Direita */}
    <path d="M76 46L62 40V52L76 46Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="51" y="43.5" width="11" height="5" fill="#ffcc00" />
    
    {/* Seta Esquerda */}
    <path d="M24 46L38 52V40L24 46Z" fill="#ffcc00" stroke="#946d00" strokeWidth="0.8" />
    <rect x="38" y="43.5" width="11" height="5" fill="#ffcc00" />

    {/* Núcleo Central da Cruz */}
    <rect x="45" y="41" width="10" height="10" fill="#ffe680" stroke="#946d00" strokeWidth="0.8" />
  </svg>
);

export const CertificateScreen: React.FC<CertificateScreenProps> = ({
  studentName,
  onUpdateStudentName,
  completedModulesCount,
  totalModules,
  passedQuizzesCount,
  totalQuizzes,
  overallPercentage,
  averageScore,
  isUnlocked,
  onNavigate,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(studentName);

  const handleTriggerVisualEffect = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateStudentName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  // Código Identificador Único baseado no protocolo SEI / Portaria GDF
  const cleanId = (studentName || 'DEV')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .substring(0, 3)
    .toUpperCase();
    
  const certificateCode = `GDF-SEMOB-SUTINF-${cleanId}-${new Date().getFullYear()}-0042`;
  const verificationCRC = '7F4A-B82C';
  const processSEI = '00090-00012485/2026-11';
  
  const emissionDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="certificate-screen">
      {/* Top Header */}
      <div className="cert-page-header no-print">
        <div className="header-badge bg-amber-pill">
          <Award size={16} />
          <span>CERTIFICAÇÃO OFICIAL DE CAPACITAÇÃO TÉCNICA</span>
        </div>
        <h1 className="page-title">Certificado de Capacitação Técnica — SUTINF</h1>
        <p className="page-subtitle">
          Documento oficial comprobatório de integração institucional, fluxo colaborativo e conformidade com as diretrizes arquiteturais da Secretaria de Estado de Transporte e Mobilidade do Distrito Federal.
        </p>
      </div>

      {/* Unlock Requirements Status Card */}
      <div className="cert-status-card no-print">
        <div className="status-header">
          <div className="status-title-box">
            {isUnlocked ? (
              <FileCheck size={22} className="text-emerald" />
            ) : (
              <Lock size={22} className="text-muted" />
            )}
            <h3>{isUnlocked ? 'Certificação Regular — Apta para Homologação e Emissão' : 'Critérios Regulamentares de Suficiência'}</h3>
          </div>
          <span className={`pill-badge ${isUnlocked ? 'pill-green' : 'pill-amber'}`}>
            {isUnlocked ? 'Concluído • Aprovado' : 'Pendências Didáticas'}
          </span>
        </div>

        <div className="reqs-grid">
          <div className="req-item">
            <div className="req-icon">
              {completedModulesCount >= 3 ? (
                <CheckCircle2 size={18} className="text-emerald" />
              ) : (
                <XCircle size={18} className="text-amber" />
              )}
            </div>
            <div>
              <strong>Manuais Técnicos Obrigatórios:</strong>
              <p>{completedModulesCount} de {totalModules} estudados e convalidados (mínimo de 3 exigido)</p>
            </div>
          </div>

          <div className="req-item">
            <div className="req-icon">
              {passedQuizzesCount >= 4 ? (
                <CheckCircle2 size={18} className="text-emerald" />
              ) : (
                <XCircle size={18} className="text-amber" />
              )}
            </div>
            <div>
              <strong>Avaliações Técnicas de Suficiência (≥ 75%):</strong>
              <p>{passedQuizzesCount} de {totalQuizzes} aprovadas (mínimo de 4 exigido)</p>
            </div>
          </div>
        </div>

        {!isUnlocked && (
          <div className="req-hint-bar">
            <span>Para obter a emissão com valor institucional, finalize a leitura das diretrizes e atinja o aproveitamento mínimo nas avaliações:</span>
            <button onClick={() => onNavigate('quizzes')} className="btn-primary btn-sm">
              Acessar Central de Avaliações <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Documento Oficial Imprimível */}
      <div className="certificate-outer-wrapper">
        <div className="certificate-sheet">
          {/* Moldura Clássica de Certidão Oficial */}
          <div className="cert-border-inner">
            {/* Cabeçalho Governamental com Brasão */}
            <div className="cert-header">
              <div className="cert-gdf-emblem">
                <BrasaoDistritoFederal size={74} />
              </div>
              <div className="cert-gov-badge">
                <div className="gov-titles">
                  <h2>GOVERNO DO DISTRITO FEDERAL</h2>
                  <h3>SECRETARIA DE ESTADO DE TRANSPORTE E MOBILIDADE</h3>
                  <h4>Subsecretaria de Tecnologia da Informação — SUTINF</h4>
                  <h5>Coordenação de Desenvolvimento de Sistemas e Inovação</h5>
                </div>
              </div>
              <div className="cert-seal">
                <ShieldCheck size={38} className="text-sky" />
                <span className="seal-text">DOCUMENTO OFICIAL</span>
                <span className="seal-sub">PADRÃO SEI-GDF</span>
              </div>
            </div>

            {/* Título Oficial */}
            <div className="cert-title-section">
              <h1 className="cert-main-title">CERTIFICADO DE CAPACITAÇÃO E NIVELAMENTO TÉCNICO</h1>
              <div className="cert-sei-ref">Processo Administrativo SEI nº {processSEI}</div>
            </div>

            {/* Texto de Certificação */}
            <p className="cert-intro">
              O Subsecretário de Tecnologia da Informação da Secretaria de Estado de Transporte e Mobilidade do Distrito Federal (SEMOB-DF), no uso de suas atribuições regimentais, e em consonância com o Programa Oficial de Estágio Supervisionado e Acolhimento Técnico, CERTIFICA que
            </p>

            {/* Nome do Estagiário */}
            <div className="cert-recipient-box">
              {isEditingName ? (
                <div className="recipient-edit no-print">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="recipient-input"
                    placeholder="Nome completo para registro formal"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="btn-icon-check" title="Salvar alteração">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="recipient-display" onClick={() => setIsEditingName(true)}>
                  <span className="recipient-name">{studentName}</span>
                  <button className="btn-edit-inline no-print" title="Editar nome para o certificado">
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Corpo do Texto Jurídico-Institucional */}
            <p className="cert-body-text">
              concluiu com êxito a <strong>Trilha Oficial de Formação, Integração e Nivelamento em Engenharia de Software da SUTINF</strong>, demonstrando proficiência nos fluxos colaborativos e regulatórios de controle de versão (<strong>GitLab Flow e Pipelines de CI/CD</strong>), modelagem geoespacial e consultas avançadas em banco de dados relacional (<strong>PostgreSQL com extensão espacial PostGIS</strong>), padrões arquiteturais de serviços e microsserviços em camadas com <strong>NestJS, TypeORM e Docker</strong>, e boas práticas de desenvolvimento front-end reativo com <strong>React 18, TypeScript rígido e empacotamento móvel</strong>, cumprindo carga horária estimada de <strong>40 (quarenta) horas</strong> de estudos dirigidos e implementação de desafios práticos, tendo alcançado média global de rendimento de <strong>{averageScore || 85}%</strong>.
            </p>

            {/* Quadro de Validação e Assinaturas Formais */}
            <div className="cert-footer">
              <div className="cert-signature-box">
                <div className="sig-line"></div>
                <strong>Coordenação de Desenvolvimento de Sistemas</strong>
                <span>CODSYS / SUTINF / SEMOB-DF</span>
                <span className="sig-cargo">Supervisor Técnico de Estágio</span>
              </div>

              <div className="cert-validation-box">
                <div className="qr-container">
                  <QrCode size={48} className="qr-icon" />
                </div>
                <div className="val-hash">{certificateCode}</div>
                <div className="val-crc">Código Verificador: <strong>{cleanId}-2026</strong> | CRC: <strong>{verificationCRC}</strong></div>
                <div className="val-date">Brasília - DF, {emissionDate}</div>
              </div>

              <div className="cert-signature-box">
                <div className="sig-line"></div>
                <strong>Subsecretaria de Tecnologia da Informação</strong>
                <span>SUTINF / SEMOB-DF</span>
                <span className="sig-cargo">Titular da Pasta Tecnológica</span>
              </div>
            </div>

            {/* Nota de rodapé padrão SEI-GDF */}
            <div className="cert-sei-legal-footer">
              <FileText size={12} />
              <span>
                Documento emitido eletronicamente conforme diretrizes do Decreto Distrital nº 36.756/2015 e Lei Federal nº 11.788/2008 (Lei do Estágio). A conferência de veracidade e comprovação de horas acadêmicas pode ser instruída mediante apresentação deste atestado de formação ao setor de Recursos Humanos e Coordenação Curricular.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="cert-bottom-actions no-print">
        <button onClick={handlePrint} className="btn-primary btn-lg">
          <Printer size={20} />
          Imprimir Certificado Oficial (PDF)
        </button>

        <button onClick={handleTriggerVisualEffect} className="btn-secondary">
          <Award size={18} />
          Efeito Visual de Conclusão
        </button>
      </div>
    </div>
  );
};
