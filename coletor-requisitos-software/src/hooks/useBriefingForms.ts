import { useCallback, useEffect, useState } from 'react'
import type { FormularioBriefing } from '../types/briefing'
import { briefingFormRepository } from '../services/briefingFormRepository'

export function useBriefingForms() {
  const [formularios, setFormularios] = useState<FormularioBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const dados = await briefingFormRepository.listar()
      setFormularios(dados)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar formulários de briefing.'
      setError(mensagem)
      setFormularios([])
    } finally {
      setLoading(false)
    }
  }, [])

  const salvarFormulario = useCallback(async (formulario: FormularioBriefing) => {
    const saved = await briefingFormRepository.salvar(formulario)
    setFormularios((prev) => {
      const index = prev.findIndex((item) => item.id === saved.id)

      if (index === -1) {
        return [...prev, saved]
      }

      return prev.map((item) => (item.id === saved.id ? saved : item))
    })

    return saved
  }, [])

  const inativarFormulario = useCallback(async (id: string) => {
    const updated = await briefingFormRepository.inativar(id)
    setFormularios((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }, [])

  const reativarFormulario = useCallback(async (id: string) => {
    const updated = await briefingFormRepository.reativar(id)
    setFormularios((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    formularios,
    loading,
    error,
    refresh,
    salvarFormulario,
    inativarFormulario,
    reativarFormulario,
  }
}
