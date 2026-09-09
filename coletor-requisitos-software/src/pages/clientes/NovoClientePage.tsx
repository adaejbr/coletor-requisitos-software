import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useToast } from '../../components/ToastProvider'
import { storageService } from '../../services/storageService'
import { CLIENTE_STATUS } from '../../types'

const schema = z.object({
  nome: z.string().trim().min(1, 'O nome do cliente é obrigatório.'),
  status: z.enum(CLIENTE_STATUS),
})

type FormValues = z.infer<typeof schema>

export default function NovoClientePage() {
  const navigate = useNavigate()
  const { clienteId } = useParams()
  const { showToast } = useToast()
  const isEditMode = Boolean(clienteId)
  const [isLoading, setIsLoading] = useState(isEditMode)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      status: 'em andamento',
    },
  })

  useEffect(() => {
    const carregarCliente = async () => {
      if (!clienteId) {
        setIsLoading(false)
        return
      }

      const cliente = await storageService.buscarCliente(clienteId)

      if (!cliente) {
        navigate('/', { replace: true })
        return
      }

      form.reset({
        nome: cliente.nome,
        status: cliente.status,
      })
      setIsLoading(false)
    }

    carregarCliente()
  }, [clienteId, form, navigate])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditMode && clienteId) {
        const cliente = await storageService.buscarCliente(clienteId)
        if (!cliente) {
          navigate('/', { replace: true })
          return
        }

        await storageService.atualizarCliente(clienteId, {
          nome: values.nome.trim(),
          status: values.status,
          dataUltimaAlteracao: new Date(),
        })
        showToast('Cliente atualizado com sucesso.')
      } else {
        const novoCliente = {
          id: crypto.randomUUID(),
          nome: values.nome.trim(),
          status: values.status,
          dataUltimaAlteracao: new Date(),
          aplicacoes: [],
        }

        await storageService.adicionarCliente(novoCliente)
        showToast('Cliente salvo com sucesso.')
      }

      navigate('/')
    } catch (error) {
      console.error(error)
      showToast('Não foi possível salvar o cliente.')
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cliente</p>
          <h1>{isEditMode ? 'Editar Cliente' : 'Novo Cliente'}</h1>
        </div>
        <Link to="/" className="secondary-button">
          Voltar
        </Link>
      </div>

      <form className="form-card" onSubmit={form.handleSubmit(onSubmit)}>
        <label>
          Nome
          <input
            type="text"
            placeholder="Digite o nome do cliente"
            {...form.register('nome')}
          />
          {form.formState.errors.nome && (
            <span className="field-error">{form.formState.errors.nome.message}</span>
          )}
        </label>

        <label>
          Status
          <select {...form.register('status')}>
            {CLIENTE_STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {form.formState.errors.status && (
            <span className="field-error">{form.formState.errors.status.message}</span>
          )}
        </label>

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : isEditMode ? 'Salvar alterações' : 'Salvar cliente'}
          </button>
          <Link to="/" className="ghost-button">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}
