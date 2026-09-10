import { z } from 'zod'
import {
  CLIENTE_STATUS,
  type Aplicacao,
  type Cliente,
  type ClienteStatus,
  type Entidade,
  type FormularioBriefing,
  type Funcionalidade,
  type PerguntaBriefing,
  type RelacionamentoEntidade,
  type RespostaBriefing,
  type SecaoBriefing,
  type Usuario,
} from '../types'

export const clienteStatusSchema = z.enum(CLIENTE_STATUS)

export const tipoPerguntaBriefingSchema = z.enum([
  'texto',
  'textarea',
  'numero',
  'data',
  'select',
  'radio',
  'checkbox',
  'booleano',
])

export const opcaoPerguntaBriefingSchema = z.object({
  id: z.string().trim().min(1, 'O identificador da opção é obrigatório.'),
  label: z.string().trim().min(1, 'A label da opção é obrigatória.'),
  valor: z.string().trim().min(1, 'O valor da opção é obrigatório.'),
})

export const perguntaBriefingSchema = z.object({
  id: z.string().trim().min(1, 'O identificador da pergunta é obrigatório.'),
  enunciado: z.string().trim().min(1, 'O enunciado da pergunta é obrigatório.'),
  descricaoAjuda: z.string().trim().optional(),
  tipo: tipoPerguntaBriefingSchema,
  obrigatoria: z.boolean(),
  opcoes: z.array(opcaoPerguntaBriefingSchema).optional(),
  ordem: z.number().int().nonnegative(),
  ativo: z.boolean(),
  placeholder: z.string().trim().optional(),
})

export const secaoBriefingSchema = z.object({
  id: z.string().trim().min(1, 'O identificador da seção é obrigatório.'),
  titulo: z.string().trim().min(1, 'O título da seção é obrigatório.'),
  descricao: z.string().trim().optional(),
  ordem: z.number().int().nonnegative(),
  ativo: z.boolean(),
  perguntas: z.array(perguntaBriefingSchema).default([]),
})

export const formularioBriefingSchema = z.object({
  id: z.string().trim().min(1, 'O identificador do formulário é obrigatório.'),
  nome: z.string().trim().min(1, 'O nome do formulário é obrigatório.'),
  descricao: z.string().trim().optional(),
  ativo: z.boolean(),
  versao: z.number().int().nonnegative(),
  secoes: z.array(secaoBriefingSchema).default([]),
  criadoEm: z.string().trim().min(1, 'A data de criação é obrigatória.'),
  atualizadoEm: z.string().trim().min(1, 'A data de atualização é obrigatória.'),
})

export const respostaBriefingSchema = z.object({
  id: z.string().trim().min(1, 'O identificador da resposta é obrigatório.'),
  idCliente: z.string().trim().min(1, 'O cliente da resposta é obrigatório.'),
  idAplicacao: z.string().trim().min(1, 'A aplicação da resposta é obrigatória.'),
  idFormulario: z.string().trim().min(1, 'O formulário da resposta é obrigatório.'),
  versaoFormulario: z.number().int().nonnegative(),
  snapshotFormulario: formularioBriefingSchema.optional(),
  respostas: z.record(z.string(), z.unknown()).default({}),
  status: z.enum(['rascunho', 'concluido']),
  criadoEm: z.string().trim().min(1, 'A data de criação da resposta é obrigatória.'),
  atualizadoEm: z.string().trim().min(1, 'A data de atualização da resposta é obrigatória.'),
  concluidoEm: z.string().trim().optional(),
})

export const usuarioSchema = z.object({
  id: z.string().trim().min(1, 'O identificador do usuário é obrigatório.'),
  nome: z.string().trim().min(1, 'O nome do usuário é obrigatório.'),
  acoes: z.array(z.string().trim().min(1, 'A ação não pode ficar vazia.')).min(1, 'Informe pelo menos uma ação.'),
})

export const relacionamentoEntidadeSchema = z.object({
  entidadeOrigemId: z.string().trim().min(1, 'A entidade de origem é obrigatória.'),
  entidadeOrigem: z.string().trim().optional(),
  entidadeDestinoId: z.string().trim().min(1, 'A entidade de destino é obrigatória.'),
  entidadeDestino: z.string().trim().optional(),
})

export const entidadeSchema = z.object({
  id: z.string().trim().min(1, 'O identificador da entidade é obrigatório.'),
  nome: z.string().trim().min(1, 'O nome da entidade é obrigatório.'),
  campos: z.array(z.string().trim().min(1, 'Cada campo não pode ficar vazio.')).min(1, 'Informe pelo menos um campo.'),
  relacionamentos: z.array(relacionamentoEntidadeSchema).default([]),
})

export const funcionalidadeSchema = z.object({
  id: z.string().trim().min(1, 'O identificador da funcionalidade é obrigatório.'),
  nome: z.string().trim().min(1, 'O nome da funcionalidade é obrigatório.'),
  descricao: z.string().trim().min(1, 'A descrição da funcionalidade é obrigatória.'),
  pontosImportantes: z.string().trim().min(1, 'Informe os pontos importantes.'),
  usuarios: z.array(usuarioSchema).min(1, 'Informe pelo menos um usuário.'),
  entidades: z.array(entidadeSchema).min(1, 'Informe pelo menos uma entidade.'),
})

export const aplicacaoSchema = z.object({
  id: z.string().trim().min(1, 'O identificador da aplicação é obrigatório.'),
  nome: z.string().trim().min(1, 'O nome da aplicação é obrigatório.'),
  funcionalidades: z.array(funcionalidadeSchema).default([]),
})

export const clienteSchema = z.object({
  id: z.string().trim().min(1, 'O identificador do cliente é obrigatório.'),
  nome: z.string().trim().min(1, 'O nome do cliente é obrigatório.'),
  dataUltimaAlteracao: z.coerce
    .date()
    .refine((date) => !Number.isNaN(date.getTime()), {
      message: 'A data da última alteração é inválida.',
    }),
  status: clienteStatusSchema,
  aplicacoes: z.array(aplicacaoSchema).default([]),
})

export function isValidClienteStatus(status: string): status is ClienteStatus {
  return clienteStatusSchema.safeParse(status).success
}

export function validarCliente(cliente: unknown): Cliente {
  return clienteSchema.parse(cliente) as Cliente
}

export function validarAplicacao(aplicacao: unknown): Aplicacao {
  return aplicacaoSchema.parse(aplicacao) as Aplicacao
}

export function validarFuncionalidade(funcionalidade: unknown): Funcionalidade {
  return funcionalidadeSchema.parse(funcionalidade) as Funcionalidade
}

export function validarUsuario(usuario: unknown): Usuario {
  return usuarioSchema.parse(usuario) as Usuario
}

export function validarEntidade(entidade: unknown): Entidade {
  return entidadeSchema.parse(entidade) as Entidade
}

export function validarRelacionamento(relacionamento: unknown): RelacionamentoEntidade {
  return relacionamentoEntidadeSchema.parse(relacionamento) as RelacionamentoEntidade
}

export function validarStatusCliente(status: unknown): ClienteStatus {
  return clienteStatusSchema.parse(status) as ClienteStatus
}

export function validarPerguntaBriefing(pergunta: unknown): PerguntaBriefing {
  return perguntaBriefingSchema.parse(pergunta) as PerguntaBriefing
}

export function validarSecaoBriefing(secao: unknown): SecaoBriefing {
  return secaoBriefingSchema.parse(secao) as SecaoBriefing
}

export function validarFormularioBriefing(formulario: unknown): FormularioBriefing {
  return formularioBriefingSchema.parse(formulario) as FormularioBriefing
}

export function validarRespostaBriefing(resposta: unknown): RespostaBriefing {
  return respostaBriefingSchema.parse(resposta) as RespostaBriefing
}

export function validarRespostasObrigatoriasBriefing(
  formulario: FormularioBriefing,
  respostas: Record<string, unknown>,
): string[] {
  const erros: string[] = []

  formulario.secoes
    .filter((secao) => secao.ativo)
    .forEach((secao) => {
      secao.perguntas
        .filter((pergunta) => pergunta.ativo && pergunta.obrigatoria)
        .forEach((pergunta) => {
          const valor = respostas[pergunta.id]
          const valorVazio =
            typeof valor === 'undefined' ||
            valor === null ||
            valor === '' ||
            (Array.isArray(valor) && valor.length === 0) ||
            (typeof valor === 'boolean' && !valor)

          if (valorVazio) {
            erros.push(`A pergunta "${pergunta.enunciado}" é obrigatória.`)
          }
        })
    })

  return erros
}

export function validarConfiguracaoFormularioBriefing(formulario: FormularioBriefing): string[] {
  const erros: string[] = []

  if (!formulario.nome.trim()) {
    erros.push('O nome do formulário é obrigatório.')
  }

  if (!formulario.ativo) {
    return erros
  }

  const secoesAtivas = formulario.secoes.filter((secao) => secao.ativo)

  if (secoesAtivas.length === 0) {
    erros.push('Para ativar o formulário, é necessário ter pelo menos uma seção ativa.')
  }

  secoesAtivas.forEach((secao, index) => {
    if (!secao.titulo.trim()) {
      erros.push(`A seção ${index + 1} ativa precisa de um título.`)
    }

    const perguntasAtivas = secao.perguntas.filter((pergunta) => pergunta.ativo)

    if (perguntasAtivas.length === 0) {
      erros.push(`A seção "${secao.titulo || `#${index + 1}`}" precisa ter pelo menos uma pergunta ativa.`)
    }

    perguntasAtivas.forEach((pergunta, perguntaIndex) => {
      if (!pergunta.enunciado.trim()) {
        erros.push(`A pergunta ${perguntaIndex + 1} da seção "${secao.titulo || `#${index + 1}`}" precisa de enunciado.`)
      }

      if (!pergunta.tipo) {
        erros.push(`A pergunta ${perguntaIndex + 1} da seção "${secao.titulo || `#${index + 1}`}" precisa ter um tipo.`)
      }

      if (['select', 'radio', 'checkbox'].includes(pergunta.tipo) && (!pergunta.opcoes || pergunta.opcoes.length === 0)) {
        erros.push(`A pergunta "${pergunta.enunciado || `#${perguntaIndex + 1}`}" do tipo ${pergunta.tipo} precisa de opções.`)
      }
    })
  })

  return [...new Set(erros)]
}
