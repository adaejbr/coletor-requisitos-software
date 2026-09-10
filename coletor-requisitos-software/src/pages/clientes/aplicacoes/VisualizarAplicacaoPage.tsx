import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/toast-provider/ToastProvider'
import { Button, ButtonLink } from '@/components/buttons'
import { BasicCard } from '@/components/cards'
import { exportarAplicacaoJson, exportarAplicacaoPdf } from '@/services/exportService'
import { storageService } from '@/services/storageService'
import type { Aplicacao, FormularioBriefing, FormularioConcluido, RespostaBriefing } from '@/types'
import { Table, type TableColumn } from '@/components/table/Table'
import { formatarData } from '@/utils/dateFormatter'
import { useBriefingForms } from '@/hooks/useBriefingForms'
import { useBriefingResponses } from '@/hooks/useBriefingResponses'

export default function DetalhesAplicacaoPage() {
  const { clienteId, aplicacaoId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [aplicacao, setAplicacao] = useState<Aplicacao | null>(null)

  const { formularios, loading: loadingForms } = useBriefingForms()
  const { respostas, loading: loadingResponses } = useBriefingResponses(clienteId, aplicacaoId)

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

  const formulariosPendentes = useMemo(
    () =>
      formularios.filter((formulario) => {
        if (!formulario.ativo) {
          return false
        }

        const respostasDoFormulario = respostasPorFormulario.get(formulario.id) ?? []
        return !respostasDoFormulario.some((resposta) => resposta.status === 'concluido')
      }),
    [formularios, respostasPorFormulario],
  )

  const formulariosConcluidos = useMemo<FormularioConcluido[]>(
    () =>
      formularios
        .filter((formulario) => {
          if (!formulario.ativo) {
            return false
          }

          const respostasDoFormulario = respostasPorFormulario.get(formulario.id) ?? []
          return respostasDoFormulario.some((resposta) => resposta.status === 'concluido')
        })
        .map((formulario) => {
          const respostasDoFormulario = respostasPorFormulario.get(formulario.id) ?? []
          const respostaConcluida = [...respostasDoFormulario]
            .filter((resposta) => resposta.status === 'concluido')
            .sort(
              (a, b) =>
                new Date(b.concluidoEm ?? b.atualizadoEm).getTime() -
                new Date(a.concluidoEm ?? a.atualizadoEm).getTime(),
            )[0]

          return {
            id: formulario.id,
            nome: formulario.nome,
            descricao: formulario.descricao,
            concluidoEm: respostaConcluida?.concluidoEm ?? respostaConcluida?.atualizadoEm ?? formulario.atualizadoEm,
          }
        }),
    [formularios, respostasPorFormulario],
  )

  const columnsPendentes: TableColumn<FormularioBriefing>[] = [
    {
      key: 'nome',
      header: 'Nome',
      render: (formulario) => (
        <>
          <strong>{formulario.nome}</strong>
          {formulario.descricao && <div className="muted-text">{formulario.descricao}</div>}
        </>
      ),
    },
    {
      key: 'secoes',
      header: 'Seções',
      render: (formulario) => formulario.secoes.length,
      align: 'center',
    },
    {
      key: 'perguntas',
      header: 'Perguntas',
      render: (formulario) => formulario.secoes.reduce((contador, secao) => contador + secao.perguntas.length, 0),
      align: 'center',
    },
    {
      key: 'atualizadoEm',
      header: 'Atualizado em',
      render: (formulario) => formatarData(formulario.atualizadoEm),
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: () => (
        <div className="button-row compact-row">
          <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/briefing`} variant="secondary">
            Responder
          </ButtonLink>
        </div>
      ),
    },
  ]

  const columnsConcluidos: TableColumn<FormularioConcluido>[] = [
    {
      key: 'nome',
      header: 'Nome',
      render: (formulario) => (
        <>
          <strong>{formulario.nome}</strong>
          {formulario.descricao && <div className="muted-text">{formulario.descricao}</div>}
        </>
      ),
    },
    {
      key: 'concluidoEm',
      header: 'Concluído em',
      render: (formulario) => formatarData(formulario.concluidoEm),
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: () => (
        <div className="button-row compact-row">
          <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/briefing`} variant="secondary">
            Visualizar
          </ButtonLink>
        </div>
      ),
    },
  ]

  useEffect(() => {
    const carregarAplicacao = async () => {
      if (!clienteId || !aplicacaoId) {
        navigate('/', { replace: true })
        return
      }

      const dados = await storageService.buscarAplicacao(clienteId, aplicacaoId)
      if (!dados) {
        navigate(`/clientes/${clienteId}`, { replace: true })
        return
      }

      setAplicacao(dados)
    }

    void carregarAplicacao()
  }, [aplicacaoId, clienteId, navigate])

  if (!aplicacao) {
    return <section className="page"><p>Carregando aplicação...</p></section>
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

  const handleExportJson = async () => {
    if (!clienteId || !aplicacaoId) return

    try {
      showToast('Gerando arquivo JSON...')
      await exportarAplicacaoJson(clienteId, aplicacaoId)
      showToast('Download do JSON iniciado.')
    } catch (error) {
      console.error(error)
      showToast('Não foi possível exportar o JSON.')
    }
  }

  const handleExportPdf = async () => {
    if (!clienteId || !aplicacaoId) return

    try {
      showToast('Gerando PDF...')
      await exportarAplicacaoPdf(clienteId, aplicacaoId)
      showToast('Download do PDF iniciado.')
    } catch (error) {
      console.error(error)
      showToast('Não foi possível exportar o PDF.')
    }
  }

  const removerFuncionalidade = async (funcionalidadeId: string) => {
    const confirmar = window.confirm('Deseja remover esta funcionalidade?')
    if (!confirmar) return

    try {
      await storageService.removerFuncionalidade(clienteId!, aplicacaoId!, funcionalidadeId)
      const dados = await storageService.buscarAplicacao(clienteId!, aplicacaoId!)
      setAplicacao(dados)
      showToast('Funcionalidade removida com sucesso.')
    } catch (error) {
      console.error(error)
      showToast('Não foi possível remover a funcionalidade.')
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Aplicação</p>
        </div>
        <div className="button-row export-actions">
          <Button type="button" variant="secondary" onClick={handleExportJson}>
            Exportar JSON
          </Button>
          <Button type="button" variant="danger" onClick={handleExportPdf}>
            Exportar PDF
          </Button>
          <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/nova`} variant="primary">
            Nova Funcionalidade
          </ButtonLink>
          <ButtonLink to={`/clientes/${clienteId}`} variant="ghost">
            Voltar
          </ButtonLink>
        </div>
      </div>

      <BasicCard>
        <div className="card-header">
          <h2>{aplicacao.nome}</h2>
          <br />
          <p><strong>ID:</strong> {aplicacao.id}</p>
          <p><strong>Quantidade de Funcionalidades:</strong> {aplicacao.funcionalidades.length}</p>
        </div>
      </BasicCard>

      <BasicCard>
        <div className="card-header">
          <h2>Formulários</h2>
          <p>Todos os formulários ativos pendentes ou concluídos serão apresentados nesta seção.</p>
        </div>
        <div className="card-content" style={{ marginBottom: '1rem', marginTop: '1rem'}}>
          <h3 style={{ marginBottom: '1rem' }}>Formulários Pendentes:</h3>
          <Table
            columns={columnsPendentes}
            data={formulariosPendentes}
            getRowKey={(formulario) => formulario.id}
            emptyState={<p>Nenhum formulário pendente para esta aplicação.</p>}
          />
        </div>

        {formulariosConcluidos.length > 0 && (
          <div className="card-content" style={{ marginBottom: '1rem', marginTop: '2rem'}}>
            <h3 style={{ marginBottom: '1rem' }}>Formulários concluídos:</h3>
            <Table
              columns={columnsConcluidos}
              data={formulariosConcluidos}
              getRowKey={(formulario) => formulario.id}
              emptyState={<p>Nenhum formulário concluído para esta aplicação.</p>}
            />
          </div>
        )}
      </BasicCard>
      <br />
      <hr />
      <br />
      <h2>Funcionalidades</h2>
      <p>As funcionalidades cadastradas para esta aplicação são apresentadas abaixo.</p>
      <br />

      <div className="card-grid">
        {aplicacao.funcionalidades.map((funcionalidade) => (
          <BasicCard key={funcionalidade.id}>
            <h2>{funcionalidade.nome}</h2>
            <p>{funcionalidade.descricao}</p>
            <div className="button-row">
              <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${funcionalidade.id}/visualizar`} variant="secondary">
                Visualizar
              </ButtonLink>
              <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${funcionalidade.id}/editar`} variant="ghost">
                Editar
              </ButtonLink>
              <Button type="button" variant="danger" onClick={() => removerFuncionalidade(funcionalidade.id)}>
                Excluir
              </Button>
            </div>
          </BasicCard>
        ))}

        {aplicacao.funcionalidades.length === 0 && (
          <div className="empty-state">
            <p>Esta aplicação ainda não possui funcionalidades cadastradas.</p>
          </div>
        )}
      </div>
    </section>
  )
}
