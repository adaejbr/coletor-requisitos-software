import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Breadcrumbs } from './components/Breadcrumbs'
import HomePage from './pages/HomePage'
import ClientesPage from './pages/ClientesPage'
import DetalhesAplicacaoPage from './pages/DetalhesAplicacaoPage'
import DetalhesClientePage from './pages/DetalhesClientePage'
import EditarFuncionalidadePage from './pages/EditarFuncionalidadePage'
import NovaAplicacaoPage from './pages/NovaAplicacaoPage'
import NovaFuncionalidadePage from './pages/NovaFuncionalidadePage'
import NovoClientePage from './pages/NovoClientePage'
import VisualizarFuncionalidadePage from './pages/VisualizarFuncionalidadePage'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">CR</span>
          <div>
            <p className="brand-label">Coletor</p>
            <strong>Requisitos</strong>
          </div>
        </div>

        <nav className="topnav" aria-label="Navegação principal">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Início
          </NavLink>
          <NavLink to="/clientes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Clientes
          </NavLink>
        </nav>
      </header>

      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/clientes">
          <Route path="" element={<ClientesPage />} />
          <Route path="novo" element={<NovoClientePage />} />
          <Route path=":clienteId">
            <Route index element={<DetalhesClientePage />} />
            <Route path="editar" element={<NovoClientePage />} />
            <Route path="aplicacoes">
              <Route path="nova" element={<NovaAplicacaoPage />} />
              <Route path=":aplicacaoId">
                <Route index element={<DetalhesAplicacaoPage />} />
                <Route path="editar" element={<NovaAplicacaoPage />} />
                <Route path="funcionalidades">
                  <Route path="nova" element={<NovaFuncionalidadePage />} />
                  <Route path=":funcionalidadeId">
                    <Route path="editar" element={<EditarFuncionalidadePage />} />
                    <Route path="visualizar" element={<VisualizarFuncionalidadePage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
