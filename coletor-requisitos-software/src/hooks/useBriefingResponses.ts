import { useCallback, useEffect, useState } from 'react'
import { briefingResponseRepository } from '../services/briefingResponseRepository'
import type { RespostaBriefing } from '../types/briefing'

export function useBriefingResponses(idCliente?: string, idAplicacao?: string) {
  const [respostas, setRespostas] = useState<RespostaBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!idCliente || !idAplicacao) {
      setRespostas([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const dados = await briefingResponseRepository.listarPorAplicacao(idCliente, idAplicacao)
      setRespostas(dados)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar respostas de briefing.'
      setError(mensagem)
      setRespostas([])
    } finally {
      setLoading(false)
    }
  }, [idAplicacao, idCliente])

  const salvarResposta = useCallback(async (resposta: RespostaBriefing) => {
    const saved = await briefingResponseRepository.salvar(resposta)
    setRespostas((prev) => {
      const index = prev.findIndex((item) => item.id === saved.id)

      if (index === -1) {
        return [...prev, saved]
      }

      return prev.map((item) => (item.id === saved.id ? saved : item))
    })

    return saved
  }, [])

  const concluirResposta = useCallback(async (resposta: RespostaBriefing) => {
    const saved = await briefingResponseRepository.concluir(resposta)
    setRespostas((prev) => {
      const index = prev.findIndex((item) => item.id === saved.id)

      if (index === -1) {
        return [...prev, saved]
      }

      return prev.map((item) => (item.id === saved.id ? saved : item))
    })
    return saved
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    respostas,
    loading,
    error,
    refresh,
    salvarResposta,
    concluirResposta,
  }
}
