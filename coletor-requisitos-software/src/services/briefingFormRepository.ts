import localforage from 'localforage'
import type { FormularioBriefing } from '../types/briefing'
import { validarFormularioBriefing } from '../utils/validators'

const STORAGE_KEY = 'briefing:forms'

const briefingFormsStore = localforage.createInstance({
  name: 'coletor-requisitos-software',
  storeName: 'briefing-forms',
})

export const briefingFormRepository = {
  async listar(): Promise<FormularioBriefing[]> {
    try {
      const formulários = (await briefingFormsStore.getItem<FormularioBriefing[]>(STORAGE_KEY)) ?? []
      return formulários.map((formulario) => validarFormularioBriefing(formulario))
    } catch (error) {
      console.error('Erro ao listar formulários de briefing:', error)
      return []
    }
  },

  async buscarPorId(id: string): Promise<FormularioBriefing | null> {
    const formulários = await this.listar()
    return formulários.find((formulario) => formulario.id === id) ?? null
  },

  async salvar(formulario: FormularioBriefing): Promise<FormularioBriefing> {
    try {
      const formValidado = validarFormularioBriefing(formulario)
      const formulários = await this.listar()
      const index = formulários.findIndex((item) => item.id === formValidado.id)

      const proximoEstado =
        index === -1
          ? [...formulários, formValidado]
          : formulários.map((item) => (item.id === formValidado.id ? formValidado : item))

      await briefingFormsStore.setItem(STORAGE_KEY, proximoEstado)
      return formValidado
    } catch (error) {
      console.error('Erro ao salvar formulário de briefing:', error)
      throw error
    }
  },

  async inativar(id: string): Promise<FormularioBriefing> {
    const formulario = await this.buscarPorId(id)

    if (!formulario) {
      throw new Error('Formulário de briefing não encontrado.')
    }

    return this.salvar({
      ...formulario,
      ativo: false,
      atualizadoEm: new Date().toISOString(),
    })
  },

  async reativar(id: string): Promise<FormularioBriefing> {
    const formulario = await this.buscarPorId(id)

    if (!formulario) {
      throw new Error('Formulário de briefing não encontrado.')
    }

    return this.salvar({
      ...formulario,
      ativo: true,
      atualizadoEm: new Date().toISOString(),
    })
  },
}

export type BriefingFormRepository = typeof briefingFormRepository
