import { Link, useParams } from 'react-router-dom'

export default function NovaFuncionalidadePage() {
  const { clienteId, aplicacaoId } = useParams()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Funcionalidade</p>
          <h1>Nova Funcionalidade</h1>
        </div>
        <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} className="secondary-button">
          Voltar
        </Link>
      </div>

      <div className="form-card">
        <label>
          Nome
          <input type="text" placeholder="Digite o nome da funcionalidade" />
        </label>
        <label>
          Descrição
          <textarea rows={4} placeholder="Descreva a funcionalidade" />
        </label>
        <label>
          Pontos importantes
          <textarea rows={3} placeholder="Liste comentários, regras ou critérios relevantes" />
        </label>
        <div className="button-row">
          <button type="button" className="primary-button">
            Salvar funcionalidade
          </button>
          <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} className="ghost-button">
            Cancelar
          </Link>
        </div>
      </div>
    </section>
  )
}
