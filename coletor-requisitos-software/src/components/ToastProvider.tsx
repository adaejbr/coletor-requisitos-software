import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ToastContextValue = {
  showToast: (message: string) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = useCallback((message: string) => {
    setToast(message)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ showToast, hideToast }),
    [showToast, hideToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
