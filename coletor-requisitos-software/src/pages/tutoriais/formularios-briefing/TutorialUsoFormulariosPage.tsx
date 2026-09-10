import './TutorialBriefingPage.css'
import { ButtonLink } from '@/components/buttons'

const sections = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'abrir-aplicacao', label: 'Abrir aplicação' },
  { id: 'formulario-pendente', label: 'Formulários pendentes' },
  { id: 'preencher', label: 'Preencher respostas' },
  { id: 'rascunho', label: 'Salvar rascunho' },
  { id: 'concluir', label: 'Concluir e revisar' },
]

export default function TutorialUsoFormulariosPage() {
  return (
    <section className="page tutorial-page">
      <div className="page-header tutorial-header">
        <div>
          <p className="eyebrow">Documentação</p>
          <h1>Como usar formulários de briefing dentro de cada cliente</h1>
        </div>
        <ButtonLink to="/tutoriais" variant="ghost">
          Voltar para tutoriais
        </ButtonLink>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-card">
            <p className="docs-kicker">Uso prático</p>
            <nav className="docs-nav" aria-label="Índice do tutorial de uso">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="docs-nav-link">
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="docs-content">
          <header className="docs-hero">
            <p className="eyebrow">Fluxo de uso</p>
            <h2>Responda o briefing no contexto da aplicação correta</h2>
            <p>
              Cada formulário de briefing fica associado a um cliente e a uma aplicação. Esse fluxo facilita a coleta
              de informações diretamente no contexto do projeto que está sendo entregue.
            </p>
          </header>

          <section id="visao-geral" className="docs-section">
            <h3>Visão geral</h3>
            <p>
              O uso dos formulários de briefing começa no cadastro do cliente e segue até o detalhe da aplicação,
              onde o usuário pode acessar os formulários ativos, responder perguntas e registrar o progresso do
              levantamento de requisitos.
            </p>
            <p>
              Essa abordagem torna o processo mais organizado, porque cada cliente e sua aplicação possuem um conjunto
              de formulários específicos e rastreáveis.
            </p>
          </section>

          <section id="abrir-aplicacao" className="docs-section">
            <h3>1. Acessar a aplicação do cliente</h3>
            <p>
              No módulo de clientes, abra o cliente desejado e selecione a aplicação em que o briefing será respondido.
              Dentro do detalhe da aplicação, localize a área de <strong>Formulários de briefing</strong>.
            </p>
            <div className="docs-callout">
              O formulário não é preenchido de forma isolada. Ele sempre acontece no contexto da aplicação correta,
              preservando toda a relação entre cliente, aplicação e requisito.
            </div>
          </section>

          <section id="formulario-pendente" className="docs-section">
            <h3>2. Verificar quais formulários estão pendentes</h3>
            <p>
              Na lateral do painel, os formulários aparecem separados em duas listas: <strong>Pendentes</strong> e <strong>Preenchidos</strong>. Isso ajuda a visualizar rapidamente o que ainda precisa ser respondido e
              o que já foi concluído.
            </p>
            <ul className="docs-list">
              <li><strong>Pendentes:</strong> formulários que ainda não possuem resposta concluída.</li>
              <li><strong>Preenchidos:</strong> formulários que já foram concluídos e podem ser visualizados ou revisados.</li>
            </ul>
          </section>

          <section id="preencher" className="docs-section">
            <h3>3. Preencher as respostas</h3>
            <p>
              Ao selecionar um formulário pendente, a interface mostra todas as seções e perguntas configuradas. Você
              deve responder cada item conforme o contexto da aplicação e das necessidades do cliente.
            </p>
            <p>
              O preenchimento deve seguir a ordem lógica do briefing. Isso facilita a compreensão geral da demanda e
              reduz a chance de omitir informações importantes.
            </p>
          </section>

          <section id="rascunho" className="docs-section">
            <h3>4. Salvar rascunho</h3>
            <p>
              Se a resposta ainda não estiver pronta, use a opção de <strong>Salvar rascunho</strong>. Isso preserva o
              progresso atual e permite retornar mais tarde sem perder as informações que já foram preenchidas.
            </p>
            <p>
              Esse recurso é especialmente útil quando o formulário exige análise mais detalhada do cliente, do negócio
              ou da equipe técnica.
            </p>
          </section>

          <section id="concluir" className="docs-section">
            <h3>5. Concluir e revisar</h3>
            <p>
              Quando o briefing estiver completo, clique em <strong>Concluir</strong>. A resposta passa a ser tratada
              como concluída e o formulário deixa de aparecer na lista de pendentes.
            </p>
            <p>
              Caso precise revisar algum dado, basta abrir o formulário novamente na lista de preenchidos e ajustar o
              conteúdo antes de finalizar qualquer entrega de requisitos.
            </p>
            <div className="docs-callout">
              O ideal é responder o briefing com atenção às informações do cliente e do contexto da aplicação. Isso
              melhora a qualidade da coleta e reduz retrabalho em etapas posteriores.
            </div>
          </section>
        </article>
      </div>
    </section>
  )
}
