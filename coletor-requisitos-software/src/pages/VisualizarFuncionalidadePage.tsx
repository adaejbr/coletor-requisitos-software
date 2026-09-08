import { Link, useParams } from 'react-router-dom'

export default function VisualizarFuncionalidadePage() {
  const { clienteId, aplicacaoId, funcionalidadeId } = useParams()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Funcionalidade</p>
          <h1>Visualização: {funcionalidadeId}</h1>
        </div>
        <div className="button-row">
          <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${funcionalidadeId}/editar`} className="primary-button">
            Editar
          </Link>
          <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} className="secondary-button">
            Voltar
          </Link>
        </div>
      </div>

      <div className="detail-card">
        <h2>Cadastro de Usuários</h2>
        <p>
          <strong>Descrição:</strong> Fluxo de criação e edição de usuários do sistema.
        </p>
        <p>
          <strong>Pontos importantes:</strong> Validações de email, papel do usuário e acesso por perfil.
        </p>
        <div className="detail-block">
          <h3>Usuários</h3>
          <ul>
            <li>Administrador — criar, editar, excluir</li>
            <li>Operador — visualizar e atualizar</li>
          </ul>
        </div>
        <div className="detail-block">
          <h3>Entidades</h3>
          <ul>
            <li>Usuário: nome, email, perfil</li>
            <li>Perfil: nome, permissões</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
