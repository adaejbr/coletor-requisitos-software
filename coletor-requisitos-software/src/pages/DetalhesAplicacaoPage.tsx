import { Link, useParams } from 'react-router-dom'

export default function DetalhesAplicacaoPage() {
  const { clienteId, aplicacaoId } = useParams()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Aplicação</p>
          <h1>Detalhes da Aplicação: {aplicacaoId}</h1>
        </div>
        <div className="button-row">
          <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/nova`} className="primary-button">
            Nova Funcionalidade
          </Link>
          <Link to={`/clientes/${clienteId}`} className="secondary-button">
            Voltar
          </Link>
        </div>
      </div>

      <div className="card-grid">
        {[
          { id: 'func-1', nome: 'Cadastro de Usuários', descricao: 'Fluxo de criação e edição de usuários do sistema.' },
          { id: 'func-2', nome: 'Relatório Financeiro', descricao: 'Consulta e geração de indicadores financeiros.' },
        ].map((func) => (
          <article key={func.id} className="info-card">
            <h2>{func.nome}</h2>
            <p>{func.descricao}</p>
            <div className="button-row">
              <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${func.id}/visualizar`} className="secondary-button">
                Visualizar
              </Link>
              <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${func.id}/editar`} className="ghost-button">
                Editar
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
