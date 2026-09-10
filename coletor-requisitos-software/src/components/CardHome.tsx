import { Link } from 'react-router-dom'
import { BasicCard } from './cards'

type CardHomeProps = {
    icon: React.ReactNode
    title: string
    description: string
    linkTo: string
    linkText: string
}

export function CardHome({ icon, title, description, linkTo, linkText }: CardHomeProps) {
    return (
        <BasicCard className="home-card">
          <div className="home-card-icon">{icon}</div>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <Link to={linkTo} className="primary-button home-link">
            {linkText}
          </Link>
        </BasicCard>
    )
}