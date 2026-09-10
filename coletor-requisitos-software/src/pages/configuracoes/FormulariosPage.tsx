import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BasicCard } from '../../components/cards'
import { Table, type TableColumn } from '../../components/table/Table'
import { useBriefingForms } from '../../hooks/useBriefingForms'
import type { FormularioBriefing } from '../../types/briefing'

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

  const totalAtivos = formularios.filter((formulario) => formulario.ativo).length
  const totalInativos = formularios.length - totalAtivos

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

  const columns: TableColumn<FormularioBriefing>[] = [
    {
      key: 'nome',
      header: 'Nome',
      render: (formulario) => (
        <>
          <strong>{formulario.nome}</strong>
          {formulario.descricao && <div className="muted-text">{formulario.descricao}</div>}
        </>
      ),
    },
    {
      key: 'secoes',
      header: 'Seções',
      render: (formulario) => formulario.secoes.length,
      align: 'center',
    },
    {
      key: 'perguntas',
      header: 'Perguntas',
      render: (formulario) => formulario.secoes.reduce((contador, secao) => contador + secao.perguntas.length, 0),
      align: 'center',
    },
    {
      key: 'status',
      header: 'Status',
      render: (formulario) => (
        <span className={`status-badge ${formulario.ativo ? 'status-active' : 'status-inactive'}`}>
          {formulario.ativo ? 'Ativo' : 'Inativo'}
        </span>
      ),
      align: 'center',
    },
    {
      key: 'atualizadoEm',
      header: 'Atualizado em',
      render: (formulario) => formatarData(formulario.atualizadoEm),
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: (formulario) => (
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
      ),
    },
  ]

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
        <BasicCard className="small-stat">
          <span>Total</span>
          <strong>{formularios.length}</strong>
        </BasicCard>
        <BasicCard className="small-stat">
          <span>Ativos</span>
          <strong>{totalAtivos}</strong>
        </BasicCard>
        <BasicCard className="small-stat">
          <span>Inativos</span>
          <strong>{totalInativos}</strong>
        </BasicCard>
        <BasicCard className="small-stat">
          <span>Perguntas</span>
          <strong>{totalPerguntas}</strong>
        </BasicCard>
      </div>

      <Table
        columns={columns}
        data={formularios}
        getRowKey={(formulario) => formulario.id}
        emptyState={
          <div className="empty-state">
            <strong>Nenhum formulário cadastrado.</strong>
            <p>Crie o primeiro briefing para começar a organização de perguntas e seções.</p>
          </div>
        }
      />
    </section>
  )
}
