import { Link } from 'react-router-dom'

export default function NovoClientePage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cliente</p>
          <h1>Novo Cliente</h1>
        </div>
        <Link to="/" className="secondary-button">
          Voltar
        </Link>
      </div>

      <div className="form-card">
        <label>
          Nome
          <input type="text" placeholder="Digite o nome do cliente" />
        </label>
        <label>
          Status
          <select defaultValue="em andamento">
            <option value="em negociacao">Em negociação</option>
            <option value="em andamento">Em andamento</option>
            <option value="projeto entregue">Projeto entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </label>
        <div className="button-row">
          <button type="button" className="primary-button">
            Salvar cliente
          </button>
          <Link to="/" className="ghost-button">
            Cancelar
          </Link>
        </div>
      </div>
    </section>
  )
}
