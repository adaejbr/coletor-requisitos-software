import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardEntity } from '@/components/cards/card-entity/CardEntity'
import { DetailCard } from '@/components/cards'
import { storageService } from '@/services/storageService'
import type { Funcionalidade } from '@/types'
import { ButtonLink } from '@/components/buttons'

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

  const getNomeEntidadeRelacionada = (entidadeId?: string, nome?: string) => {
    if (!funcionalidade) {
      return nome ?? 'Entidade relacionada'
    }

    const entidadeRel = funcionalidade.entidades.find((entidade) => entidade.id === entidadeId)
    if (entidadeRel) {
      return entidadeRel.nome
    }

    return nome ?? 'Entidade relacionada'
  }

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
          <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}/funcionalidades/${funcionalidadeId}/editar`} variant="primary">
            Editar
          </ButtonLink>
          <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} variant="secondary">
            Voltar
          </ButtonLink>
        </div>
      </div>

      <DetailCard>
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
          <div className="entity-visualization">
            {funcionalidade.entidades.map((entidade) => (
              <CardEntity entidade={entidade} getNomeEntidadeRelacionada={getNomeEntidadeRelacionada} />
            ))}
          </div>
        </div>
      </DetailCard>
    </section>
  )
}
