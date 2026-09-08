import { Link, useParams } from 'react-router-dom'

export default function DetalhesClientePage() {
  const { clienteId } = useParams()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cliente</p>
          <h1>Detalhes do Cliente: {clienteId}</h1>
        </div>
        <div className="button-row">
          <Link to={`/clientes/${clienteId}/aplicacoes/nova`} className="primary-button">
            Nova Aplicação
          </Link>
          <Link to="/" className="secondary-button">
            Voltar
          </Link>
        </div>
      </div>

      <div className="card-grid">
        {[
          { id: 'app-1', nome: 'Portal de Vendas' },
          { id: 'app-2', nome: 'Painel Administrativo' },
        ].map((app) => (
          <article key={app.id} className="info-card">
            <h2>{app.nome}</h2>
            <p>Aplicação vinculada ao cliente selecionado.</p>
            <div className="button-row">
              <Link to={`/clientes/${clienteId}/aplicacoes/${app.id}`} className="secondary-button">
                Ver detalhes
              </Link>
              <button type="button" className="ghost-button">
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
