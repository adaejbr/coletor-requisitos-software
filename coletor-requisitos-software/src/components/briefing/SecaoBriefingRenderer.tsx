import type { SecaoBriefing } from '@/types/briefing'
import { PerguntaBriefingRenderer } from './PerguntaBriefingRenderer'

type SecaoBriefingRendererProps = {
  secao: SecaoBriefing
  respostas: Record<string, unknown>
  onChangePergunta: (idPergunta: string, valor: unknown) => void
}

export function SecaoBriefingRenderer({ secao, respostas, onChangePergunta }: SecaoBriefingRendererProps) {
  const perguntasAtivas = [...secao.perguntas]
    .filter((pergunta) => pergunta.ativo)
    .sort((a, b) => a.ordem - b.ordem)

  if (!secao.ativo || perguntasAtivas.length === 0) {
    return null
  }

  return (
    <section className="briefing-section">
      <header className="briefing-section__header">
        <h3>{secao.titulo}</h3>
        {secao.descricao && <p>{secao.descricao}</p>}
      </header>

      <div className="briefing-question-list">
        {perguntasAtivas.map((pergunta) => (
          <PerguntaBriefingRenderer
            key={pergunta.id}
            pergunta={pergunta}
            valor={respostas[pergunta.id]}
            onChange={(valor) => onChangePergunta(pergunta.id, valor)}
          />
        ))}
      </div>
    </section>
  )
}
