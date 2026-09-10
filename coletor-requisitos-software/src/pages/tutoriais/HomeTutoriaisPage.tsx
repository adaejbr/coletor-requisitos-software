import { BasicCard } from '@/components/cards'
import { ButtonLink } from '@/components/buttons'

export default function HomeTutoriaisPage() {
  return (
    <section className="page home-page">
      <div className="home-header">
        <p className="eyebrow">Tutoriais</p>
        <h1>Home de tutoriais</h1>
      </div>

      <div className="hub-grid">
        <BasicCard className="home-card">
          <div className="home-card-icon">📚</div>
          <div>
            <h2>Funcionalidade de Clientes</h2>
            <p>Passo a passo para cadastrar clientes, aplicações e funcionalidades no fluxo principal.</p>
          </div>
          <ButtonLink to="/tutoriais/funcionalidade-clientes" variant="primary" className="home-link">
            Abrir tutorial
          </ButtonLink>
        </BasicCard>
      </div>
    </section>
  )
}
