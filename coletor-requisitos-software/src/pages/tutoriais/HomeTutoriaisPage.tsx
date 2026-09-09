import { Link } from 'react-router-dom'

export default function HomeTutoriaisPage() {
  return (
    <section className="page home-page">
      <div className="home-header">
        <p className="eyebrow">Tutoriais</p>
        <h1>Home de tutoriais</h1>
      </div>

      <div className="hub-grid">
        <article className="info-card home-card">
          <div className="home-card-icon">📚</div>
          <div>
            <h2>Funcionalidade de Clientes</h2>
            <p>Passo a passo para cadastrar clientes, aplicações e funcionalidades no fluxo principal.</p>
          </div>
          <Link to="/tutoriais/funcionalidade-clientes" className="primary-button home-link">
            Abrir tutorial
          </Link>
        </article>
      </div>
    </section>
  )
}
