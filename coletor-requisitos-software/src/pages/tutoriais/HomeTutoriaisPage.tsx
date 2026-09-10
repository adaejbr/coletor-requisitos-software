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

        <BasicCard className="home-card">
          <div className="home-card-icon">🧩</div>
          <div>
            <h2>Configurar formulários de briefing</h2>
            <p>Aprenda a criar, estruturar e publicar formulários reutilizáveis para cada contexto de briefing.</p>
          </div>
          <ButtonLink to="/tutoriais/formularios-briefing/configuracao" variant="primary" className="home-link">
            Abrir tutorial
          </ButtonLink>
        </BasicCard>

        <BasicCard className="home-card">
          <div className="home-card-icon">📝</div>
          <div>
            <h2>Usar formulários de briefing</h2>
            <p>Veja como responder os formulários dentro de cada cliente e aplicação, salvando rascunhos e concluindo respostas.</p>
          </div>
          <ButtonLink to="/tutoriais/formularios-briefing/uso" variant="primary" className="home-link">
            Abrir tutorial
          </ButtonLink>
        </BasicCard>
      </div>
    </section>
  )
}
