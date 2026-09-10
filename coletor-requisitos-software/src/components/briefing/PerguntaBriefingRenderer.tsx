import type { PerguntaBriefing } from '../../types/briefing'

type PerguntaBriefingRendererProps = {
  pergunta: PerguntaBriefing
  valor: unknown
  onChange: (valor: unknown) => void
}

export function PerguntaBriefingRenderer({ pergunta, valor, onChange }: PerguntaBriefingRendererProps) {
  const valorAtual = valor ?? (pergunta.tipo === 'checkbox' ? [] : pergunta.tipo === 'booleano' ? false : '')

  if (pergunta.tipo === 'textarea') {
    return (
      <label className="briefing-question">
        <span>
          {pergunta.enunciado}
          {pergunta.obrigatoria && <strong className="required-marker"> *</strong>}
        </span>
        <textarea
          value={String(valorAtual ?? '')}
          onChange={(event) => onChange(event.target.value)}
          placeholder={pergunta.placeholder}
          rows={4}
        />
        {pergunta.descricaoAjuda && <small>{pergunta.descricaoAjuda}</small>}
      </label>
    )
  }

  if (pergunta.tipo === 'select') {
    return (
      <label className="briefing-question">
        <span>
          {pergunta.enunciado}
          {pergunta.obrigatoria && <strong className="required-marker"> *</strong>}
        </span>
        <select value={String(valorAtual ?? '')} onChange={(event) => onChange(event.target.value)}>
          <option value="">Selecione...</option>
          {(pergunta.opcoes ?? []).map((opcao) => (
            <option key={opcao.id} value={opcao.valor}>
              {opcao.label}
            </option>
          ))}
        </select>
        {pergunta.descricaoAjuda && <small>{pergunta.descricaoAjuda}</small>}
      </label>
    )
  }

  if (pergunta.tipo === 'radio') {
    return (
      <fieldset className="briefing-question briefing-question--group">
        <legend>
          {pergunta.enunciado}
          {pergunta.obrigatoria && <strong className="required-marker"> *</strong>}
        </legend>
        <div className="option-stack">
          {(pergunta.opcoes ?? []).map((opcao) => (
            <label key={opcao.id} className="option-row">
              <input
                type="radio"
                name={pergunta.id}
                checked={String(valorAtual ?? '') === String(opcao.valor)}
                onChange={() => onChange(opcao.valor)}
              />
              <span>{opcao.label}</span>
            </label>
          ))}
        </div>
        {pergunta.descricaoAjuda && <small>{pergunta.descricaoAjuda}</small>}
      </fieldset>
    )
  }

  if (pergunta.tipo === 'checkbox') {
    const selecionados = Array.isArray(valorAtual) ? valorAtual : []

    return (
      <fieldset className="briefing-question briefing-question--group">
        <legend>
          {pergunta.enunciado}
          {pergunta.obrigatoria && <strong className="required-marker"> *</strong>}
        </legend>
        <div className="option-stack">
          {(pergunta.opcoes ?? []).map((opcao) => {
            const checked = selecionados.includes(opcao.valor)

            return (
              <label key={opcao.id} className="option-row">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selecionados.filter((valor) => valor !== opcao.valor)
                      : [...selecionados, opcao.valor]

                    onChange(next)
                  }}
                />
                <span>{opcao.label}</span>
              </label>
            )
          })}
        </div>
        {pergunta.descricaoAjuda && <small>{pergunta.descricaoAjuda}</small>}
      </fieldset>
    )
  }

  if (pergunta.tipo === 'booleano') {
    return (
      <fieldset className="briefing-question briefing-question--group">
        <legend>
          {pergunta.enunciado}
          {pergunta.obrigatoria && <strong className="required-marker"> *</strong>}
        </legend>
        <div className="option-stack">
          <label className="option-row">
            <input
              type="radio"
              name={pergunta.id}
              checked={valorAtual === true}
              onChange={() => onChange(true)}
            />
            <span>Sim</span>
          </label>
          <label className="option-row">
            <input
              type="radio"
              name={pergunta.id}
              checked={valorAtual === false}
              onChange={() => onChange(false)}
            />
            <span>Não</span>
          </label>
        </div>
        {pergunta.descricaoAjuda && <small>{pergunta.descricaoAjuda}</small>}
      </fieldset>
    )
  }

  if (pergunta.tipo === 'numero') {
    return (
      <label className="briefing-question">
        <span>
          {pergunta.enunciado}
          {pergunta.obrigatoria && <strong className="required-marker"> *</strong>}
        </span>
        <input
          type="number"
          value={valorAtual === '' || valorAtual === null || typeof valorAtual === 'undefined' ? '' : Number(valorAtual)}
          onChange={(event) => onChange(Number(event.target.value))}
          placeholder={pergunta.placeholder}
        />
        {pergunta.descricaoAjuda && <small>{pergunta.descricaoAjuda}</small>}
      </label>
    )
  }

  return (
    <label className="briefing-question">
      <span>
        {pergunta.enunciado}
        {pergunta.obrigatoria && <strong className="required-marker"> *</strong>}
      </span>
      <input
        type={pergunta.tipo === 'data' ? 'date' : 'text'}
        value={typeof valorAtual === 'string' || typeof valorAtual === 'number' ? String(valorAtual) : ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={pergunta.placeholder}
      />
      {pergunta.descricaoAjuda && <small>{pergunta.descricaoAjuda}</small>}
    </label>
  )
}
