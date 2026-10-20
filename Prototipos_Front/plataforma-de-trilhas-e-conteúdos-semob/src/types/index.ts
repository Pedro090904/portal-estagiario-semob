export type UserRole = 'aluno' | 'dev' | 'supervisor' | 'admin';

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  area: string;
  avatarUrl?: string;
  role: UserRole;
  rolesDisponiveis: UserRole[];
  diasSeguidos: number;
  pontos: number;
  dataIngresso: string;
}

export type EtapaTipo = 'manual' | 'quiz' | 'desafio_sql' | 'entrega_codigo' | 'projeto';
export type EtapaStatus = 'bloqueada' | 'disponivel' | 'em_andamento' | 'concluida' | 'reprovada';

export type BlocoTipo = 'texto' | 'destaque' | 'tabela' | 'codigo' | 'cenario' | 'cartao_comando' | 'diagrama';

export interface BlocoConteudoItem {
  id: string;
  tipo: BlocoTipo;
  titulo?: string;
  conteudo?: string;
  linguagem?: string;
  codigo?: string;
  comando?: string;
  explicacao?: string;
  dadosTabela?: {
    cabecalhos: string[];
    linhas: string[][];
  };
  tipoDestaque?: 'info' | 'atencao' | 'dica';
  diagramaTipo?: 'fluxo' | 'arquitetura';
}

export interface AlternativaQuiz {
  id: string;
  texto: string;
  explicacao: string;
}

export interface PerguntaQuiz {
  id: string;
  enunciado: string;
  alternativas: AlternativaQuiz[];
  alternativaCorretaId: string;
  conceitoChave: string;
}

export interface QuizData {
  id: string;
  titulo: string;
  instrucoes: string;
  notaMinima: number; // Ex: 70
  perguntas: PerguntaQuiz[];
}

export interface TabelaSchema {
  nome: string;
  descricao: string;
  colunas: {
    nome: string;
    tipo: string;
    descricao: string;
    chavePrimaria?: boolean;
    chaveEstrangeira?: string;
  }[];
  linhasExemplo: Record<string, any>[];
}

export interface DesafioSQLData {
  id: string;
  titulo: string;
  contextoOrganizacional: string;
  enunciado: string;
  tabelas: TabelaSchema[];
  consultaInicial: string;
  consultaEsperada: string;
  criteriosSucesso: string[];
  dicas: string[];
  resultadoEsperado: Record<string, any>[];
}

export type EntregaStatus = 'rascunho' | 'enviada' | 'em_revisao' | 'aprovada' | 'aprovada_com_ajustes' | 'precisa_de_correcao';

export interface ComentarioRevisao {
  id: string;
  autorNome: string;
  autorCargo: string;
  dataHora: string;
  statusDecisao: EntregaStatus;
  comentario: string;
}

export interface EntregaCodigoData {
  id: string;
  titulo: string;
  descricao: string;
  criteriosAceite: string[];
  repositorioExemploUrl?: string;
  urlRepositorioEnviada?: string;
  status: EntregaStatus;
  dataEnvio?: string;
  dataRevisao?: string;
  historicoComentarios: ComentarioRevisao[];
}

export interface Etapa {
  id: string;
  trilhaId: string;
  ordem: number;
  titulo: string;
  descricaoCurta: string;
  tipo: EtapaTipo;
  obrigatoria: boolean;
  tempoEstimadoMinutos: number;
  status: EtapaStatus;
  versao: string;
  dataUltimaRevisao: string;
  blocosManual?: BlocoConteudoItem[];
  quiz?: QuizData;
  desafioSQL?: DesafioSQLData;
  entregaCodigo?: EntregaCodigoData;
}

export interface Trilha {
  id: string;
  titulo: string;
  sigla: string;
  descricao: string;
  publicoAlvo: string;
  cargaHorariaHoras: number;
  area: 'desenvolvimento' | 'secretaria' | 'geral';
  obrigatoria: boolean;
  status: 'em_andamento' | 'concluida' | 'disponivel' | 'fase_futura';
  fase: 'MVP' | 'FASE 2' | 'FUTURO';
  dataInicio?: string;
  dataConclusaoEstimada?: string;
  etapas: Etapa[];
}

export type CertificadoStatus = 'em_andamento' | 'aguardando_aprovacao' | 'emitido' | 'anulado';

export interface Certificado {
  id: string;
  codigoValidacao: string;
  trilhaId: string;
  trilhaTitulo: string;
  alunoId: string;
  alunoNome: string;
  alunoCpfMascarado: string;
  cargaHoraria: number;
  processoSei: string;
  dataEmissao?: string;
  dataConclusaoTrilha?: string;
  status: CertificadoStatus;
  ementa: string[];
  assinaturaSubsecretario: {
    nome: string;
    cargo: string;
    orgao: string;
  };
  assinaturaSupervisor: {
    nome: string;
    cargo: string;
    orgao: string;
  };
  motivoAnulacao?: string;
  dataAnulacao?: string;
}

export type CategoriaBiblioteca = 'manual' | 'pop' | 'modelo' | 'curiosidade';

export interface ConteudoBiblioteca {
  id: string;
  titulo: string;
  resumo: string;
  categoria: CategoriaBiblioteca;
  area: string;
  tags: string[];
  escopo: 'institucional' | 'geral';
  tempoLeituraMinutos: number;
  versao: string;
  dataRevisao: string;
  conteudoBlocos: BlocoConteudoItem[];
}

export interface AlunoSupervisorView {
  id: string;
  nome: string;
  email: string;
  area: string;
  trilhaNome: string;
  etapasConcluidas: number;
  totalEtapas: number;
  ultimoAcesso: string;
  situacao: 'em_dia' | 'atencao' | 'aguardando_revisao' | 'concluido';
  mediaQuiz: number;
  entregasPendentes: number;
}

export interface ItemFilaEntrega {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoEmail: string;
  trilhaId: string;
  trilhaNome: string;
  etapaId: string;
  etapaTitulo: string;
  tipo: 'entrega_codigo' | 'projeto';
  urlRepositorio: string;
  dataSubmissao: string;
  tempoEsperaHoras: number;
  tentativaNumero: number;
  criteriosAceite: string[];
}

export interface ItemFilaCertificado {
  id: string;
  certificadoId: string;
  alunoId: string;
  alunoNome: string;
  alunoEmail: string;
  trilhaId: string;
  trilhaNome: string;
  processoSei: string;
  cargaHoraria: number;
  dataSolicitacao: string;
  etapasConcluidas: number;
  totalEtapas: number;
  todasEtapasAprovadas: boolean;
}

export interface GlossarioItem {
  termo: string;
  significado: string;
  categoria: 'Institucional' | 'Desenvolvimento' | 'Processos';
}

export type BrandTheme = 'semob' | 'azimute' | 'novagov';

export interface BrandConfig {
  id: BrandTheme;
  nomeCompleto: string;
  sigla: string;
  subtitulo: string;
  corPrimariaHex: string;
  corAcentoHex: string;
  suporteEmail: string;
  termoUsoResumo: string;
}
