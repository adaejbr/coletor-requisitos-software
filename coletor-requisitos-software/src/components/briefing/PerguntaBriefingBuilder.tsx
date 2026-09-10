import { Button } from '../buttons'
import type { PerguntaBriefing, TipoPerguntaBriefing } from '@/types/briefing'

const tiposPergunta: TipoPerguntaBriefing[] = [
  'texto',
  'textarea',
  'numero',
  'data',
  'select',
  'radio',
  'checkbox',
  'booleano',
]

type PerguntaBriefingBuilderProps = {
  pergunta: PerguntaBriefing
  onUpdate: (perguntaAtualizada: PerguntaBriefing) => void
  onToggleStatus: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function PerguntaBriefingBuilder({
  pergunta,
  onUpdate,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
}: PerguntaBriefingBuilderProps) {
  const opcoesTexto = (pergunta.opcoes ?? [])
    .map((opcao) => `${opcao.label}|${opcao.valor}`)
    .join('\n')

  const atualizarOpcaoTexto = (valor: string) => {
    const linhas = valor
      .split('\n')
      .map((linha) => linha.trim())
      .filter(Boolean)

    const opcoes = linhas.map((linha, index) => {
      const [label, valorOpcao = linha] = linha.split('|')
      return {
        id: pergunta.opcoes?.[index]?.id ?? `op-${Date.now()}-${index}`,
        label: label?.trim() || linha.trim(),
        valor: valorOpcao.trim() || label?.trim() || linha.trim(),
      }
    })

    onUpdate({
      ...pergunta,
      opcoes,
    })
  }

  return (
    <div className="nested-group">
      <div className="button-row">
        <span className="muted-text">{pergunta.ativo ? 'Pergunta ativa' : 'Pergunta inativa'}</span>
        <Button type="button" variant={pergunta.ativo ? 'ghost' : 'secondary'} onClick={onToggleStatus}>
          {pergunta.ativo ? 'Inativar' : 'Reativar'}
        </Button>
        <Button type="button" variant="ghost" onClick={onMoveUp}>
          ↑
        </Button>
        <Button type="button" variant="ghost" onClick={onMoveDown}>
          ↓
        </Button>
      </div>

      <label>
        Enunciado
        <input
          value={pergunta.enunciado}
          onChange={(event) => onUpdate({ ...pergunta, enunciado: event.target.value })}
          placeholder="Ex.: Qual é o objetivo principal?"
        />
      </label>

      <label>
        Descrição de ajuda
        <input
          value={pergunta.descricaoAjuda ?? ''}
          onChange={(event) => onUpdate({ ...pergunta, descricaoAjuda: event.target.value || undefined })}
          placeholder="Texto complementar"
        />
      </label>

      <div className="button-row">
        <label style={{ flex: 1 }}>
          Tipo
          <select
            value={pergunta.tipo}
            onChange={(event) =>
              onUpdate({
                ...pergunta,
                tipo: event.target.value as TipoPerguntaBriefing,
              })
            }
          >
            {tiposPergunta.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </label>

        <label style={{ minWidth: 120 }}>
          Obrigatória
          <select
            value={String(pergunta.obrigatoria)}
            onChange={(event) => onUpdate({ ...pergunta, obrigatoria: event.target.value === 'true' })}
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
      </div>

      <label>
        Placeholder
        <input
          value={pergunta.placeholder ?? ''}
          onChange={(event) => onUpdate({ ...pergunta, placeholder: event.target.value || undefined })}
          placeholder="Texto exibido como exemplo"
        />
      </label>

      {(pergunta.tipo === 'select' || pergunta.tipo === 'radio' || pergunta.tipo === 'checkbox') && (
        <label>
          Opções (uma por linha; use label|valor)
          <textarea
            value={opcoesTexto}
            onChange={(event) => atualizarOpcaoTexto(event.target.value)}
            rows={4}
            placeholder="Ex.: Sim|sim\nNão|nao"
          />
        </label>
      )}
    </div>
  )
}
