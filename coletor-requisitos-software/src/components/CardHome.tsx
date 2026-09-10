import { BasicCard } from './cards'
import { ButtonLink } from './buttons'
import './CardHome.css'

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
          <ButtonLink to={linkTo} variant="primary" className="home-link">
            {linkText}
          </ButtonLink>
        </BasicCard>
    )
}