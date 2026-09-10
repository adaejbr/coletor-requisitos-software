/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { useToast } from '@/components/toast-provider/ToastProvider'
import { Button, ButtonLink } from '@/components/buttons'
import { BasicCard } from '@/components/cards'
import { storageService } from '@/services/storageService'
import type { Cliente } from '@/types'

const formatarData = (data: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(data))

export default function ClientesPage() {
  const { showToast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtro, setFiltro] = useState('')

  const carregarClientes = async () => {
    const dados = await storageService.listarClientes()
    setClientes(dados)
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase()),
  )

  const excluirCliente = async (clienteId: string) => {
    const confirmar = window.confirm('Deseja realmente excluir este cliente?')
    if (!confirmar) return

    try {
      await storageService.removerCliente(clienteId)
      await carregarClientes()
      showToast('Cliente removido com sucesso.')
    } catch (error) {
      console.error(error)
      showToast('Não foi possível excluir o cliente.')
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Listagem de Clientes</h1>
        </div>
        <ButtonLink to="/clientes/novo" variant="primary">
          Novo Cliente
        </ButtonLink>
      </div>

      <div className="toolbar">
        <input
          type="search"
          value={filtro}
          onChange={(event) => setFiltro(event.target.value)}
          placeholder="Buscar cliente por nome"
          aria-label="Buscar cliente"
        />
      </div>

      <div className="card-grid">
        {clientesFiltrados.map((cliente) => (
          <BasicCard key={cliente.id}>
            <h2>{cliente.nome}</h2>
            <p>
              <strong>Status:</strong> {cliente.status}
            </p>
            <p>
              <strong>Última alteração:</strong> {formatarData(cliente.dataUltimaAlteracao)}
            </p>
            <div className="button-row">
              <ButtonLink to={`/clientes/${cliente.id}`} variant="secondary">
                Ver detalhes
              </ButtonLink>
              <ButtonLink to={`/clientes/${cliente.id}/editar`} variant="ghost">
                Editar
              </ButtonLink>
              <Button onClick={() => excluirCliente(cliente.id)} variant="danger">
                Excluir
              </Button>
            </div>
          </BasicCard>
        ))}

        {clientesFiltrados.length === 0 && (
          <div className="empty-state">
            <p>Nenhum cliente encontrado.</p>
          </div>
        )}
      </div>
    </section>
  )
}
