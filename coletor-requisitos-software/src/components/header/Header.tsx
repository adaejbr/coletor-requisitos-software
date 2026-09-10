import { NavLink } from "react-router-dom"
import './Header.css'

export function Header() {
    return(
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
                <NavLink to="/configuracoes/formularios" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Configuração
                </NavLink>
                <NavLink to="/tutoriais" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Tutoriais
                </NavLink>
            </nav>
        </header>
    )
}
