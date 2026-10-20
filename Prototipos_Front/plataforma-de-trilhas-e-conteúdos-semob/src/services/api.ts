import {
  Trilha,
  Etapa,
  ConteudoBiblioteca,
  Certificado,
  AlunoSupervisorView,
  ItemFilaEntrega,
  ItemFilaCertificado,
  EntregaStatus,
  BrandConfig
} from '../types';
import {
  TRILHA_DESENVOLVEDOR_SEMOB,
  TRILHA_SECRETARIA_FUTURO,
  BIBLIOTECA_CONTEUDOS,
  CERTIFICADO_EXEMPLO,
  ALUNOS_SUPERVISOR_MOCK,
  FILA_ENTREGAS_MOCK,
  FILA_CERTIFICADOS_MOCK,
  BRANDS
} from './mockData';

// In-memory / localStorage state persistence for realistic actions during demo
const STORAGE_PREFIX = 'semob_lms_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export const api = {
  trilhas: {
    async listar(): Promise<Trilha[]> {
      const trilha = getStored<Trilha>('trilha_dev', TRILHA_DESENVOLVEDOR_SEMOB);
      return [trilha, TRILHA_SECRETARIA_FUTURO];
    },

    async obterPorId(id: string): Promise<Trilha | null> {
      if (id === TRILHA_DESENVOLVEDOR_SEMOB.id) {
        return getStored<Trilha>('trilha_dev', TRILHA_DESENVOLVEDOR_SEMOB);
      }
      if (id === TRILHA_SECRETARIA_FUTURO.id) {
        return TRILHA_SECRETARIA_FUTURO;
      }
      return null;
    }
  },

  etapas: {
    async obterPorId(trilhaId: string, etapaId: string): Promise<Etapa | null> {
      const trilha = await api.trilhas.obterPorId(trilhaId);
      if (!trilha) return null;
      return trilha.etapas.find(e => e.id === etapaId) || null;
    },

    async marcarComoLida(trilhaId: string, etapaId: string): Promise<Etapa> {
      const trilha = getStored<Trilha>('trilha_dev', TRILHA_DESENVOLVEDOR_SEMOB);
      const etapaIndex = trilha.etapas.findIndex(e => e.id === etapaId);
      if (etapaIndex !== -1) {
        trilha.etapas[etapaIndex].status = 'concluida';
        // Unlock next stage if exists
        if (etapaIndex + 1 < trilha.etapas.length && trilha.etapas[etapaIndex + 1].status === 'bloqueada') {
          trilha.etapas[etapaIndex + 1].status = 'disponivel';
        }
        setStored('trilha_dev', trilha);
        return trilha.etapas[etapaIndex];
      }
      throw new Error('Etapa não encontrada');
    }
  },

  quiz: {
    async submeter(trilhaId: string, etapaId: string, respostas: Record<string, string>): Promise<{
      nota: number;
      totalPerguntas: number;
      acertos: number;
      aprovado: boolean;
      gabarito: {
        perguntaId: string;
        alternativaEscolhidaId: string;
        corretaId: string;
        acertou: boolean;
        explicacao: string;
      }[];
    }> {
      const etapa = await api.etapas.obterPorId(trilhaId, etapaId);
      if (!etapa || !etapa.quiz) throw new Error('Quiz não encontrado');

      const quiz = etapa.quiz;
      let acertos = 0;
      const gabarito = quiz.perguntas.map(p => {
        const escolhida = respostas[p.id];
        const acertou = escolhida === p.alternativaCorretaId;
        if (acertou) acertos++;
        const altObj = p.alternativas.find(a => a.id === escolhida);
        return {
          perguntaId: p.id,
          alternativaEscolhidaId: escolhida,
          corretaId: p.alternativaCorretaId,
          acertou,
          explicacao: altObj ? altObj.explicacao : 'Alternativa não selecionada.'
        };
      });

      const nota = Math.round((acertos / quiz.perguntas.length) * 100);
      const aprovado = nota >= quiz.notaMinima;

      if (aprovado) {
        await api.etapas.marcarComoLida(trilhaId, etapaId);
      }

      return {
        nota,
        totalPerguntas: quiz.perguntas.length,
        acertos,
        aprovado,
        gabarito
      };
    }
  },

  desafioSQL: {
    async executar(desafioId: string, sql: string): Promise<{
      sucesso: boolean;
      mensagem: string;
      linhasRetornadas: Record<string, any>[];
      colunas: string[];
      tempoExecucaoMs: number;
      criteriosAtendidos: { criterio: string; atendido: boolean }[];
      aprovado: boolean;
    }> {
      const limpo = sql.toLowerCase().replace(/\s+/g, ' ').trim();
      const temJoin = limpo.includes('join viagens_diarias') || limpo.includes('join linhas_onibus');
      const temWhereNorte = limpo.includes('corredor norte') || limpo.includes("'corredor norte'");
      const temWhereMinutos = limpo.includes('minutos_atraso >= 12') || limpo.includes('minutos_atraso > 11') || limpo.includes('12');
      const temGroup = limpo.includes('group by');
      const temOrder = limpo.includes('order by') && limpo.includes('desc');

      const criteriosAtendidos = [
        { criterio: 'Faz a junção (JOIN) correta entre linhas_onibus e viagens_diarias', atendido: temJoin },
        { criterio: 'Filtra viagens do "Corredor Norte"', atendido: temWhereNorte },
        { criterio: 'Filtra apenas minutos_atraso >= 12 e status = \'atrasada\'', atendido: temWhereMinutos },
        { criterio: 'Agrupa por codigo_linha e nome_linha', atendido: temGroup },
        { criterio: 'Ordena por maior_atraso em ordem decrescente (DESC)', atendido: temOrder }
      ];

      const todasValidadas = criteriosAtendidos.every(c => c.atendido);

      // Return realistic result set matching query state
      let linhasRetornadas: Record<string, any>[] = [];
      if (todasValidadas) {
        linhasRetornadas = [
          { codigo_linha: '108', nome_linha: 'Terminal Norte / Hospital Geral', viagens_atrasadas: 1, maior_atraso: 22 },
          { codigo_linha: '104', nome_linha: 'Terminal Norte / Praça Cívica', viagens_atrasadas: 2, maior_atraso: 18 },
          { codigo_linha: '305', nome_linha: 'Circular Universitário Expresso', viagens_atrasadas: 1, maior_atraso: 16 }
        ];
      } else if (temJoin && temGroup) {
        linhasRetornadas = [
          { codigo_linha: '104', nome_linha: 'Terminal Norte / Praça Cívica', viagens_atrasadas: 2, maior_atraso: 18 },
          { codigo_linha: '108', nome_linha: 'Terminal Norte / Hospital Geral', viagens_atrasadas: 2, maior_atraso: 22 },
          { codigo_linha: '201', nome_linha: 'Terminal Sul / Centro Histórico', viagens_atrasadas: 1, maior_atraso: 15 },
          { codigo_linha: '305', nome_linha: 'Circular Universitário Expresso', viagens_atrasadas: 1, maior_atraso: 16 }
        ];
      } else {
        linhasRetornadas = [
          { codigo_linha: '104', nome_linha: 'Terminal Norte / Praça Cívica', total: 2 },
          { codigo_linha: '108', nome_linha: 'Terminal Norte / Hospital Geral', total: 2 }
        ];
      }

      const colunas = linhasRetornadas.length > 0 ? Object.keys(linhasRetornadas[0]) : ['codigo_linha', 'nome_linha'];

      return {
        sucesso: true,
        mensagem: todasValidadas
          ? 'Consulta executada com êxito! Todos os critérios operacionais da SEMOB foram atendidos.'
          : 'Consulta executada, porém faltam condições para atingir o resultado esperado pelo CCO.',
        linhasRetornadas,
        colunas,
        tempoExecucaoMs: 14,
        criteriosAtendidos,
        aprovado: todasValidadas
      };
    }
  },

  entregas: {
    async submeter(trilhaId: string, etapaId: string, urlRepositorio: string, comentario: string): Promise<void> {
      const trilha = getStored<Trilha>('trilha_dev', TRILHA_DESENVOLVEDOR_SEMOB);
      const etapa = trilha.etapas.find(e => e.id === etapaId);
      if (etapa && etapa.entregaCodigo) {
        etapa.entregaCodigo.urlRepositorioEnviada = urlRepositorio;
        etapa.entregaCodigo.status = 'enviada';
        etapa.entregaCodigo.dataEnvio = new Date().toLocaleString('pt-BR');
        etapa.entregaCodigo.historicoComentarios.push({
          id: 'com-' + Date.now(),
          autorNome: 'Lucas Mendes',
          autorCargo: 'Estagiário de Desenvolvimento',
          dataHora: new Date().toLocaleString('pt-BR'),
          statusDecisao: 'enviada',
          comentario: comentario || 'Submissão de repositório para avaliação técnica do supervisor.'
        });
        setStored('trilha_dev', trilha);
      }
    }
  },

  biblioteca: {
    async listar(busca = '', categoria = 'todos', escopo = 'todos'): Promise<ConteudoBiblioteca[]> {
      let lista = BIBLIOTECA_CONTEUDOS;
      if (categoria !== 'todos') {
        lista = lista.filter(item => item.categoria === categoria);
      }
      if (escopo !== 'todos') {
        lista = lista.filter(item => item.escopo === escopo);
      }
      if (busca.trim()) {
        const q = busca.toLowerCase();
        lista = lista.filter(item =>
          item.titulo.toLowerCase().includes(q) ||
          item.resumo.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return lista;
    },

    async obterPorId(id: string): Promise<ConteudoBiblioteca | null> {
      return BIBLIOTECA_CONTEUDOS.find(item => item.id === id) || null;
    }
  },

  certificados: {
    async listar(): Promise<Certificado[]> {
      const lista = getStored<Certificado[]>('certificados', [CERTIFICADO_EXEMPLO]);
      return lista;
    },

    async obterPorCodigo(codigo: string): Promise<Certificado | null> {
      const normalizado = codigo.trim().toUpperCase();
      const lista = await api.certificados.listar();
      const encontrado = lista.find(c => c.codigoValidacao.toUpperCase() === normalizado);
      if (encontrado) return encontrado;
      if (normalizado === CERTIFICADO_EXEMPLO.codigoValidacao.toUpperCase()) {
        return CERTIFICADO_EXEMPLO;
      }
      return null;
    }
  },

  supervisor: {
    async listarAlunos(): Promise<AlunoSupervisorView[]> {
      return getStored<AlunoSupervisorView[]>('alunos_supervisor', ALUNOS_SUPERVISOR_MOCK);
    },

    async obterFilaEntregas(): Promise<ItemFilaEntrega[]> {
      return getStored<ItemFilaEntrega[]>('fila_entregas', FILA_ENTREGAS_MOCK);
    },

    async obterFilaCertificados(): Promise<ItemFilaCertificado[]> {
      return getStored<ItemFilaCertificado[]>('fila_certificados', FILA_CERTIFICADOS_MOCK);
    },

    async revisarEntrega(itemId: string, decisao: EntregaStatus, comentario: string): Promise<void> {
      let fila = await api.supervisor.obterFilaEntregas();
      fila = fila.filter(item => item.id !== itemId);
      setStored('fila_entregas', fila);

      // update student track state
      const trilha = getStored<Trilha>('trilha_dev', TRILHA_DESENVOLVEDOR_SEMOB);
      const etapa = trilha.etapas.find(e => e.id === 'etapa-07');
      if (etapa && etapa.entregaCodigo) {
        etapa.entregaCodigo.status = decisao;
        etapa.entregaCodigo.historicoComentarios.push({
          id: 'com-rev-' + Date.now(),
          autorNome: 'Carlos Silveira',
          autorCargo: 'Supervisor Técnico SEMOB',
          dataHora: new Date().toLocaleString('pt-BR'),
          statusDecisao: decisao,
          comentario
        });
        if (decisao === 'aprovada' || decisao === 'aprovada_com_ajustes') {
          etapa.status = 'concluida';
        } else if (decisao === 'precisa_de_correcao') {
          etapa.status = 'em_andamento';
        }
        setStored('trilha_dev', trilha);
      }
    },

    async homologarCertificado(itemId: string): Promise<Certificado> {
      let fila = await api.supervisor.obterFilaCertificados();
      const item = fila.find(f => f.id === itemId);
      fila = fila.filter(f => f.id !== itemId);
      setStored('fila_certificados', fila);

      const novoCert: Certificado = {
        ...CERTIFICADO_EXEMPLO,
        id: 'cert-' + Date.now(),
        codigoValidacao: `SEMOB-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-9941`,
        alunoNome: item ? item.alunoNome : 'Aluno Concluinte',
        alunoId: item ? item.alunoId : 'aluno-x',
        status: 'emitido',
        dataEmissao: new Date().toLocaleDateString('pt-BR')
      };

      const certs = await api.certificados.listar();
      certs.push(novoCert);
      setStored('certificados', certs);

      return novoCert;
    },

    async anularCertificado(codigo: string, motivo: string): Promise<void> {
      const lista = await api.certificados.listar();
      const cert = lista.find(c => c.codigoValidacao === codigo);
      if (cert) {
        cert.status = 'anulado';
        cert.motivoAnulacao = motivo;
        cert.dataAnulacao = new Date().toLocaleDateString('pt-BR');
        setStored('certificados', lista);
      }
    }
  },

  admin: {
    async listarConteudos(): Promise<{ id: string; titulo: string; tipo: string; versao: string; dataRevisao: string; escopo: string; status: 'rascunho' | 'em_revisao' | 'publicado' }[]> {
      return [
        { id: 'etapa-01', titulo: 'Cultura, Diretrizes e Arquitetura dos Sistemas SEMOB', tipo: 'Manual', versao: 'v2.1', dataRevisao: '12/10/2026', escopo: 'Institucional', status: 'publicado' },
        { id: 'etapa-02', titulo: 'Git e Fluxo de Ramificação no GitLab Institucional', tipo: 'Manual', versao: 'v3.0', dataRevisao: '14/10/2026', escopo: 'Institucional', status: 'publicado' },
        { id: 'etapa-04', titulo: 'Desafio Prático SQL: Atrasos Críticos no Corredor Norte', tipo: 'Desafio SQL', versao: 'v2.0', dataRevisao: '16/10/2026', escopo: 'Institucional', status: 'publicado' },
        { id: 'etapa-05', titulo: 'Quiz de Avaliação: Banco de Dados e Modelagem SEMOB', tipo: 'Quiz', versao: 'v1.2', dataRevisao: '17/10/2026', escopo: 'Institucional', status: 'publicado' },
        { id: 'etapa-07', titulo: 'Entrega de Código GitLab: Microsserviço de Consulta', tipo: 'Entrega', versao: 'v2.0', dataRevisao: '18/10/2026', escopo: 'Institucional', status: 'publicado' },
        { id: 'etapa-sec-01', titulo: 'Autuação de Processos e Tramitação no SEI', tipo: 'Manual', versao: 'v0.9', dataRevisao: '19/10/2026', escopo: 'Institucional', status: 'em_revisao' },
        { id: 'bib-04', titulo: 'A Evolução dos Sistemas de Ônibus: Da Ficha de Papel ao GPS', tipo: 'Curiosidade', versao: 'v1.0', dataRevisao: '01/09/2026', escopo: 'Geral', status: 'publicado' }
      ];
    },

    async obterConfiguracoes(): Promise<Record<string, BrandConfig>> {
      return BRANDS;
    }
  }
};
