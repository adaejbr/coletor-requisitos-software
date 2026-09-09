import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { storageService } from '../../services/storageService'
import type { Funcionalidade } from '../../types'

export default function VisualizarFuncionalidadePage() {
  const { clienteId, aplicacaoId, funcionalidadeId } = useParams()
  const [funcionalidade, setFuncionalidade] = useState<Funcionalidade | null>(null)

  useEffect(() => {
    const carregarFuncionalidade = async () => {
      if (!clienteId || !aplicacaoId || !funcionalidadeId) return
      const dados = await storageService.buscarFuncionalidade(clienteId, aplicacaoId, funcionalidadeId)
      setFuncionalidade(dados)
    }

    carregarFuncionalidade()
  }, [aplicacaoId, clienteId, funcionalidadeId])

  if (!funcionalidade) {
    return <section className="page"><p>Carregando funcionalidade...</p></section>
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Funcionalidade</p>
          <h1>{funcionalidade.nome}</h1>
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
        <p>
          <strong>Descrição:</strong> {funcionalidade.descricao}
        </p>
        <p>
          <strong>Pontos importantes:</strong> {funcionalidade.pontosImportantes}
        </p>

        <div className="detail-block">
          <h3>Usuários</h3>
          <ul>
            {funcionalidade.usuarios.map((usuario) => (
              <li key={usuario.id}>
                {usuario.nome} — {usuario.acoes.join(', ')}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-block">
          <h3>Entidades</h3>
          <ul>
            {funcionalidade.entidades.map((entidade) => (
              <li key={entidade.id}>
                {entidade.nome}: {entidade.campos.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
