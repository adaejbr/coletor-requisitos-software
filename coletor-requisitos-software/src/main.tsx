import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './components/toast-provider/ToastProvider.tsx'
import { storageService } from './services/storageService'
import { seedClientes } from './services/seed'

async function bootstrap() {
  const clientes = await storageService.listarClientes()

  if (clientes.length === 0) {
    await Promise.all(seedClientes.map((cliente) => storageService.adicionarCliente(cliente)))
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}

bootstrap()
