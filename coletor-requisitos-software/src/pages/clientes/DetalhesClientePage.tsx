import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { storageService } from '../../services/storageService'
import type { Cliente } from '../../types'

export default function DetalhesClientePage() {
  const { clienteId } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState<Cliente | null>(null)

  useEffect(() => {
    const carregarCliente = async () => {
      if (!clienteId) {
        navigate('/', { replace: true })
        return
      }

      const dados = await storageService.buscarCliente(clienteId)
      if (!dados) {
        navigate('/', { replace: true })
        return
      }

      setCliente(dados)
    }

    carregarCliente()
  }, [clienteId, navigate])

  if (!cliente) {
    return <section className="page"><p>Carregando cliente...</p></section>
  }

  const removerAplicacao = async (aplicacaoId: string) => {
    const confirmar = window.confirm('Deseja remover esta aplicação?')
    if (!confirmar) return

    await storageService.removerAplicacao(cliente.id, aplicacaoId)
    const dados = await storageService.buscarCliente(cliente.id)
    setCliente(dados)
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cliente</p>
          <h1>{cliente.nome}</h1>
        </div>
        <div className="button-row">
          <Link to={`/clientes/${cliente.id}/aplicacoes/nova`} className="primary-button">
            Nova Aplicação
          </Link>
          <Link to={`/clientes/${cliente.id}/editar`} className="secondary-button">
            Editar Cliente
          </Link>
          <Link to="/" className="ghost-button">
            Voltar
          </Link>
        </div>
      </div>

      <div className="info-card detail-summary">
        <p>
          <strong>Status:</strong> {cliente.status}
        </p>
        <p>
          <strong>Última alteração:</strong>{' '}
          {new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).format(new Date(cliente.dataUltimaAlteracao))}
        </p>
      </div>

      <div className="card-grid">
        {cliente.aplicacoes.map((aplicacao) => (
          <article key={aplicacao.id} className="info-card">
            <h2>{aplicacao.nome}</h2>
            <p>{aplicacao.funcionalidades.length} funcionalidade(s)</p>
            <div className="button-row">
              <Link to={`/clientes/${cliente.id}/aplicacoes/${aplicacao.id}`} className="secondary-button">
                Ver detalhes
              </Link>
              <Link to={`/clientes/${cliente.id}/aplicacoes/${aplicacao.id}/editar`} className="ghost-button">
                Editar
              </Link>
              <button type="button" className="danger-button" onClick={() => removerAplicacao(aplicacao.id)}>
                Excluir
              </button>
            </div>
          </article>
        ))}

        {cliente.aplicacoes.length === 0 && (
          <div className="empty-state">
            <p>Este cliente ainda não possui aplicações cadastradas.</p>
          </div>
        )}
      </div>
    </section>
  )
}
