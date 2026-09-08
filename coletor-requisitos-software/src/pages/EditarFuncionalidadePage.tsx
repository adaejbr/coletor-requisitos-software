import { Link, useParams } from 'react-router-dom'

export default function EditarFuncionalidadePage() {
  const { clienteId, aplicacaoId, funcionalidadeId } = useParams()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Funcionalidade</p>
          <h1>Editar Funcionalidade: {funcionalidadeId}</h1>
        </div>
        <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} className="secondary-button">
          Voltar
        </Link>
      </div>

      <div className="form-card">
        <label>
          Nome
          <input type="text" defaultValue="Cadastro de Usuários" />
        </label>
        <label>
          Descrição
          <textarea rows={4} defaultValue="Fluxo de criação e edição de usuários do sistema." />
        </label>
        <label>
          Pontos importantes
          <textarea rows={3} defaultValue="Validações de email, papel do usuário e acesso por perfil." />
        </label>
        <div className="button-row">
          <button type="button" className="primary-button">
            Atualizar funcionalidade
          </button>
          <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} className="ghost-button">
            Cancelar
          </Link>
        </div>
      </div>
    </section>
  )
}
