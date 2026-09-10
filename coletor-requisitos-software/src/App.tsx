import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import HomeTutoriaisPage from './pages/tutoriais/HomeTutoriaisPage'
import TutorialFuncionalidadeClientesPage from './pages/tutoriais/funcionalidade-clientes/TutorialFuncionalidadeClientesPage'
import ClientesPage from './pages/clientes/ClientesPage'
import DetalhesAplicacaoPage from './pages/clientes/aplicacoes/DetalhesAplicacaoPage'
import DetalhesAplicacaoBriefingPage from './pages/clientes/aplicacoes/DetalhesAplicacaoBriefingPage'
import DetalhesClientePage from './pages/clientes/DetalhesClientePage'
import NovaAplicacaoPage from './pages/clientes/aplicacoes/ControleAplicacaoPage'
import NovaFuncionalidadePage from './pages/clientes/funcionalidades/ControleFuncionalidadePage'
import NovoClientePage from './pages/clientes/ControleClientePage'
import VisualizarFuncionalidadePage from './pages/clientes/funcionalidades/VisualizarFuncionalidadePage'
import FormularioBriefingPage from './pages/configuracoes/FormularioBriefingPage'
import FormulariosPage from './pages/configuracoes/FormulariosPage'
import { Header } from './components/header/Header'
import './App.css'
import './styles/shared.css'
import { Breadcrumbs } from './components/breadcrumbs/Breadcrumbs'

function App() {
  return (
    <main className="app-shell">
      <Header />
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutoriais" element={<HomeTutoriaisPage />} />
        <Route path="/tutoriais/funcionalidade-clientes" element={<TutorialFuncionalidadeClientesPage />} />

        <Route path="/configuracoes">
          <Route path="formularios" element={<FormulariosPage />} />
          <Route path="formularios/novo" element={<FormularioBriefingPage />} />
          <Route path="formularios/:idFormulario/editar" element={<FormularioBriefingPage />} />
        </Route>

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
                <Route path="briefing" element={<DetalhesAplicacaoBriefingPage />} />
                <Route path="editar" element={<NovaAplicacaoPage />} />
                <Route path="funcionalidades">
                  <Route path="nova" element={<NovaFuncionalidadePage />} />
                  <Route path=":funcionalidadeId">
                    <Route path="editar" element={<NovaFuncionalidadePage />} />
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
