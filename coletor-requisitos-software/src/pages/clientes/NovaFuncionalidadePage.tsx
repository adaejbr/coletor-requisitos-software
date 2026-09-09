import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { storageService } from '../../services/storageService'

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

const emptyUsuario = () => ({ nome: '', acoes: [''] })
const emptyEntidade = () => ({ nome: '', campos: [''] })

export default function NovaFuncionalidadePage() {
  const { clienteId, aplicacaoId, funcionalidadeId } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(funcionalidadeId)
  const [isLoading, setIsLoading] = useState(isEditMode)

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
        return
      }

      const funcionalidade = await storageService.buscarFuncionalidade(clienteId, aplicacaoId, funcionalidadeId)
      if (!funcionalidade) {
        navigate(`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`, { replace: true })
        return
      }

      form.reset({
        nome: funcionalidade.nome,
        descricao: funcionalidade.descricao,
        pontosImportantes: funcionalidade.pontosImportantes,
        usuarios: funcionalidade.usuarios.length ? funcionalidade.usuarios : [emptyUsuario()],
        entidades: funcionalidade.entidades.length ? funcionalidade.entidades : [emptyEntidade()],
      })
      setIsLoading(false)
    }

    carregarFuncionalidade()
  }, [aplicacaoId, clienteId, funcionalidadeId, form, navigate])

  const onSubmit = async (values: FormValues) => {
    if (!clienteId || !aplicacaoId) {
      navigate('/', { replace: true })
      return
    }

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
      entidades: values.entidades.map((entidade) => ({
        id: crypto.randomUUID(),
        nome: entidade.nome.trim(),
        campos: entidade.campos.filter((campo) => campo.trim().length > 0),
        relacionamentos: [],
      })),
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
        <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} className="secondary-button">
          Voltar
        </Link>
      </div>

      <form className="form-card" onSubmit={form.handleSubmit(onSubmit)}>
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
              <button type="button" className="ghost-button" onClick={() => usuariosField.remove(index)}>
                Remover usuário
              </button>
            </div>
          ))}
          <button type="button" className="secondary-button" onClick={() => usuariosField.append(emptyUsuario())}>
            Adicionar usuário
          </button>
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
              <button type="button" className="ghost-button" onClick={() => entidadesField.remove(index)}>
                Remover entidade
              </button>
            </div>
          ))}
          <button type="button" className="secondary-button" onClick={() => entidadesField.append(emptyEntidade())}>
            Adicionar entidade
          </button>
        </div>

        <div className="panel-section">
          <h3>Bloco 4 – Relacionamentos</h3>
          <p className="muted-text">Os relacionamentos podem ser definidos em uma próxima etapa de refinamento visual.</p>
        </div>

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : isEditMode ? 'Salvar alterações' : 'Salvar funcionalidade'}
          </button>
          <Link to={`/clientes/${clienteId}/aplicacoes/${aplicacaoId}`} className="ghost-button">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}
