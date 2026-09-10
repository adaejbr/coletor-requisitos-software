export type BreadcrumbRoute = {
  pattern: string
  label: string
  parent?: string
}

export type BreadcrumbItem = {
  label: string
  to: string
}

export const BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
  { pattern: '/', label: 'Início' },

  { pattern: '/tutoriais', label: 'Tutoriais', parent: '/' },
  {
    pattern: '/tutoriais/funcionalidade-clientes',
    label: 'Funcionalidade de Clientes',
    parent: '/tutoriais',
  },
  {
    pattern: '/tutoriais/formularios-briefing/configuracao',
    label: 'Configuração de Formulários',
    parent: '/tutoriais',
  },
  {
    pattern: '/tutoriais/formularios-briefing/uso',
    label: 'Uso de Formulários',
    parent: '/tutoriais',
  },

  { pattern: '/configuracoes', label: 'Configurações', parent: '/' },
  { pattern: '/configuracoes/formularios', label: 'Formulários', parent: '/configuracoes' },
  { pattern: '/configuracoes/formularios/novo', label: 'Novo', parent: '/configuracoes/formularios' },
  {
    pattern: '/configuracoes/formularios/:idFormulario',
    label: 'Formulário',
    parent: '/configuracoes/formularios',
  },
  {
    pattern: '/configuracoes/formularios/:idFormulario/editar',
    label: 'Editar',
    parent: '/configuracoes/formularios/:idFormulario',
  },

  { pattern: '/clientes', label: 'Clientes', parent: '/' },
  { pattern: '/clientes/novo', label: 'Novo', parent: '/clientes' },
  { pattern: '/clientes/:clienteId', label: 'Cliente', parent: '/clientes' },
  { pattern: '/clientes/:clienteId/editar', label: 'Editar', parent: '/clientes/:clienteId' },

  {
    pattern: '/clientes/:clienteId/aplicacoes',
    label: 'Aplicações',
    parent: '/clientes/:clienteId',
  },
  {
    pattern: '/clientes/:clienteId/aplicacoes/nova',
    label: 'Nova',
    parent: '/clientes/:clienteId',
  },
  {
    pattern: '/clientes/:clienteId/aplicacoes/:aplicacaoId',
    label: 'Aplicação',
    parent: '/clientes/:clienteId',
  },
  {
    pattern: '/clientes/:clienteId/aplicacoes/:aplicacaoId/briefing',
    label: 'Briefing',
    parent: '/clientes/:clienteId/aplicacoes/:aplicacaoId',
  },
  {
    pattern: '/clientes/:clienteId/aplicacoes/:aplicacaoId/editar',
    label: 'Editar',
    parent: '/clientes/:clienteId/aplicacoes/:aplicacaoId',
  },
  {
    pattern: '/clientes/:clienteId/aplicacoes/:aplicacaoId/funcionalidades/nova',
    label: 'Funcionalidade - Nova',
    parent: '/clientes/:clienteId/aplicacoes/:aplicacaoId',
  },
  {
    pattern: '/clientes/:clienteId/aplicacoes/:aplicacaoId/funcionalidades/:funcionalidadeId/editar',
    label: 'Funcionalidade - Editar',
    parent: '/clientes/:clienteId/aplicacoes/:aplicacaoId',
  },
  {
    pattern: '/clientes/:clienteId/aplicacoes/:aplicacaoId/funcionalidades/:funcionalidadeId/visualizar',
    label: 'Funcionalidade',
    parent: '/clientes/:clienteId/aplicacoes/:aplicacaoId',
  },
]

const routeMap = new Map(BREADCRUMB_ROUTES.map((route) => [route.pattern, route]))

const normalizePath = (pathname: string): string => {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const normalized = pathname.replace(/\/+$/, '')
  return normalized === '' ? '/' : normalized
}

const extractParams = (pattern: string, pathname: string): Record<string, string> => {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathnameParts = normalizePath(pathname).split('/').filter(Boolean)

  const params: Record<string, string> = {}

  for (let index = 0; index < patternParts.length; index += 1) {
    const part = patternParts[index]
    const pathnamePart = pathnameParts[index]

    if (!pathnamePart) {
      return params
    }

    if (part.startsWith(':')) {
      params[part.slice(1)] = pathnamePart
      continue
    }

    if (part !== pathnamePart) {
      return {}
    }
  }

  return params
}

const applyParams = (pattern: string, params: Record<string, string>): string => {
  if (pattern === '/') {
    return '/'
  }

  return pattern
    .split('/')
    .map((segment) => {
      if (!segment.startsWith(':')) {
        return segment
      }

      return params[segment.slice(1)] ?? segment
    })
    .join('/')
}

const matchesPattern = (pattern: string, pathname: string): boolean => {
  const patternSegments = pattern.split('/').filter(Boolean)
  const pathnameSegments = normalizePath(pathname).split('/').filter(Boolean)

  if (patternSegments.length !== pathnameSegments.length) {
    return false
  }

  return patternSegments.every((segment, index) => {
    if (segment.startsWith(':')) {
      return true
    }

    return segment === pathnameSegments[index]
  })
}

export const buildBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const normalizedPath = normalizePath(pathname)

  if (normalizedPath === '/') {
    return [{ label: 'Início', to: '/' }]
  }

  const matchingRoutes = BREADCRUMB_ROUTES.filter((route) => matchesPattern(route.pattern, normalizedPath))

  if (matchingRoutes.length === 0) {
    return [{ label: 'Início', to: '/' }]
  }

  const route = matchingRoutes.reduce((currentBest, candidate) =>
    candidate.pattern.length > currentBest.pattern.length ? candidate : currentBest,
  )

  const items: BreadcrumbItem[] = []
  let currentPattern: string | undefined = route.pattern

  while (currentPattern) {
    const currentRoute = routeMap.get(currentPattern)

    if (!currentRoute) {
      break
    }

    const params = extractParams(currentRoute.pattern, normalizedPath)
    items.unshift({
      label: currentRoute.label,
      to: applyParams(currentRoute.pattern, params),
    })

    currentPattern = currentRoute.parent
  }

  if (items[0]?.to !== '/') {
    items.unshift({ label: 'Início', to: '/' })
  }

  return items
}
