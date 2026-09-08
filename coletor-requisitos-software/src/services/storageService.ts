import localforage from 'localforage'
import { z } from 'zod'
import type { Aplicacao, Cliente, Funcionalidade } from '../types'
import { validarCliente } from '../utils/validators'

const STORAGE_KEY = 'coletor-requisitos-software-clientes'

localforage.config({
  name: 'coletor-requisitos-software',
  storeName: 'clientes',
})

export const storageService = {
  async listarClientes(): Promise<Cliente[]> {
    try {
      const clientes = (await localforage.getItem<Cliente[]>(STORAGE_KEY)) ?? []
      return clientes.map((cliente) => validarCliente(cliente))
    } catch (error) {
      console.error('Erro ao listar clientes:', error)
      return []
    }
  },

  async buscarCliente(clienteId: string): Promise<Cliente | null> {
    try {
      const clientes = await this.listarClientes()
      return clientes.find((cliente) => cliente.id === clienteId) ?? null
    } catch (error) {
      console.error('Erro ao buscar cliente:', error)
      return null
    }
  },

  async adicionarCliente(cliente: Cliente): Promise<Cliente> {
    try {
      const clienteValidado = validarCliente(cliente)
      const clientes = await this.listarClientes()
      const clienteJaExiste = clientes.some((item) => item.id === clienteValidado.id)

      if (clienteJaExiste) {
        throw new Error('Cliente já cadastrado.')
      }

      const proximoEstado = [...clientes, clienteValidado]
      await localforage.setItem(STORAGE_KEY, proximoEstado)
      return clienteValidado
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error)
      throw error
    }
  },

  async atualizarCliente(clienteId: string, clienteAtualizado: Partial<Cliente>): Promise<Cliente> {
    try {
      const clientes = await this.listarClientes()
      const indice = clientes.findIndex((cliente) => cliente.id === clienteId)

      if (indice === -1) {
        throw new Error('Cliente não encontrado.')
      }

      const clienteAtual = clientes[indice]
      const clienteValidado = validarCliente({
        ...clienteAtual,
        ...clienteAtualizado,
        dataUltimaAlteracao: clienteAtualizado.dataUltimaAlteracao ?? clienteAtual.dataUltimaAlteracao,
      })

      clientes[indice] = clienteValidado
      await localforage.setItem(STORAGE_KEY, clientes)
      return clienteValidado
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      throw error
    }
  },

  async removerCliente(clienteId: string): Promise<void> {
    try {
      const clientes = await this.listarClientes()
      const clientesRestantes = clientes.filter((cliente) => cliente.id !== clienteId)
      await localforage.setItem(STORAGE_KEY, clientesRestantes)
    } catch (error) {
      console.error('Erro ao remover cliente:', error)
      throw error
    }
  },

  async buscarAplicacao(clienteId: string, aplicacaoId: string): Promise<Aplicacao | null> {
    const cliente = await this.buscarCliente(clienteId)
    return cliente?.aplicacoes.find((aplicacao) => aplicacao.id === aplicacaoId) ?? null
  },

  async adicionarAplicacao(clienteId: string, aplicacao: Aplicacao): Promise<Aplicacao> {
    try {
      const cliente = await this.buscarCliente(clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado.')
      }

      const novaAplicacao = z.object({
        id: z.string().min(1),
        nome: z.string().min(1),
        funcionalidades: z.array(z.any()).default([]),
      }).parse(aplicacao)

      const clienteAtualizado = {
        ...cliente,
        aplicacoes: [...cliente.aplicacoes, novaAplicacao],
        dataUltimaAlteracao: new Date(),
      }

      await this.atualizarCliente(clienteId, clienteAtualizado)
      return novaAplicacao
    } catch (error) {
      console.error('Erro ao adicionar aplicação:', error)
      throw error
    }
  },

  async atualizarAplicacao(clienteId: string, aplicacaoId: string, aplicacaoAtualizada: Partial<Aplicacao>): Promise<Aplicacao> {
    try {
      const cliente = await this.buscarCliente(clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado.')
      }

      const indice = cliente.aplicacoes.findIndex((aplicacao) => aplicacao.id === aplicacaoId)
      if (indice === -1) {
        throw new Error('Aplicação não encontrada.')
      }

      const aplicacaoExistente = cliente.aplicacoes[indice]
      const aplicacaoValidada = {
        ...aplicacaoExistente,
        ...aplicacaoAtualizada,
      }

      const clienteAtualizado = {
        ...cliente,
        aplicacoes: cliente.aplicacoes.map((aplicacao) =>
          aplicacao.id === aplicacaoId ? aplicacaoValidada : aplicacao,
        ),
        dataUltimaAlteracao: new Date(),
      }

      await this.atualizarCliente(clienteId, clienteAtualizado)
      return aplicacaoValidada
    } catch (error) {
      console.error('Erro ao atualizar aplicação:', error)
      throw error
    }
  },

  async removerAplicacao(clienteId: string, aplicacaoId: string): Promise<void> {
    try {
      const cliente = await this.buscarCliente(clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado.')
      }

      const clienteAtualizado = {
        ...cliente,
        aplicacoes: cliente.aplicacoes.filter((aplicacao) => aplicacao.id !== aplicacaoId),
        dataUltimaAlteracao: new Date(),
      }

      await this.atualizarCliente(clienteId, clienteAtualizado)
    } catch (error) {
      console.error('Erro ao remover aplicação:', error)
      throw error
    }
  },

  async buscarFuncionalidade(clienteId: string, aplicacaoId: string, funcionalidadeId: string): Promise<Funcionalidade | null> {
    const aplicacao = await this.buscarAplicacao(clienteId, aplicacaoId)
    return aplicacao?.funcionalidades.find((funcionalidade) => funcionalidade.id === funcionalidadeId) ?? null
  },

  async adicionarFuncionalidade(clienteId: string, aplicacaoId: string, funcionalidade: Funcionalidade): Promise<Funcionalidade> {
    try {
      const cliente = await this.buscarCliente(clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado.')
      }

      const aplicacao = cliente.aplicacoes.find((item) => item.id === aplicacaoId)
      if (!aplicacao) {
        throw new Error('Aplicação não encontrada.')
      }

      const funcionalidadeValida = z.object({
        id: z.string().min(1),
        nome: z.string().min(1),
        descricao: z.string().min(1),
        pontosImportantes: z.string().min(1),
        usuarios: z.array(z.any()).default([]),
        entidades: z.array(z.any()).default([]),
      }).parse(funcionalidade)

      const clienteAtualizado = {
        ...cliente,
        aplicacoes: cliente.aplicacoes.map((item) =>
          item.id === aplicacaoId
            ? { ...item, funcionalidades: [...item.funcionalidades, funcionalidadeValida] }
            : item,
        ),
        dataUltimaAlteracao: new Date(),
      }

      await this.atualizarCliente(clienteId, clienteAtualizado)
      return funcionalidadeValida
    } catch (error) {
      console.error('Erro ao adicionar funcionalidade:', error)
      throw error
    }
  },

  async atualizarFuncionalidade(
    clienteId: string,
    aplicacaoId: string,
    funcionalidadeId: string,
    funcionalidadeAtualizada: Partial<Funcionalidade>,
  ): Promise<Funcionalidade> {
    try {
      const cliente = await this.buscarCliente(clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado.')
      }

      const aplicacao = cliente.aplicacoes.find((item) => item.id === aplicacaoId)
      if (!aplicacao) {
        throw new Error('Aplicação não encontrada.')
      }

      const indice = aplicacao.funcionalidades.findIndex((funcionalidade) => funcionalidade.id === funcionalidadeId)
      if (indice === -1) {
        throw new Error('Funcionalidade não encontrada.')
      }

      const funcionalidadeExistente = aplicacao.funcionalidades[indice]
      const funcionalidadeValidada = {
        ...funcionalidadeExistente,
        ...funcionalidadeAtualizada,
      }

      const clienteAtualizado = {
        ...cliente,
        aplicacoes: cliente.aplicacoes.map((item) =>
          item.id === aplicacaoId
            ? {
                ...item,
                funcionalidades: item.funcionalidades.map((funcionalidade) =>
                  funcionalidade.id === funcionalidadeId ? funcionalidadeValidada : funcionalidade,
                ),
              }
            : item,
        ),
        dataUltimaAlteracao: new Date(),
      }

      await this.atualizarCliente(clienteId, clienteAtualizado)
      return funcionalidadeValidada
    } catch (error) {
      console.error('Erro ao atualizar funcionalidade:', error)
      throw error
    }
  },

  async removerFuncionalidade(clienteId: string, aplicacaoId: string, funcionalidadeId: string): Promise<void> {
    try {
      const cliente = await this.buscarCliente(clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado.')
      }

      const clienteAtualizado = {
        ...cliente,
        aplicacoes: cliente.aplicacoes.map((aplicacao) =>
          aplicacao.id === aplicacaoId
            ? {
                ...aplicacao,
                funcionalidades: aplicacao.funcionalidades.filter(
                  (funcionalidade) => funcionalidade.id !== funcionalidadeId,
                ),
              }
            : aplicacao,
        ),
        dataUltimaAlteracao: new Date(),
      }

      await this.atualizarCliente(clienteId, clienteAtualizado)
    } catch (error) {
      console.error('Erro ao remover funcionalidade:', error)
      throw error
    }
  },

  async limparTodos(): Promise<void> {
    await localforage.removeItem(STORAGE_KEY)
  },
}

export type StorageService = typeof storageService
