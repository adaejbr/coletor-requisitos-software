import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useBriefingForms } from '../../hooks/useBriefingForms'

const formatarData = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

export default function FormulariosPage() {
  const { formularios, loading, error, inativarFormulario, reativarFormulario } = useBriefingForms()

  const totalPerguntas = useMemo(
    () => formularios.reduce((contador, formulario) => contador + formulario.secoes.reduce((total, secao) => total + secao.perguntas.length, 0), 0),
    [formularios],
  )

  if (loading) {
    return (
      <section className="page">
        <div className="empty-state">
          <p>Carregando formulários...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page">
        <div className="empty-state">
          <p>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Configurações</p>
          <h1>Formulários de briefing</h1>
        </div>
        <Link to="/configuracoes/formularios/novo" className="primary-button">
          Novo formulário
        </Link>
      </div>

      <div className="stats-grid">
        <div className="info-card small-stat">
          <span>Total</span>
          <strong>{formularios.length}</strong>
        </div>
        <div className="info-card small-stat">
          <span>Perguntas</span>
          <strong>{totalPerguntas}</strong>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Seções</th>
              <th>Perguntas</th>
              <th>Status</th>
              <th>Atualizado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {formularios.map((formulario) => {
              const totalPerguntasFormulario = formulario.secoes.reduce(
                (contador, secao) => contador + secao.perguntas.length,
                0,
              )

              return (
                <tr key={formulario.id}>
                  <td>
                    <strong>{formulario.nome}</strong>
                    {formulario.descricao && <div className="muted-text">{formulario.descricao}</div>}
                  </td>
                  <td>{formulario.secoes.length}</td>
                  <td>{totalPerguntasFormulario}</td>
                  <td>{formulario.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td>{formatarData(formulario.atualizadoEm)}</td>
                  <td>
                    <div className="button-row compact-row">
                      <Link to={`/configuracoes/formularios/${formulario.id}/editar`} className="secondary-button">
                        Editar
                      </Link>
                      <button
                        type="button"
                        className={formulario.ativo ? 'ghost-button' : 'secondary-button'}
                        onClick={() =>
                          formulario.ativo ? inativarFormulario(formulario.id) : reativarFormulario(formulario.id)
                        }
                      >
                        {formulario.ativo ? 'Inativar' : 'Reativar'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {formularios.length === 0 && (
          <div className="empty-state">
            <p>Nenhum formulário cadastrado. Crie o primeiro briefing.</p>
          </div>
        )}
      </div>
    </section>
  )
}
