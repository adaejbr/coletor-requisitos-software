import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/ToastProvider'
import { Button, ButtonLink } from '@/components/buttons'
import { BasicCard } from '@/components/cards'
import { exportarAplicacaoJson, exportarAplicacaoPdf } from '@/services/exportService'
import { storageService } from '@/services/storageService'
import type { Aplicacao } from '@/types'

export default function DetalhesAplicacaoPage() {
  const { clienteId, aplicacaoId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [aplicacao, setAplicacao] = useState<Aplicacao | null>(null)

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

    carregarAplicacao()
  }, [aplicacaoId, clienteId, navigate])

  if (!aplicacao) {
    return <section className="page"><p>Carregando aplicação...</p></section>
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
          <h1>{aplicacao.nome}</h1>
        </div>
        <div className="button-row export-actions">
          <Button type="button" variant="secondary" onClick={handleExportJson}>
            Exportar JSON
          </Button>
          <Button type="button" variant="ghost" onClick={handleExportPdf}>
            Exportar PDF
          </Button>
          <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/nova`} variant="primary">
            Nova Funcionalidade
          </ButtonLink>
          <ButtonLink to={`/clientes/${clienteId}`} variant="secondary">
            Voltar
          </ButtonLink>
        </div>
      </div>

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
