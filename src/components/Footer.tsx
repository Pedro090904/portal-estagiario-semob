import React from 'react';
import { ScreenType } from '../types';
import { ShieldCheck, GitBranch, Terminal, Heart, Code2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-dot-pulse"></span>
            <strong>SEMOB-DF</strong> • SUTINF
          </div>
          <p className="footer-desc">
            Portal Oficial de Formação e Padronização Técnica da Subsecretaria de Tecnologia da Informação da Secretaria de Transporte e Mobilidade do Distrito Federal.
          </p>
          <div className="footer-badge">
            <ShieldCheck size={16} />
            <span>Padrão DevSecOps & Governo Digital</span>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Trilha de Aprendizado</div>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('roteiro')}>Roteiro de Integração (PDF)</button></li>
            <li><button onClick={() => onNavigate('modulo-git')}>Git & GitLab Flow</button></li>
            <li><button onClick={() => onNavigate('modulo-sql')}>Bancos de Dados & SQL</button></li>
            <li><button onClick={() => onNavigate('modulo-backend')}>Back-end NestJS (SISMOB)</button></li>
            <li><button onClick={() => onNavigate('modulo-frontend')}>Front-end React & Vite</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Avaliação & Prática</div>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('quizzes')}>Central de Quizzes Segmentados</button></li>
            <li><button onClick={() => onNavigate('desafio-sql')}>Desafio Prático SQL (25 Questões)</button></li>
            <li><button onClick={() => onNavigate('modulo-gabarito')}>Gabarito Oficial Comentado</button></li>
            <li><button onClick={() => onNavigate('desafio-backend')}>Desafio Back-end (Veículos)</button></li>
            <li><button onClick={() => onNavigate('desafio-frontend')}>Desafio InfoÔnibus</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Ecossistema SUTINF</div>
          <div className="stack-tags">
            <span className="tag">NestJS</span>
            <span className="tag">React 18</span>
            <span className="tag">TypeScript</span>
            <span className="tag">PostgreSQL 15</span>
            <span className="tag">PostGIS</span>
            <span className="tag">Docker</span>
            <span className="tag">GitLab CI/CD</span>
            <span className="tag">Capacitor</span>
            <span className="tag">Qlik BI</span>
          </div>
          <p className="footer-micro">
            "A branch principal é sagrada. Nunca comitamos direto na main."
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {new Date().getFullYear()} SEMOB-DF • Subsecretaria de Tecnologia da Informação. Todos os direitos reservados.</p>
          <p className="footer-credit">
            Desenvolvido com <Code2 size={14} className="inline-icon" /> para a formação de novos talentos da mobilidade.
          </p>
        </div>
      </div>
    </footer>
  );
};
