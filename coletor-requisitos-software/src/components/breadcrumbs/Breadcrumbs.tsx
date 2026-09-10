import { Link, useLocation } from 'react-router-dom'
import { buildBreadcrumbs } from '../../config/breadcrumbs'
import './Breadcrumbs.css'

export function Breadcrumbs() {
  const location = useLocation()
  const items = buildBreadcrumbs(location.pathname)

  if (items.length === 1 && items[0].to === '/') {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-bar">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li key={`${item.to}-${index}`} className="breadcrumb-item">
              {!isCurrent ? (
                <>
                  <Link to={item.to} className="breadcrumb-link">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="breadcrumb-separator">
                    /
                  </span>
                </>
              ) : (
                <span aria-current="page" className="breadcrumb-current">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
