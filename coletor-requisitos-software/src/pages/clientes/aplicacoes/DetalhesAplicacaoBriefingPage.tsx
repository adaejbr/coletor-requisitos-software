/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FormularioBriefingRenderer } from '@/components/briefing/FormularioBriefingRenderer'
import { useBriefingForms } from '@/hooks/useBriefingForms'
import { useBriefingResponses } from '@/hooks/useBriefingResponses'
import type { FormularioBriefing, RespostaBriefing } from '@/types/briefing'

export default function DetalhesAplicacaoBriefingPage() {
  const { clienteId, aplicacaoId } = useParams()
  const { formularios, loading: loadingForms } = useBriefingForms()
  const { respostas, loading: loadingResponses, salvarResposta, concluirResposta } = useBriefingResponses(
    clienteId,
    aplicacaoId,
  )
  const [formularioSelecionado, setFormularioSelecionado] = useState<FormularioBriefing | null>(null)

  const formulariosAtivos = useMemo(
    () => formularios.filter((formulario) => formulario.ativo).sort((a, b) => a.nome.localeCompare(b.nome)),
    [formularios],
  )

  const respostasPorFormulario = useMemo(() => {
    const mapa = new Map<string, RespostaBriefing[]>()

    respostas.forEach((resposta) => {
      if (!mapa.has(resposta.idFormulario)) {
        mapa.set(resposta.idFormulario, [])
      }

      mapa.get(resposta.idFormulario)?.push(resposta)
    })

    return mapa
  }, [respostas])

  const pendentes = useMemo(
    () =>
      formulariosAtivos.filter((formulario) => {
        const respostasDoFormulario = respostasPorFormulario.get(formulario.id) ?? []
        const respostaConcluida = respostasDoFormulario.some((resposta) => resposta.status === 'concluido')

        return !respostaConcluida
      }),
    [formulariosAtivos, respostasPorFormulario],
  )

  const preenchidos = useMemo(
    () =>
      formulariosAtivos.filter((formulario) => {
        const respostasDoFormulario = respostasPorFormulario.get(formulario.id) ?? []
        return respostasDoFormulario.some((resposta) => resposta.status === 'concluido')
      }),
    [formulariosAtivos, respostasPorFormulario],
  )

  useEffect(() => {
    if (!formularioSelecionado && pendentes[0]) {
      setFormularioSelecionado(pendentes[0])
    }
  }, [formularioSelecionado, pendentes])

  const obterRespostaAtual = (formulario: FormularioBriefing): RespostaBriefing | null => {
    const respostasDoFormulario = respostasPorFormulario.get(formulario.id) ?? []

    if (respostasDoFormulario.length === 0) {
      return null
    }

    return [...respostasDoFormulario].sort(
      (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
    )[0]
  }

  const handleSalvarRascunho = async (resposta: RespostaBriefing) => {
    if (!clienteId || !aplicacaoId) return resposta
    const respostaPersistida = await salvarResposta(resposta)
    setFormularioSelecionado((atual) => atual ?? pendentes[0] ?? null)
    return respostaPersistida
  }

  const handleConcluir = async (resposta: RespostaBriefing) => {
    if (!clienteId || !aplicacaoId) return resposta
    const respostaPersistida = await concluirResposta(resposta)
    setFormularioSelecionado((atual) => atual ?? pendentes[0] ?? null)
    return respostaPersistida
  }

  if (!clienteId || !aplicacaoId) {
    return null
  }

  if (loadingForms || loadingResponses) {
    return (
      <section className="page">
        <div className="empty-state">
          <p>Carregando formulários e respostas...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Aplicação</p>
          <h1>Formulários de briefing</h1>
        </div>
        <Link to={`/clientes/${clienteId}`} className="secondary-button">
          Voltar
        </Link>
      </div>

      <div className="briefing-dashboard">
        <aside className="briefing-sidebar">
          <div className="panel-section">
            <h3>Formulários pendentes</h3>
            {pendentes.length === 0 ? (
              <p className="muted-text">Nenhum formulário pendente.</p>
            ) : (
              <div className="stack-list">
                {pendentes.map((formulario) => (
                  <button
                    type="button"
                    key={formulario.id}
                    className={`list-button ${formularioSelecionado?.id === formulario.id ? 'selected' : ''}`}
                    onClick={() => setFormularioSelecionado(formulario)}
                  >
                    <strong>{formulario.nome}</strong>
                    <span>
                      {obterRespostaAtual(formulario)?.status === 'rascunho' ? 'Rascunho em andamento' : `${formulario.secoes.length} seções`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="panel-section">
            <h3>Formulários preenchidos</h3>
            {preenchidos.length === 0 ? (
              <p className="muted-text">Nenhum formulário concluído.</p>
            ) : (
              <div className="stack-list">
                {preenchidos.map((formulario) => (
                  <button
                    type="button"
                    key={formulario.id}
                    className={`list-button ${formularioSelecionado?.id === formulario.id ? 'selected' : ''}`}
                    onClick={() => setFormularioSelecionado(formulario)}
                  >
                    <strong>{formulario.nome}</strong>
                    <span>Visualizar / editar</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="briefing-content">
          {formularioSelecionado ? (
            <FormularioBriefingRenderer
              formulario={formularioSelecionado}
              respostaInicial={obterRespostaAtual(formularioSelecionado)}
              idCliente={clienteId}
              idAplicacao={aplicacaoId}
              onSalvarRascunho={handleSalvarRascunho}
              onConcluir={handleConcluir}
            />
          ) : (
            <div className="empty-state">
              <p>Selecione um formulário para preencher ou visualizar.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
