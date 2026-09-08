import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { storageService } from '../services/storageService'

const schema = z.object({
  nome: z.string().trim().min(1, 'O nome da aplicação é obrigatório.'),
})

type FormValues = z.infer<typeof schema>

export default function NovaAplicacaoPage() {
  const { clienteId, aplicacaoId } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(aplicacaoId)
  const [isLoading, setIsLoading] = useState(isEditMode)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
    },
  })

  useEffect(() => {
    const carregarAplicacao = async () => {
      if (!clienteId || !aplicacaoId) {
        setIsLoading(false)
        return
      }

      const aplicacao = await storageService.buscarAplicacao(clienteId, aplicacaoId)
      if (!aplicacao) {
        navigate(`/clientes/${clienteId}`, { replace: true })
        return
      }

      form.reset({ nome: aplicacao.nome })
      setIsLoading(false)
    }

    carregarAplicacao()
  }, [aplicacaoId, clienteId, form, navigate])

  const onSubmit = async (values: FormValues) => {
    if (!clienteId) {
      navigate('/', { replace: true })
      return
    }

    if (isEditMode && aplicacaoId) {
      await storageService.atualizarAplicacao(clienteId, aplicacaoId, {
        nome: values.nome.trim(),
      })
    } else {
      await storageService.adicionarAplicacao(clienteId, {
        id: crypto.randomUUID(),
        nome: values.nome.trim(),
        funcionalidades: [],
      })
    }

    navigate(`/clientes/${clienteId}`)
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Aplicação</p>
          <h1>{isEditMode ? 'Editar Aplicação' : 'Nova Aplicação'}</h1>
        </div>
        <Link to={`/clientes/${clienteId}`} className="secondary-button">
          Voltar
        </Link>
      </div>

      <form className="form-card" onSubmit={form.handleSubmit(onSubmit)}>
        <label>
          Nome da aplicação
          <input
            type="text"
            placeholder="Digite o nome da aplicação"
            {...form.register('nome')}
          />
          {form.formState.errors.nome && (
            <span className="field-error">{form.formState.errors.nome.message}</span>
          )}
        </label>

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : isEditMode ? 'Salvar alterações' : 'Salvar aplicação'}
          </button>
          <Link to={`/clientes/${clienteId}`} className="ghost-button">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}
