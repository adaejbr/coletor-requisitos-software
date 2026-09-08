import { Link, useParams } from 'react-router-dom'

export default function NovaAplicacaoPage() {
  const { clienteId } = useParams()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Aplicação</p>
          <h1>Nova Aplicação</h1>
        </div>
        <Link to={`/clientes/${clienteId}`} className="secondary-button">
          Voltar
        </Link>
      </div>

      <div className="form-card">
        <label>
          Nome da aplicação
          <input type="text" placeholder="Digite o nome da aplicação" />
        </label>
        <div className="button-row">
          <button type="button" className="primary-button">
            Salvar aplicação
          </button>
          <Link to={`/clientes/${clienteId}`} className="ghost-button">
            Cancelar
          </Link>
        </div>
      </div>
    </section>
  )
}
