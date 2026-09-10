import { Button } from '../buttons'
import type { SecaoBriefing } from '@/types/briefing'
import { PerguntaBriefingBuilder } from './PerguntaBriefingBuilder'

type SecaoBriefingBuilderProps = {
  secao: SecaoBriefing
  onUpdate: (secaoAtualizada: SecaoBriefing) => void
  onAddPergunta: () => void
  onToggleStatus: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onMoveQuestion: (indicePergunta: number, direcao: -1 | 1) => void
}

export function SecaoBriefingBuilder({
  secao,
  onUpdate,
  onAddPergunta,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  onMoveQuestion,
}: SecaoBriefingBuilderProps) {
  return (
    <div className="panel-section">
      <div className="button-row">
        <span className="muted-text">{secao.ativo ? 'Seção ativa' : 'Seção inativa'}</span>
        <Button type="button" variant={secao.ativo ? 'ghost' : 'secondary'} onClick={onToggleStatus}>
          {secao.ativo ? 'Inativar' : 'Reativar'}
        </Button>
        <Button type="button" variant="ghost" onClick={onMoveUp}>
          ↑
        </Button>
        <Button type="button" variant="ghost" onClick={onMoveDown}>
          ↓
        </Button>
      </div>

      <label>
        Título da seção
        <input
          value={secao.titulo}
          onChange={(event) => onUpdate({ ...secao, titulo: event.target.value })}
          placeholder="Ex.: Dados da aplicação"
        />
      </label>

      <label>
        Descrição da seção
        <textarea
          value={secao.descricao ?? ''}
          onChange={(event) => onUpdate({ ...secao, descricao: event.target.value || undefined })}
          rows={2}
          placeholder="Detalhes da seção"
        />
      </label>

      <div className="button-row">
        <Button type="button" variant="primary" onClick={onAddPergunta}>
          + Adicionar pergunta
        </Button>
      </div>

      <div className="nested-group">
        {secao.perguntas.length === 0 && <p className="muted-text">Nenhuma pergunta cadastrada nesta seção.</p>}

        {secao.perguntas.map((pergunta, index) => (
          <PerguntaBriefingBuilder
            key={pergunta.id}
            pergunta={pergunta}
            onUpdate={(perguntaAtualizada) => {
              const perguntasAtualizadas = secao.perguntas.map((item) =>
                item.id === pergunta.id ? perguntaAtualizada : item,
              )
              onUpdate({ ...secao, perguntas: perguntasAtualizadas })
            }}
            onToggleStatus={() => {
              const perguntasAtualizadas = secao.perguntas.map((item) =>
                item.id === pergunta.id ? { ...item, ativo: !item.ativo } : item,
              )
              onUpdate({ ...secao, perguntas: perguntasAtualizadas })
            }}
            onMoveUp={() => onMoveQuestion(index, -1)}
            onMoveDown={() => onMoveQuestion(index, 1)}
          />
        ))}
      </div>
    </div>
  )
}
