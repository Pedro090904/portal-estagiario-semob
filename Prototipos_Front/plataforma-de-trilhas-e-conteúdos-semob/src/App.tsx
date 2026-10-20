import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { ProtegidoPorPerfil } from './components/ProtegidoPorPerfil';

// Pages
import { DashboardAluno } from './pages/DashboardAluno';
import { TrilhasLista } from './pages/TrilhasLista';
import { TrilhaDetalhe } from './pages/TrilhaDetalhe';
import { EtapaVisualizador } from './pages/EtapaVisualizador';
import { Biblioteca } from './pages/Biblioteca';
import { CertificadosLista } from './pages/CertificadosLista';
import { ValidacaoPublica } from './pages/ValidacaoPublica';
import { SupervisorPainel } from './pages/SupervisorPainel';
import { AdminPainel } from './pages/AdminPainel';
import { PaginaAjudaSuporte } from './pages/PaginaAjudaSuporte';
import { PaginaErro } from './pages/PaginaErro';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            {/* Aluno & General Routes */}
            <Route path="/" element={<DashboardAluno />} />
            <Route path="/trilhas" element={<TrilhasLista />} />
            <Route path="/trilhas/:trilhaId" element={<TrilhaDetalhe />} />
            <Route path="/trilhas/:trilhaId/etapas/:etapaId" element={<EtapaVisualizador />} />

            {/* Biblioteca & Knowledge Base */}
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/biblioteca/:conteudoId" element={<Biblioteca />} />

            {/* Certificados & Public Validation */}
            <Route path="/certificados" element={<CertificadosLista />} />
            <Route path="/validar" element={<ValidacaoPublica />} />

            {/* Supervisor / Orientation Routes (Protected) */}
            <Route
              path="/supervisor"
              element={
                <ProtegidoPorPerfil rolesPermitidos={['supervisor', 'admin']}>
                  <SupervisorPainel />
                </ProtegidoPorPerfil>
              }
            />

            {/* Administrator Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtegidoPorPerfil rolesPermitidos={['admin']}>
                  <AdminPainel />
                </ProtegidoPorPerfil>
              }
            />

            {/* Help & Support */}
            <Route path="/suporte" element={<PaginaAjudaSuporte />} />

            {/* Error 404 */}
            <Route path="/404" element={<PaginaErro codigo={404} />} />
            <Route path="*" element={<PaginaErro codigo={404} />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
