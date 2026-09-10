import localforage from 'localforage'
import type { RespostaBriefing } from '../types/briefing'
import { validarRespostaBriefing } from '../utils/validators'

const STORAGE_KEY = 'briefing:responses'

const briefingResponsesStore = localforage.createInstance({
  name: 'coletor-requisitos-software',
  storeName: 'briefing-responses',
})

export const briefingResponseRepository = {
  async listarTodos(): Promise<RespostaBriefing[]> {
    try {
      const respostas = (await briefingResponsesStore.getItem<RespostaBriefing[]>(STORAGE_KEY)) ?? []
      return respostas.map((resposta) => validarRespostaBriefing(resposta))
    } catch (error) {
      console.error('Erro ao listar respostas de briefing:', error)
      return []
    }
  },

  async listarPorAplicacao(idCliente: string, idAplicacao: string): Promise<RespostaBriefing[]> {
    const respostas = await this.listarTodos()
    return respostas.filter(
      (resposta) => resposta.idCliente === idCliente && resposta.idAplicacao === idAplicacao,
    )
  },

  async buscarPorFormularioEAplicacao(
    idCliente: string,
    idAplicacao: string,
    idFormulario: string,
  ): Promise<RespostaBriefing | null> {
    const respostas = await this.listarPorAplicacao(idCliente, idAplicacao)
    return respostas.find((resposta) => resposta.idFormulario === idFormulario) ?? null
  },

  async salvar(resposta: RespostaBriefing): Promise<RespostaBriefing> {
    try {
      const respostaValidada = validarRespostaBriefing(resposta)
      const respostas = await this.listarTodos()
      const index = respostas.findIndex((item) => item.id === respostaValidada.id)

      const proximoEstado =
        index === -1
          ? [...respostas, respostaValidada]
          : respostas.map((item) => (item.id === respostaValidada.id ? respostaValidada : item))

      await briefingResponsesStore.setItem(STORAGE_KEY, proximoEstado)
      return respostaValidada
    } catch (error) {
      console.error('Erro ao salvar resposta de briefing:', error)
      throw error
    }
  },

  async concluir(resposta: RespostaBriefing): Promise<RespostaBriefing> {
    const respostaAtualizada: RespostaBriefing = {
      ...resposta,
      status: 'concluido',
      atualizadoEm: new Date().toISOString(),
      concluidoEm: resposta.concluidoEm ?? new Date().toISOString(),
    }

    return this.salvar(respostaAtualizada)
  },
}

export type BriefingResponseRepository = typeof briefingResponseRepository
