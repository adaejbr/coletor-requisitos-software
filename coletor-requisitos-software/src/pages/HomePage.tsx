import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section className="page home-page">
      <div className="home-header">
        <p className="eyebrow">Hub</p>
        <h1>Funcionalidades</h1>
      </div>

      <div className="hub-grid">
        <article className="info-card home-card">
          <div className="home-card-icon">👥</div>
          <div>
            <h2>Clientes</h2>
            <p>Gerencie clientes, aplicações e requisitos do projeto.</p>
          </div>
          <Link to="/clientes" className="primary-button home-link">
            Acessar
          </Link>
        </article>
      </div>
    </section>
  )
}
