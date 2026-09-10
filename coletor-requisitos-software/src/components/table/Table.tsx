import type { ReactNode } from 'react'
import './Table.css'

export type TableColumn<T> = {
  key: string
  header: string
  accessor?: keyof T | ((row: T) => unknown)
  render?: (row: T, value: unknown) => ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

type TableProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string | number
  emptyState?: ReactNode
  className?: string
}

export function Table<T>({ columns, data, getRowKey, emptyState, className }: TableProps<T>) {
  const renderCellValue = (row: T, column: TableColumn<T>) => {
    const value = typeof column.accessor === 'function' ? column.accessor(row) : column.accessor ? row[column.accessor] : undefined

    if (column.render) {
      return column.render(row, value)
    }

    if (value === null || typeof value === 'undefined') {
      return '-'
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value
    }

    return JSON.stringify(value)
  }

  return (
    <div className={['table-card', className].filter(Boolean).join(' ')}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            const rowKey = getRowKey(row)

            return (
              <tr key={rowKey}>
                {columns.map((column) => (
                  <td
                    key={`${String(rowKey)}-${column.key}`}
                    className={[column.className, column.align ? `align-${column.align}` : ''].filter(Boolean).join(' ')}
                  >
                    {renderCellValue(row, column)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      {data.length === 0 && emptyState && <div className="table-empty-state">{emptyState}</div>}
    </div>
  )
}
