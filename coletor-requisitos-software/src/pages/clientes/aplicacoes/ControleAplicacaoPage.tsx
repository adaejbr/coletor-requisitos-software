import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Button, ButtonLink } from '@/components/buttons'
import { useToast } from '@/components/ToastProvider'
import { FormCard } from '@/components/cards'
import { storageService } from '@/services/storageService'

const schema = z.object({
  nome: z.string().trim().min(1, 'O nome da aplicação é obrigatório.'),
})

type FormValues = z.infer<typeof schema>

export default function NovaAplicacaoPage() {
  const { clienteId, aplicacaoId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
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

    try {
      if (isEditMode && aplicacaoId) {
        await storageService.atualizarAplicacao(clienteId, aplicacaoId, {
          nome: values.nome.trim(),
        })
        showToast('Aplicação atualizada com sucesso.')
      } else {
        await storageService.adicionarAplicacao(clienteId, {
          id: crypto.randomUUID(),
          nome: values.nome.trim(),
          funcionalidades: [],
        })
        showToast('Aplicação salva com sucesso.')
      }

      navigate(`/clientes/${clienteId}`)
    } catch (error) {
      console.error(error)
      showToast('Não foi possível salvar a aplicação.')
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Aplicação</p>
          <h1>{isEditMode ? 'Editar Aplicação' : 'Nova Aplicação'}</h1>
        </div>
        <ButtonLink to={`/clientes/${clienteId}`} variant="secondary">
          Voltar
        </ButtonLink>
      </div>

      <FormCard onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Carregando...' : isEditMode ? 'Salvar alterações' : 'Salvar aplicação'}
          </Button>
          <ButtonLink to={`/clientes/${clienteId}`} variant="ghost">
            Cancelar
          </ButtonLink>
        </div>
      </FormCard>
    </section>
  )
}
