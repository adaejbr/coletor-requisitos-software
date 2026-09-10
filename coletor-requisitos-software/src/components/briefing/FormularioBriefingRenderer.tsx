/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '../buttons'
import { useToast } from '../ToastProvider'
import type { FormularioBriefing, RespostaBriefing } from '@/types/briefing'
import { validarRespostasObrigatoriasBriefing } from '@/utils/validators'
import './Briefing.css'
import { SecaoBriefingRenderer } from './SecaoBriefingRenderer'

type FormularioBriefingRendererProps = {
  formulario: FormularioBriefing
  respostaInicial?: RespostaBriefing | null
  idCliente: string
  idAplicacao: string
  onSalvarRascunho: (resposta: RespostaBriefing) => Promise<RespostaBriefing>
  onConcluir: (resposta: RespostaBriefing) => Promise<RespostaBriefing>
}

export function FormularioBriefingRenderer({
  formulario,
  respostaInicial,
  idCliente,
  idAplicacao,
  onSalvarRascunho,
  onConcluir,
}: FormularioBriefingRendererProps) {
  const { showToast } = useToast()
  const [respostas, setRespostas] = useState<Record<string, unknown>>(respostaInicial?.respostas ?? {})
  const [salvando, setSalvando] = useState(false)
  const [erroValidacao, setErroValidacao] = useState<string | null>(null)
  const estadoResposta = respostaInicial?.status ?? 'novo'

  useEffect(() => {
    setRespostas(respostaInicial?.respostas ?? {})
    setErroValidacao(null)
  }, [respostaInicial])

  const secoesAtivas = useMemo(
    () => [...formulario.secoes].filter((secao) => secao.ativo).sort((a, b) => a.ordem - b.ordem),
    [formulario.secoes],
  )

  const atualizarResposta = (idPergunta: string, valor: unknown) => {
    setRespostas((prev) => ({ ...prev, [idPergunta]: valor }))
    setErroValidacao(null)
  }

  const construirResposta = (status: 'rascunho' | 'concluido') => {
    const agora = new Date().toISOString()
    const respostaBase: RespostaBriefing = respostaInicial ?? {
      id: uuidv4(),
      idCliente,
      idAplicacao,
      idFormulario: formulario.id,
      versaoFormulario: formulario.versao,
      snapshotFormulario: formulario,
      respostas: {},
      status: 'rascunho',
      criadoEm: agora,
      atualizadoEm: agora,
    }

    return {
      ...respostaBase,
      idCliente,
      idAplicacao,
      idFormulario: formulario.id,
      versaoFormulario: formulario.versao,
      snapshotFormulario: respostaBase.snapshotFormulario ?? formulario,
      respostas,
      status,
      atualizadoEm: agora,
      concluidoEm: status === 'concluido' ? respostaBase.concluidoEm ?? agora : undefined,
    } satisfies RespostaBriefing
  }

  const handleSalvarRascunho = async () => {
    setSalvando(true)

    try {
      const resposta = construirResposta('rascunho')
      await onSalvarRascunho(resposta)
      showToast('Rascunho salvo com sucesso.')
    } catch (error) {
      console.error(error)
      showToast('Não foi possível salvar o rascunho.')
    } finally {
      setSalvando(false)
    }
  }

  const handleConcluir = async () => {
    const erros = validarRespostasObrigatoriasBriefing(formulario, respostas)

    if (erros.length > 0) {
      setErroValidacao(erros[0])
      showToast('Há campos obrigatórios que precisam ser preenchidos.')
      return
    }

    setSalvando(true)

    try {
      const resposta = construirResposta('concluido')
      await onConcluir(resposta)
      showToast('Resposta concluída com sucesso.')
    } catch (error) {
      console.error(error)
      showToast('Não foi possível concluir a resposta.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="briefing-panel">
      <header className="briefing-panel__header">
        <div>
          <p className="eyebrow">Briefing</p>
          <h2>{formulario.nome}</h2>
          <p className="muted-text">
            {estadoResposta === 'rascunho' && 'Resposta em rascunho'}
            {estadoResposta === 'concluido' && 'Resposta concluída'}
            {estadoResposta === 'novo' && 'Novo preenchimento'}
          </p>
        </div>
        <div className="button-row">
          <Button type="button" variant="secondary" onClick={handleSalvarRascunho} disabled={salvando}>
            Salvar rascunho
          </Button>
          <Button type="button" variant="primary" onClick={handleConcluir} disabled={salvando}>
            Concluir
          </Button>
        </div>
      </header>

      {formulario.descricao && <p className="muted-text">{formulario.descricao}</p>}

      {erroValidacao && (
        <div className="validation-panel" role="alert">
          <strong>Preenchimento incompleto:</strong>
          <span>{erroValidacao}</span>
        </div>
      )}

      <div className="briefing-form">
        {secoesAtivas.length === 0 && <div className="empty-state"><p>Este formulário não possui seções ativas.</p></div>}

        {secoesAtivas.map((secao) => (
          <SecaoBriefingRenderer
            key={secao.id}
            secao={secao}
            respostas={respostas}
            onChangePergunta={atualizarResposta}
          />
        ))}
      </div>
    </section>
  )
}
