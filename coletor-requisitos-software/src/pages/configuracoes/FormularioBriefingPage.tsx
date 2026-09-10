import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { FormularioBriefingBuilder } from '../../components/briefing/FormularioBriefingBuilder'
import { useBriefingForms } from '../../hooks/useBriefingForms'
import type { FormularioBriefing } from '../../types/briefing'

const criarFormularioPadrao = (): FormularioBriefing => ({
  id: uuidv4(),
  nome: '',
  descricao: '',
  ativo: true,
  versao: 1,
  secoes: [],
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString(),
})

export default function FormularioBriefingPage() {
  const { idFormulario } = useParams()
  const navigate = useNavigate()
  const { formularios, loading, salvarFormulario } = useBriefingForms()
  const [formularioInicial, setFormularioInicial] = useState<FormularioBriefing | null>(null)

  useEffect(() => {
    if (!idFormulario) {
      setFormularioInicial(criarFormularioPadrao())
      return
    }

    const encontrado = formularios.find((formulario) => formulario.id === idFormulario)
    setFormularioInicial(encontrado ?? criarFormularioPadrao())
  }, [formularios, idFormulario])

  const titulo = useMemo(
    () => (idFormulario ? 'Editar formulário' : 'Novo formulário'),
    [idFormulario],
  )

  const handleSave = async (formulario: FormularioBriefing) => {
    const formularioCompleto: FormularioBriefing = {
      ...formulario,
      criadoEm: formulario.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      versao: formulario.versao || 1,
    }

    await salvarFormulario(formularioCompleto)
    navigate('/configuracoes/formularios')
  }

  if (loading && idFormulario) {
    return (
      <section className="page">
        <div className="empty-state">
          <p>Carregando formulário...</p>
        </div>
      </section>
    )
  }

  if (!formularioInicial) {
    return null
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Configuração</p>
          <h1>{titulo}</h1>
        </div>
      </div>

      <FormularioBriefingBuilder
        initialFormulario={formularioInicial}
        onSave={handleSave}
        onCancel={() => navigate('/configuracoes/formularios')}
      />
    </section>
  )
}
