import { CardHome } from '../components/CardHome'
import './HomePage.css'

export default function HomePage() {
  return (
    <section className="page home-page">
      <div className="home-header">
        <p className="eyebrow">Hub</p>
        <h1>Funcionalidades</h1>
      </div>

      <div className="hub-grid">
        <CardHome 
          icon="👥" 
          title="Clientes" 
          description="Gerencie clientes, aplicações e requisitos do projeto." 
          linkTo="/clientes" 
          linkText="Acessar" 
        />
        <CardHome 
          icon="📘" 
          title="Tutoriais" 
          description="Veja o hub com todos os tutoriais e guias de uso da plataforma." 
          linkTo="/tutoriais" 
          linkText="Abrir hub" 
        />
      </div>
    </section>
  )
}
