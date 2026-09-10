import type { Entidade } from "../../../types";

    export function CardEntity( { entidade, getNomeEntidadeRelacionada }: { entidade: Entidade, getNomeEntidadeRelacionada: (entidadeId?: string, nome?: string) => string } ) {
    return (
        <article key={entidade.id} className="entity-card">
            <header className="entity-card__header">
                {entidade.nome}
            </header>

            <div className="entity-card__body">
                {entidade.campos.map((campo) => (
                <div key={`${entidade.id}-${campo}`} className="entity-card__attribute-row">
                    {campo}
                </div>
                ))}

                {entidade.relacionamentos.length > 0 && (
                <div className="entity-card__relations">
                    {entidade.relacionamentos.map((relacionamento) => (
                    <div key={`${entidade.id}-${relacionamento.entidadeDestinoId ?? relacionamento.entidadeDestino}`} className="entity-card__relation-row">
                        <span className="relation-arrow">→</span>
                        <span>{getNomeEntidadeRelacionada(relacionamento.entidadeDestinoId, relacionamento.entidadeDestino)}</span>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </article>
    )
}