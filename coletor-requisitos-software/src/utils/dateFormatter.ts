export const formatarData = (iso: string | undefined) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}).format((iso === undefined || iso === null || iso === '') ? new Date() : new Date(iso))