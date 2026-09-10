import './TutorialFuncionalidadeClientesPage.css'
import { ButtonLink } from '@/components/buttons'

const sections = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'cliente', label: 'Clientes' },
  { id: 'aplicacao', label: 'Aplicações' },
  { id: 'funcionalidade', label: 'Funcionalidades' },
  { id: 'exportacao', label: 'Exportação' },
  { id: 'dicas', label: 'Dicas' },
]

const tips = [
  'Mantenha nomes de clientes claros e consistentes.',
  'Organize aplicações por sistema, área ou projeto.',
  'Descreva bem as funcionalidades e os pontos importantes antes de exportar.',
  'Revise usuários e entidades antes de finalizar a entrega.',
]

export default function TutorialFuncionalidadeClientesPage() {
  return (
    <section className="page tutorial-page">
      <div className="page-header tutorial-header">
        <div>
          <p className="eyebrow">Documentação</p>
          <h1>Tutorial de utilização</h1>
        </div>
        <ButtonLink to="/" variant="secondary">
          Voltar para o início
        </ButtonLink>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-card">
            <p className="docs-kicker">Noções básicas</p>
            <nav className="docs-nav" aria-label="Índice do tutorial">
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
            <p className="eyebrow">Guia comercial</p>
            <h2>Como usar o Coletor de Requisitos</h2>
            <p>
              Este tutorial reúne o passo a passo para registrar clientes, aplicações e funcionalidades,
              seguindo o fluxo da plataforma para entrega de requisitos de software.
            </p>
          </header>

          <section id="visao-geral" className="docs-section">
            <h3>Visão geral</h3>
            <p>
              A aplicação foi organizada para seguir uma hierarquia clara: cliente → aplicação → funcionalidade.
              Essa estrutura facilita a manutenção do contexto do projeto e melhora a rastreabilidade entre a
              demanda comercial e a execução técnica.
            </p>
            <p>
              O fluxo principal começa na home, segue para a área de clientes e, em seguida, para os detalhes de
              cada aplicação e funcionalidade.
            </p>
          </section>

          <section id="cliente" className="docs-section">
            <h3>1. Cadastrar um cliente</h3>
            <p>
              Na listagem de clientes, clique em <strong>Novo Cliente</strong>. Informe o nome e o status do projeto
              e salve o registro.
            </p>
            <div className="docs-callout">
              O cliente passa a aparecer na listagem com a data da última alteração e pode ser aberto para gestão
              de aplicações.
            </div>
          </section>

          <section id="aplicacao" className="docs-section">
            <h3>2. Cadastrar uma aplicação</h3>
            <p>
              Dentro do cliente, clique em <strong>Nova Aplicação</strong> e informe o nome da aplicação. Após salvar,
              ela fica vinculada ao cliente e aparece na tela de detalhes do cliente.
            </p>
          </section>

          <section id="funcionalidade" className="docs-section">
            <h3>3. Cadastrar uma funcionalidade</h3>
            <p>
              Ao abrir uma aplicação, selecione <strong>Nova Funcionalidade</strong>. O formulário oferece quatro blocos:
            </p>
            <ul className="docs-list">
              <li><strong>Informações:</strong> nome, descrição e pontos importantes.</li>
              <li><strong>Usuários:</strong> identificação de papéis e ações envolvidas.</li>
              <li><strong>Entidades:</strong> nome e campos relevantes do domínio.</li>
              <li><strong>Relacionamentos:</strong> ligações entre entidades e estrutura do modelo.</li>
            </ul>
            <p>
              Depois de preencher os campos, salve a funcionalidade para que ela fique associada à aplicação.
            </p>
          </section>

          <section className="docs-section">
            <h3>4. Visualizar e editar</h3>
            <p>
              Na tela de detalhes da aplicação, cada funcionalidade pode ser aberta para visualização, edição ou
              exclusão. Esse fluxo facilita a refinamento contínuo da modelagem de requisitos.
            </p>
          </section>

          <section id="exportacao" className="docs-section">
            <h3>5. Exportar a aplicação</h3>
            <p>
              Na tela de detalhes da aplicação, os botões de exportação permitem baixar o conteúdo em JSON ou PDF.
              Isso ajuda a compartilhar a entrega com stakeholders, clientes ou equipes internas.
            </p>
            <div className="docs-callout">
              O PDF reúne as informações da aplicação em um formato pronto para apresentação e aprovação.
            </div>
          </section>

          <section id="dicas" className="docs-section">
            <h3>Dicas importantes</h3>
            <ul className="docs-list">
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="docs-section">
            <h3>Observação</h3>
            <p>
              Quando qualquer alteração for feita em aplicação ou funcionalidade, a data de última alteração do
              cliente será atualizada automaticamente.
            </p>
          </section>
        </article>
      </div>
    </section>
  )
}
