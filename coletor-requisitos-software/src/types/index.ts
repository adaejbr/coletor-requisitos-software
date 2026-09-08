export const CLIENTE_STATUS = ['em negociacao', 'em andamento', 'projeto entregue', 'cancelado'] as const

export type ClienteStatus = (typeof CLIENTE_STATUS)[number]

export interface Usuario {
  id: string
  nome: string
  acoes: string[]
}

export interface RelacionamentoEntidade {
  entidadeOrigemId: string
  entidadeDestinoId: string
}

export interface Entidade {
  id: string
  nome: string
  campos: string[]
  relacionamentos: RelacionamentoEntidade[]
}

export interface Funcionalidade {
  id: string
  nome: string
  descricao: string
  pontosImportantes: string
  usuarios: Usuario[]
  entidades: Entidade[]
}

export interface Aplicacao {
  id: string
  nome: string
  funcionalidades: Funcionalidade[]
}

export interface Cliente {
  id: string
  nome: string
  dataUltimaAlteracao: Date
  status: ClienteStatus
  aplicacoes: Aplicacao[]
}
