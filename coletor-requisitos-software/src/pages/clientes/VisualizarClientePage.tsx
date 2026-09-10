import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BasicCard } from '@/components/cards'
import { storageService } from '@/services/storageService'
import type { Cliente } from '@/types'
import { Button, ButtonLink } from '@/components/buttons'

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
          <ButtonLink to={`/clientes/${cliente.id}/aplicacoes/nova`} variant="primary">
            Nova Aplicação
          </ButtonLink>
          <ButtonLink to={`/clientes/${cliente.id}/editar`} variant="secondary">
            Editar Cliente
          </ButtonLink>
          <ButtonLink to="/" variant="ghost">
            Voltar
          </ButtonLink>
        </div>
      </div>

      <BasicCard className="detail-summary">
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
      </BasicCard>

      <div className="card-grid">
        {cliente.aplicacoes.map((aplicacao) => (
          <BasicCard key={aplicacao.id}>
            <h2>{aplicacao.nome}</h2>
            <p>{aplicacao.funcionalidades.length} funcionalidade(s)</p>
            <div className="button-row">
              <ButtonLink to={`/clientes/${cliente.id}/aplicacoes/${aplicacao.id}`} variant="secondary">
                Ver detalhes
              </ButtonLink>
              <ButtonLink to={`/clientes/${cliente.id}/aplicacoes/${aplicacao.id}/editar`} variant="ghost">
                Editar
              </ButtonLink>
              <Button onClick={() => removerAplicacao(aplicacao.id)} variant="danger">
                Excluir
              </Button>
            </div>
          </BasicCard>
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
