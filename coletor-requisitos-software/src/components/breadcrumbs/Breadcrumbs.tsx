import { Link, useLocation } from 'react-router-dom'
import './Breadcrumbs.css'

type BreadcrumbItem = {
  label: string
  to: string
}

const buildBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return [{ label: 'Início', to: '/' }]
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Início', to: '/' }]
  let currentPath = ''

  for (const [index, segment] of segments.entries()) {
    currentPath += `/${segment}`

    if (segment === 'clientes') {
      breadcrumbs.push({ label: 'Clientes', to: currentPath })
      continue
    }

    if (segment === 'novo') {
      breadcrumbs.push({ label: 'Novo', to: currentPath })
      continue
    }

    if (segment === 'editar') {
      breadcrumbs.push({ label: 'Editar', to: currentPath })
      continue
    }

    if (segment === 'visualizar') {
      breadcrumbs.push({ label: 'Visualizar', to: currentPath })
      continue
    }

    if (segment === 'nova') {
      breadcrumbs.push({ label: 'Novo', to: currentPath })
      continue
    }

    if (index === 1 && segment !== 'clientes') {
      breadcrumbs.push({ label: 'Cliente', to: currentPath })
      continue
    }

    if (index === 3 && segment !== 'aplicacoes') {
      breadcrumbs.push({ label: 'Aplicação', to: currentPath })
      continue
    }

    if (index === 5 && segment !== 'funcionalidades') {
      breadcrumbs.push({ label: 'Funcionalidade', to: currentPath })
    }
  }

  return breadcrumbs
}

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
