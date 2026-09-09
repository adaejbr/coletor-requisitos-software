import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../components/ToastProvider'
import { exportarAplicacaoJson, exportarAplicacaoPdf } from '../../services/exportService'
import { storageService } from '../../services/storageService'
import type { Aplicacao } from '../../types'

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
          <button type="button" className="secondary-button" onClick={handleExportJson}>
            Exportar JSON
          </button>
          <button type="button" className="ghost-button" onClick={handleExportPdf}>
            Exportar PDF
          </button>
          <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/nova`} className="primary-button">
            Nova Funcionalidade
          </Link>
          <Link to={`/clientes/${clienteId}`} className="secondary-button">
            Voltar
          </Link>
        </div>
      </div>

      <div className="card-grid">
        {aplicacao.funcionalidades.map((funcionalidade) => (
          <article key={funcionalidade.id} className="info-card">
            <h2>{funcionalidade.nome}</h2>
            <p>{funcionalidade.descricao}</p>
            <div className="button-row">
              <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${funcionalidade.id}/visualizar`} className="secondary-button">
                Visualizar
              </Link>
              <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${funcionalidade.id}/editar`} className="ghost-button">
                Editar
              </Link>
              <button type="button" className="danger-button" onClick={() => removerFuncionalidade(funcionalidade.id)}>
                Excluir
              </button>
            </div>
          </article>
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
