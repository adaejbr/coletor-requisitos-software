/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '../buttons'
import { FormCard } from '../cards'
import type { FormularioBriefing, PerguntaBriefing, SecaoBriefing } from '@/types/briefing'
import { validarConfiguracaoFormularioBriefing } from '@/utils/validators'
import './Briefing.css'
import { SecaoBriefingBuilder } from './SecaoBriefingBuilder'

type FormularioBriefingBuilderProps = {
  initialFormulario: FormularioBriefing
  onSave: (formulario: FormularioBriefing) => Promise<void> | void
  onCancel?: () => void
}

const criarPerguntaPadrao = (): PerguntaBriefing => ({
  id: uuidv4(),
  enunciado: '',
  tipo: 'texto',
  obrigatoria: false,
  ordem: 1,
  ativo: true,
})

const criarSecaoPadrao = (): SecaoBriefing => ({
  id: uuidv4(),
  titulo: '',
  ordem: 1,
  ativo: true,
  perguntas: [criarPerguntaPadrao()],
})

const serializarFormulario = (formulario: FormularioBriefing): FormularioBriefing => ({
  ...formulario,
  atualizadoEm: new Date().toISOString(),
  secoes: formulario.secoes.map((secao, secaoIndex) => ({
    ...secao,
    ordem: secaoIndex + 1,
    perguntas: secao.perguntas.map((pergunta, perguntaIndex) => ({
      ...pergunta,
      ordem: perguntaIndex + 1,
    })),
  })),
})

export function FormularioBriefingBuilder({
  initialFormulario,
  onSave,
  onCancel,
}: FormularioBriefingBuilderProps) {
  const [formulario, setFormulario] = useState<FormularioBriefing>(initialFormulario)

  const errosValidacao = useMemo(
    () => validarConfiguracaoFormularioBriefing(formulario),
    [formulario],
  )

  useEffect(() => {
    setFormulario(initialFormulario)
  }, [initialFormulario])

  const atualizarFormulario = (atualizacao: Partial<FormularioBriefing>) => {
    setFormulario((prev) => ({ ...prev, ...atualizacao }))
  }

  const atualizarSecao = (secaoId: string, secaoAtualizada: SecaoBriefing) => {
    setFormulario((prev) => ({
      ...prev,
      secoes: prev.secoes.map((secao) => (secao.id === secaoId ? secaoAtualizada : secao)),
    }))
  }

  const adicionarSecao = () => {
    setFormulario((prev) => ({
      ...prev,
      secoes: [...prev.secoes, criarSecaoPadrao()],
    }))
  }

  const toggleSecaoStatus = (secaoId: string) => {
    setFormulario((prev) => ({
      ...prev,
      secoes: prev.secoes.map((secao) =>
        secao.id === secaoId ? { ...secao, ativo: !secao.ativo } : secao,
      ),
    }))
  }

  const adicionarPergunta = (secaoId: string) => {
    setFormulario((prev) => ({
      ...prev,
      secoes: prev.secoes.map((secao) =>
        secao.id === secaoId
          ? { ...secao, perguntas: [...secao.perguntas, criarPerguntaPadrao()] }
          : secao,
      ),
    }))
  }

  const moverSecao = (indice: number, direcao: -1 | 1) => {
    setFormulario((prev) => {
      const prox = [...prev.secoes]
      const alvo = indice + direcao
      if (alvo < 0 || alvo >= prox.length) return prev

      ;[prox[indice], prox[alvo]] = [prox[alvo], prox[indice]]
      return { ...prev, secoes: prox }
    })
  }

  const moverPergunta = (secaoId: string, indicePergunta: number, direcao: -1 | 1) => {
    setFormulario((prev) => ({
      ...prev,
      secoes: prev.secoes.map((secao) => {
        if (secao.id !== secaoId) return secao

        const perguntas = [...secao.perguntas]
        const alvo = indicePergunta + direcao
        if (alvo < 0 || alvo >= perguntas.length) return secao

        ;[perguntas[indicePergunta], perguntas[alvo]] = [perguntas[alvo], perguntas[indicePergunta]]
        return { ...secao, perguntas }
      }),
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const erros = validarConfiguracaoFormularioBriefing(formulario)

    if (formulario.ativo && erros.length > 0) {
      return
    }

    const formularioFinal = serializarFormulario(formulario)
    await onSave(formularioFinal)
  }

  return (
    <FormCard onSubmit={handleSubmit}>
      <label>
        Nome do formulário
        <input
          value={formulario.nome}
          onChange={(event) => atualizarFormulario({ nome: event.target.value })}
          placeholder="Ex.: Briefing de onboarding"
          required
        />
      </label>

      <label>
        Descrição
        <textarea
          value={formulario.descricao ?? ''}
          onChange={(event) => atualizarFormulario({ descricao: event.target.value || undefined })}
          rows={3}
          placeholder="Descreva o objetivo deste formulário"
        />
      </label>

      <label>
        Status
        <select
          value={String(formulario.ativo)}
          onChange={(event) => atualizarFormulario({ ativo: event.target.value === 'true' })}
        >
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </label>

      {!formulario.ativo && (
        <div className="info-panel" role="status">
          <strong>Este formulário está inativo.</strong>
          <span>Ele não aparece para preenchimento até ser reativado.</span>
        </div>
      )}

      {formulario.ativo && errosValidacao.length > 0 && (
        <div className="validation-panel" role="alert">
          <strong>Não foi possível ativar este formulário:</strong>
          <ul>
            {errosValidacao.map((erro) => (
              <li key={erro}>{erro}</li>
            ))}
          </ul>
        </div>
      )}

      {formulario.ativo && errosValidacao.length === 0 && (
        <div className="success-panel" role="status">
          <strong>Formulário pronto para uso.</strong>
          <span>Seções e perguntas válidas; este formulário pode ser salvo e disponibilizado.</span>
        </div>
      )}

      <div className="button-row">
        <Button type="button" variant="secondary" onClick={adicionarSecao}>
          + Adicionar seção
        </Button>
      </div>

      <div className="form-builder-stack">
        {formulario.secoes.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma seção cadastrada. Adicione uma seção para começar.</p>
          </div>
        )}

        {formulario.secoes.map((secao, index) => (
          <SecaoBriefingBuilder
            key={secao.id}
            secao={secao}
            onUpdate={(secaoAtualizada) => atualizarSecao(secao.id, secaoAtualizada)}
            onAddPergunta={() => adicionarPergunta(secao.id)}
            onToggleStatus={() => toggleSecaoStatus(secao.id)}
            onMoveUp={() => moverSecao(index, -1)}
            onMoveDown={() => moverSecao(index, 1)}
            onMoveQuestion={(indicePergunta, direcao) => moverPergunta(secao.id, indicePergunta, direcao)}
          />
        ))}
      </div>

      <div className="button-row">
        <Button type="submit" variant="primary" disabled={formulario.ativo && errosValidacao.length > 0}>
          Salvar formulário
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </FormCard>
  )
}
