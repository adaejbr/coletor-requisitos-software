import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Breadcrumbs } from './components/Breadcrumbs'
import HomePage from './pages/HomePage'
import HomeTutoriaisPage from './pages/tutoriais/HomeTutoriaisPage'
import TutorialFuncionalidadeClientesPage from './pages/tutoriais/TutorialFuncionalidadeClientesPage'
import ClientesPage from './pages/clientes/ClientesPage'
import DetalhesAplicacaoPage from './pages/clientes/DetalhesAplicacaoPage'
import DetalhesClientePage from './pages/clientes/DetalhesClientePage'
import EditarFuncionalidadePage from './pages/clientes/EditarFuncionalidadePage'
import NovaAplicacaoPage from './pages/clientes/NovaAplicacaoPage'
import NovaFuncionalidadePage from './pages/clientes/NovaFuncionalidadePage'
import NovoClientePage from './pages/clientes/NovoClientePage'
import VisualizarFuncionalidadePage from './pages/clientes/VisualizarFuncionalidadePage'
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
          <NavLink to="/tutoriais" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Tutoriais
          </NavLink>
        </nav>
      </header>

      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutoriais" element={<HomeTutoriaisPage />} />
        <Route path="/tutoriais/funcionalidade-clientes" element={<TutorialFuncionalidadeClientesPage />} />

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
