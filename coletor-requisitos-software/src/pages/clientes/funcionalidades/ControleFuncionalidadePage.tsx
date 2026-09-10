/* eslint-disable react-hooks/incompatible-library */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { FormCard } from '@/components/cards'
import { storageService } from '@/services/storageService'
import type { Funcionalidade } from '@/types'
import './ControleFuncionalidadePage.css'
import { Button, ButtonLink } from '@/components/buttons'

const usuarioSchema = z.object({
  nome: z.string().trim().min(1, 'O nome do usuário é obrigatório.'),
  acoes: z.array(z.string().trim().min(1, 'A ação não pode ficar vazia.')).min(1, 'Informe pelo menos uma ação.'),
})

const entidadeSchema = z.object({
  nome: z.string().trim().min(1, 'O nome da entidade é obrigatório.'),
  campos: z.array(z.string().trim().min(1, 'Cada campo não pode ficar vazio.')).min(1, 'Informe pelo menos um campo.'),
})

const schema = z.object({
  nome: z.string().trim().min(1, 'O nome da funcionalidade é obrigatório.'),
  descricao: z.string().trim().min(1, 'A descrição é obrigatória.'),
  pontosImportantes: z.string().trim().min(1, 'Os pontos importantes são obrigatórios.'),
  usuarios: z.array(usuarioSchema).min(1, 'Informe pelo menos um usuário.'),
  entidades: z.array(entidadeSchema).min(1, 'Informe pelo menos uma entidade.'),
})

type FormValues = z.infer<typeof schema>
type Relationship = { id: string; origemId: string; origem: string; destinoId: string; destino: string }
type EntityPosition = { x: number; y: number }

const emptyUsuario = () => ({ nome: '', acoes: [''] })
const emptyEntidade = () => ({ nome: '', campos: [''] })

const getDefaultEntityPosition = (index: number): EntityPosition => ({
  x: 20 + (index % 2) * 180,
  y: 20 + Math.floor(index / 2) * 120,
})

export default function NovaFuncionalidadePage() {
  const { clienteId, aplicacaoId, funcionalidadeId } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(funcionalidadeId)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [loadedFuncionalidade, setLoadedFuncionalidade] = useState<Funcionalidade | null>(null)
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null)
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [entityPositions, setEntityPositions] = useState<Record<string, EntityPosition>>({})
  const boardRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      descricao: '',
      pontosImportantes: '',
      usuarios: [emptyUsuario()],
      entidades: [emptyEntidade()],
    },
  })

  const usuariosField = useFieldArray({ control: form.control, name: 'usuarios' })
  const entidadesField = useFieldArray({ control: form.control, name: 'entidades' })

  useEffect(() => {
    const carregarFuncionalidade = async () => {
      if (!clienteId || !aplicacaoId || !funcionalidadeId) {
        setIsLoading(false)
        setLoadedFuncionalidade(null)
        return
      }

      const funcionalidade = await storageService.buscarFuncionalidade(clienteId, aplicacaoId, funcionalidadeId)
      if (!funcionalidade) {
        navigate(`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`, { replace: true })
        return
      }

      setLoadedFuncionalidade(funcionalidade)
      form.reset({
        nome: funcionalidade.nome,
        descricao: funcionalidade.descricao,
        pontosImportantes: funcionalidade.pontosImportantes,
        usuarios: funcionalidade.usuarios.length ? funcionalidade.usuarios : [emptyUsuario()],
        entidades: funcionalidade.entidades.length ? funcionalidade.entidades.map((entidade) => ({
          nome: entidade.nome,
          campos: entidade.campos.length ? entidade.campos : [''],
        })) : [emptyEntidade()],
      })
      setIsLoading(false)
    }

    carregarFuncionalidade()
  }, [aplicacaoId, clienteId, funcionalidadeId, form, navigate])

  useEffect(() => {
    const fieldIds = entidadesField.fields.map((field) => field.id)
    setEntityPositions((prev) => {
      const next: Record<string, EntityPosition> = {}
      fieldIds.forEach((fieldId, index) => {
        next[fieldId] = prev[fieldId] ?? getDefaultEntityPosition(index)
      })
      return next
    })
  }, [entidadesField.fields])

  useEffect(() => {
    if (!loadedFuncionalidade) {
      setRelationships([])
      return
    }

    const fieldIds = entidadesField.fields.map((field) => field.id)
    const fieldIndexByEntityId = new Map<string, number>()
    loadedFuncionalidade.entidades.forEach((entidade, index) => {
      const fieldId = fieldIds[index]
      if (fieldId) {
        fieldIndexByEntityId.set(entidade.id, index)
      }
    })

    const nextRelationships = loadedFuncionalidade.entidades.flatMap((entidade) =>
      entidade.relacionamentos
        .map((relacionamento) => {
          const origemIndex = fieldIndexByEntityId.get(relacionamento.entidadeOrigemId || entidade.id)
          const destinoIndex = fieldIndexByEntityId.get(relacionamento.entidadeDestinoId)
          
          if (origemIndex === undefined || destinoIndex === undefined) {
            return null
          }
          
          const origemId = fieldIds[origemIndex]
          const destinoId = fieldIds[destinoIndex]
          const origem = loadedFuncionalidade.entidades[origemIndex ?? -1]?.nome || ''
          const destino = loadedFuncionalidade.entidades[destinoIndex ?? -1]?.nome || ''

          if (!origemId || !destinoId || origemId === destinoId) {
            return null
          }

          return {
            id: `${origemId}-${destinoId}`,
            origemId,
            origem,
            destinoId,
            destino,
          }
        })
        .filter((relacionamento): relacionamento is Relationship => relacionamento !== null),
    )

    setRelationships(nextRelationships)
  }, [loadedFuncionalidade, entidadesField.fields])

  useEffect(() => {
    const validFieldIds = new Set(entidadesField.fields.map((field) => field.id))
    setRelationships((prev) => prev.filter((rel) => validFieldIds.has(rel.origemId) && validFieldIds.has(rel.destinoId)))
  }, [entidadesField.fields])

  const deleteSelectedRelationship = () => {
    if (!selectedRelationshipId) {
      return
    }

    setRelationships((prev) => prev.filter((rel) => rel.id !== selectedRelationshipId))
    setSelectedRelationshipId(null)
  }

  const handleEntitySelection = (fieldId: string) => {
    if (!selectedEntityId) {
      setSelectedEntityId(fieldId)
      setSelectedRelationshipId(null)
      return
    }

    if (selectedEntityId === fieldId) {
      setSelectedEntityId(null)
      return
    }

    const relationshipExists = relationships.some(
      (relationship) =>
        (relationship.origemId === selectedEntityId && relationship.destinoId === fieldId) ||
        (relationship.origemId === fieldId && relationship.destinoId === selectedEntityId),
    )

    if (!relationshipExists) {
      setRelationships((prev) => [
        ...prev,
        {
          id: `${selectedEntityId}-${fieldId}`,
          origemId: selectedEntityId,
          origem: entidadesField.fields.find((field) => field.id === selectedEntityId)?.nome || '',
          destinoId: fieldId,
          destino: entidadesField.fields.find((field) => field.id === fieldId)?.nome || '',
        },
      ])
    }

    setSelectedEntityId(fieldId)
    setSelectedRelationshipId(null)
  }

  const handleNodePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    fieldId: string,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    const boardElement = boardRef.current
    const nodeElement = event.currentTarget.parentElement

    if (!boardElement || !nodeElement) {
      return
    }

    const boardRect = boardElement.getBoundingClientRect()
    const nodeRect = nodeElement.getBoundingClientRect()

    dragRef.current = {
      id: fieldId,
      offsetX: event.clientX - nodeRect.left,
      offsetY: event.clientY - nodeRect.top,
    }

    setSelectedEntityId(fieldId)
    setSelectedRelationshipId(null)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragRef.current) {
        return
      }

      const x = moveEvent.clientX - boardRect.left - dragRef.current.offsetX
      const y = moveEvent.clientY - boardRect.top - dragRef.current.offsetY

      setEntityPositions((prev) => ({
        ...prev,
        [fieldId]: {
          x: Math.max(12, Math.min(boardElement.clientWidth - 170, x)),
          y: Math.max(12, Math.min(boardElement.clientHeight - 56, y)),
        },
      }))
    }

    const handlePointerUp = () => {
      dragRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const onSubmit = async (values: FormValues) => {
    if (!clienteId || !aplicacaoId) {
      navigate('/', { replace: true })
      return
    }

    const entityIdsByFieldId = new Map<string, string>()
    const entidadesPayload = values.entidades.map((entidade, index) => {
      const fieldId = entidadesField.fields[index]?.id
      const existingEntityId = loadedFuncionalidade?.entidades[index]?.id
      const finalEntityId = fieldId ? entityIdsByFieldId.get(fieldId) ?? existingEntityId ?? crypto.randomUUID() : crypto.randomUUID()

      if (fieldId) {
        entityIdsByFieldId.set(fieldId, finalEntityId)
      }

      return {
        id: finalEntityId,
        nome: entidade.nome.trim(),
        campos: entidade.campos.filter((campo) => campo.trim().length > 0),
        relacionamentos: [] as Array<{ entidadeOrigemId: string; entidadeDestinoId: string }>,
      }
    })

    const relacionamentosPorEntidade = entidadesPayload.map((entidade) => ({
      entidadeId: entidade.id,
      relacionamentos: relationships
        .map((relationship) => {
          const entidadeOrigemId = entityIdsByFieldId.get(relationship.origemId)
          const entidadeDestinoId = entityIdsByFieldId.get(relationship.destinoId)

          if (!entidadeOrigemId || !entidadeDestinoId) {
            return null
          }

          if (entidadeOrigemId !== entidade.id) {
            return null
          }

          return {
            entidadeOrigemId,
            entidadeOrigem: entidadesPayload.find((entidade) => entidade.id === entidadeOrigemId)?.nome ?? '',
            entidadeDestinoId,
            entidadeDestino: entidadesPayload.find((entidade) => entidade.id === entidadeDestinoId)?.nome ?? '',
          }
        })
        .filter(
          (item): item is {
            entidadeOrigemId: string
            entidadeOrigem: string
            entidadeDestinoId: string
            entidadeDestino: string
          } => item !== null,
        ),
    }))

    const payload = {
      id: isEditMode && funcionalidadeId ? funcionalidadeId : crypto.randomUUID(),
      nome: values.nome.trim(),
      descricao: values.descricao.trim(),
      pontosImportantes: values.pontosImportantes.trim(),
      usuarios: values.usuarios.map((usuario) => ({
        id: crypto.randomUUID(),
        nome: usuario.nome.trim(),
        acoes: usuario.acoes.filter((acao) => acao.trim().length > 0),
      })),
      entidades: entidadesPayload.map((entidade) => {
        const relacoes = relacionamentosPorEntidade.find((relacao) => relacao.entidadeId === entidade.id)?.relacionamentos ?? []

        return {
          ...entidade,
          relacionamentos: relacoes,
        }
      }),
    }

    if (isEditMode && funcionalidadeId) {
      await storageService.atualizarFuncionalidade(clienteId, aplicacaoId, funcionalidadeId, payload)
    } else {
      await storageService.adicionarFuncionalidade(clienteId, aplicacaoId, payload)
    }

    navigate(`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`)
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Funcionalidade</p>
          <h1>{isEditMode ? 'Editar Funcionalidade' : 'Nova Funcionalidade'}</h1>
        </div>
        <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} variant="secondary">
          Voltar
        </ButtonLink>
      </div>

      <FormCard onSubmit={form.handleSubmit(onSubmit)}>
        <div className="panel-section">
          <h3>Bloco 1 – Informações</h3>
          <label>
            Nome
            <input {...form.register('nome')} placeholder="Digite o nome da funcionalidade" />
            {form.formState.errors.nome && <span className="field-error">{form.formState.errors.nome.message}</span>}
          </label>
          <label>
            Descrição
            <textarea rows={4} {...form.register('descricao')} placeholder="Descreva a funcionalidade" />
            {form.formState.errors.descricao && <span className="field-error">{form.formState.errors.descricao.message}</span>}
          </label>
          <label>
            Pontos importantes
            <textarea rows={3} {...form.register('pontosImportantes')} placeholder="Liste regras, critérios e observações" />
            {form.formState.errors.pontosImportantes && <span className="field-error">{form.formState.errors.pontosImportantes.message}</span>}
          </label>
        </div>

        <div className="panel-section">
          <h3>Bloco 2 – Usuários</h3>
          {usuariosField.fields.map((field, index) => (
            <div key={field.id} className="nested-group">
              <label>
                Nome do usuário
                <input {...form.register(`usuarios.${index}.nome` as const)} placeholder="Ex: Administrador" />
              </label>
              <label>
                Ações (separadas por vírgula)
                <input
                  {...form.register(`usuarios.${index}.acoes.0` as const)}
                  placeholder="Ex: criar, editar"
                />
              </label>
              <Button type="button" className="ghost-button" onClick={() => usuariosField.remove(index)}>
                Remover usuário
              </Button>
            </div>
          ))}
          <Button type="button" className="secondary-button" onClick={() => usuariosField.append(emptyUsuario())}>
            Adicionar usuário
          </Button>
        </div>

        <div className="panel-section">
          <h3>Bloco 3 – Entidades</h3>
          {entidadesField.fields.map((field, index) => (
            <div key={field.id} className="nested-group">
              <label>
                Nome da entidade
                <input {...form.register(`entidades.${index}.nome` as const)} placeholder="Ex: Usuário" />
              </label>
              <label>
                Campos (separados por vírgula)
                <input
                  {...form.register(`entidades.${index}.campos.0` as const)}
                  placeholder="Ex: nome, email"
                />
              </label>
              <Button type="button" className="ghost-button" onClick={() => entidadesField.remove(index)}>
                Remover entidade
              </Button>
            </div>
          ))}
          <Button type="button" className="secondary-button" onClick={() => entidadesField.append(emptyEntidade())}>
            Adicionar entidade
          </Button>
        </div>

        <div className="panel-section">
          <h3>Bloco 4 – Relacionamentos</h3>
          <div className="relationship-editor">
            <div className="relationship-board" ref={boardRef}>
              <svg className="relationship-svg" viewBox="0 0 640 320" preserveAspectRatio="none" aria-label="Relacionamentos entre entidades">
                {relationships.map((relationship) => {
                  const start = entityPositions[relationship.origemId] ?? { x: 20, y: 20 }
                  const end = entityPositions[relationship.destinoId] ?? { x: 220, y: 90 }
                  const isSelected = relationship.id === selectedRelationshipId

                  return (
                    <line
                      key={relationship.id}
                      x1={start.x + 88}
                      y1={start.y + 28}
                      x2={end.x + 88}
                      y2={end.y + 28}
                      className={`relationship-line ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedRelationshipId(relationship.id)
                        setSelectedEntityId(null)
                      }}
                    />
                  )
                })}
              </svg>

              {entidadesField.fields.map((field, index) => {
                const position = entityPositions[field.id] ?? getDefaultEntityPosition(index)
                const labelName = form.watch(`entidades.${index}.nome` as const) || `Entidade ${index + 1}`
                const isSelected = selectedEntityId === field.id

                return (
                  <div
                    key={field.id}
                    className={`relationship-node ${isSelected ? 'selected' : ''}`}
                    style={{ left: `${position.x}px`, top: `${position.y}px` }}
                    onClick={() => handleEntitySelection(field.id)}
                  >
                    <Button
                      type="button"
                      className="relationship-node__handle"
                      aria-label="Mover entidade"
                      onPointerDown={(event) => handleNodePointerDown(event, field.id)}
                    >↕↔
                    </Button>
                    <span className="relationship-node__label">{labelName}</span>
                  </div>
                )
              })}
            </div>

            <div className="relationship-actions">
              <Button
                type="button"
                variant="danger"
                disabled={!selectedRelationshipId}
                onClick={deleteSelectedRelationship}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>

        <div className="button-row">
          <Button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : isEditMode ? 'Salvar alterações' : 'Salvar funcionalidade'}
          </Button>
          <ButtonLink to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} variant="ghost">
            Cancelar
          </ButtonLink>
        </div>
      </FormCard>
    </section>
  )
}
