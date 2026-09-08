import { Link } from 'react-router-dom'

export default function ClientesPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Listagem de Clientes</h1>
        </div>
        <Link to="/clientes/novo" className="primary-button">
          Novo Cliente
        </Link>
      </div>

      <div className="card-grid">
        {[
          { id: 'cliente-1', nome: 'ACME', status: 'em andamento' },
          { id: 'cliente-2', nome: 'Globex', status: 'em negociacao' },
        ].map((cliente) => (
          <article key={cliente.id} className="info-card">
            <h2>{cliente.nome}</h2>
            <p>
              <strong>Status:</strong> {cliente.status}
            </p>
            <p>
              <strong>Última alteração:</strong> 08/09/2026
            </p>
            <div className="button-row">
              <Link to={`/clientes/${cliente.id}`} className="secondary-button">
                Ver detalhes
              </Link>
              <button type="button" className="ghost-button">
                Editar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
