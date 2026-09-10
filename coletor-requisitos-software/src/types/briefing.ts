export type TipoPerguntaBriefing =
  | 'texto'
  | 'textarea'
  | 'numero'
  | 'data'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'booleano'

export type StatusRespostaBriefing = 'rascunho' | 'concluido'

export interface OpcaoPerguntaBriefing {
  id: string
  label: string
  valor: string
}

export interface PerguntaBriefing {
  id: string
  enunciado: string
  descricaoAjuda?: string
  tipo: TipoPerguntaBriefing
  obrigatoria: boolean
  opcoes?: OpcaoPerguntaBriefing[]
  ordem: number
  ativo: boolean
  placeholder?: string
}

export interface SecaoBriefing {
  id: string
  titulo: string
  descricao?: string
  ordem: number
  ativo: boolean
  perguntas: PerguntaBriefing[]
}

export interface FormularioBriefing {
  id: string
  nome: string
  descricao?: string
  ativo: boolean
  versao: number
  secoes: SecaoBriefing[]
  criadoEm: string
  atualizadoEm: string
}

export type FormularioConcluido = {
  id: string
  nome: string
  descricao?: string
  concluidoEm: string
}

export interface RespostaBriefing {
  id: string
  idCliente: string
  idAplicacao: string
  idFormulario: string
  versaoFormulario: number
  snapshotFormulario?: FormularioBriefing
  respostas: Record<string, unknown>
  status: StatusRespostaBriefing
  criadoEm: string
  atualizadoEm: string
  concluidoEm?: string
}
