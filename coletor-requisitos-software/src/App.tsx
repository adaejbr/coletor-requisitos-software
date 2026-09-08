import { Navigate, Route, Routes } from 'react-router-dom'
import ClientesPage from './pages/ClientesPage'
import NovoClientePage from './pages/NovoClientePage'
import DetalhesClientePage from './pages/DetalhesClientePage'
import NovaAplicacaoPage from './pages/NovaAplicacaoPage'
import DetalhesAplicacaoPage from './pages/DetalhesAplicacaoPage'
import NovaFuncionalidadePage from './pages/NovaFuncionalidadePage'
import EditarFuncionalidadePage from './pages/EditarFuncionalidadePage'
import VisualizarFuncionalidadePage from './pages/VisualizarFuncionalidadePage'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <Routes>
        <Route path="/" element={<ClientesPage />} />
        <Route path="/clientes/novo" element={<NovoClientePage />} />
        <Route path="/clientes/:clienteId" element={<DetalhesClientePage />} />
        <Route path="/clientes/:clienteId/aplicacoes/nova" element={<NovaAplicacaoPage />} />
        <Route path="/clientes/:clienteId/aplicacoes/:aplicacaoId" element={<DetalhesAplicacaoPage />} />
        <Route path="/clientes/:clienteId/aplicacoes/:aplicacaoId/funcionalidades/nova" element={<NovaFuncionalidadePage />} />
        <Route path="/clientes/:clienteId/aplicacoes/:aplicacaoId/funcionalidades/:funcionalidadeId/editar" element={<EditarFuncionalidadePage />} />
        <Route path="/clientes/:clienteId/aplicacoes/:aplicacaoId/funcionalidades/:funcionalidadeId/visualizar" element={<VisualizarFuncionalidadePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
