import { z } from 'zod'
import {
  CLIENTE_STATUS,
  type Aplicacao,
  type Cliente,
  type ClienteStatus,
  type Entidade,
  type Funcionalidade,
  type RelacionamentoEntidade,
  type Usuario,
} from '../types'

export const clienteStatusSchema = z.enum(CLIENTE_STATUS)

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
  console.log('Validando relacionamento:', relacionamento);
  return relacionamentoEntidadeSchema.parse(relacionamento) as RelacionamentoEntidade
}

export function validarStatusCliente(status: unknown): ClienteStatus {
  return clienteStatusSchema.parse(status) as ClienteStatus
}
