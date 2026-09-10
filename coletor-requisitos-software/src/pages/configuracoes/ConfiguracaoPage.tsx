import { CardHome } from "@/components/cards/home-card/CardHome";

export default function ConfiguracaoPage() {
    return (
        <section className="page home-page">
            <div className="home-header">
            <p className="eyebrow">Configurações</p>
            <h1>Painel Gerencial</h1>
            </div>
    
            <div className="hub-grid">
            <CardHome 
                icon="📑" 
                title="Formulários" 
                description="Gerencie formulários disponíveis aos clientes." 
                linkTo="/configuracoes/formularios" 
                linkText="Gerenciar" 
            />
            </div>
        </section>
    )
}