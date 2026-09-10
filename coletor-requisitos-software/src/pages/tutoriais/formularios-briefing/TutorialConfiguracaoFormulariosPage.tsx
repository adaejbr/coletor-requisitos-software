import './TutorialBriefingPage.css'
import { ButtonLink } from '@/components/buttons'

const sections = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'acessar', label: 'Acessar configuração' },
  { id: 'novo-formulario', label: 'Novo formulário' },
  { id: 'estruturar', label: 'Seções e perguntas' },
  { id: 'salvar', label: 'Salvar e validar' },
  { id: 'boas-praticas', label: 'Boas práticas' },
]

export default function TutorialConfiguracaoFormulariosPage() {
  return (
    <section className="page tutorial-page">
      <div className="page-header tutorial-header">
        <div>
          <p className="eyebrow">Documentação</p>
          <h1>Como configurar formulários de briefing</h1>
        </div>
        <ButtonLink to="/tutoriais" variant="ghost">
          Voltar para tutoriais
        </ButtonLink>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-card">
            <p className="docs-kicker">Configuração</p>
            <nav className="docs-nav" aria-label="Índice do tutorial de configuração">
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
            <p className="eyebrow">Configuração</p>
            <h2>Crie formulários reutilizáveis para cada tipo de briefing</h2>
            <p>
              Os formulários de briefing permitem padronizar a coleta de requisitos de uma aplicação, criando um
              fluxo consistente para clientes, áreas e times de produto.
            </p>
          </header>

          <section id="visao-geral" className="docs-section">
            <h3>Visão geral</h3>
            <p>
              O objetivo desta área é montar um formulário de percepção, diagnóstico ou validação para um cliente e
              aplicação específica. Cada formulário é composto por seções e perguntas, que podem ser adaptadas ao
              tipo de projeto, público ou necessidade do briefing.
            </p>
            <p>
              A criação e a manutenção desses formulários ficam centralizadas na área de configurações, onde você
              conseguem estruturar o conteúdo antes de ele ser disponibilizado ao cliente.
            </p>
          </section>

          <section id="acessar" className="docs-section">
            <h3>1. Acessar a área de configuração</h3>
            <p>
              No menu principal, vá até <strong>Configurações</strong> e selecione <strong>Formulários</strong>.
              Essa tela lista todos os formulários cadastrados e mostra se eles estão ativos ou inativos.
            </p>
            <div className="docs-callout">
              Use a listagem para localizar rapidamente um formato existente, editar algum formulário antigo ou criar
              um novo a partir do mesmo padrão.
            </div>
          </section>

          <section id="novo-formulario" className="docs-section">
            <h3>2. Criar um novo formulário</h3>
            <p>
              Clique em <strong>Novo formulário</strong>. A aplicação abrirá a tela de edição do briefing, com um
              formulário em branco para você começar a estrutura.
            </p>
            <ul className="docs-list">
              <li><strong>Nome:</strong> defina um nome claro e identificável, como “Briefing inicial” ou “Diagnóstico de requisitos”.</li>
              <li><strong>Descrição:</strong> descreva o propósito do formulário e o contexto de uso.</li>
              <li><strong>Status:</strong> o formulário pode ficar ativo para uso imediato ou ser mantido inativo até a finalização.</li>
            </ul>
          </section>

          <section id="estruturar" className="docs-section">
            <h3>3. Estruturar seções e perguntas</h3>
            <p>
              O editor de formulário permite criar blocos de conteúdo organizados em seções. Essa estrutura é útil
              para separar assuntos como contexto do cliente, objetivos, usuários, regras de negócio e requisitos de
              integração.
            </p>
            <ul className="docs-list">
              <li><strong>Seções:</strong> agrupam perguntas relacionadas por tema.</li>
              <li><strong>Perguntas:</strong> representam os campos que o usuário final precisa responder.</li>
              <li><strong>Tipos de pergunta:</strong> cada pergunta pode ter um formato específico para o tipo de resposta que a equipe precisa receber.</li>
            </ul>
            <p>
              Ao criar cada seção, pense na lógica da entrevista. O ideal é usar blocos curtos e objetivos, evitando
              uma página longa demais ou perguntas demais juntas.
            </p>
          </section>

          <section id="salvar" className="docs-section">
            <h3>4. Salvar, validar e publicar</h3>
            <p>
              Depois de montar a estrutura, use o botão de salvar para gravar o formulário. A aplicação valida a
              configuração e preserva a versão atual do conteúdo no registro.
            </p>
            <p>
              Se o formulário estiver pronto para uso, mantenha-o ativo na listagem. Se ainda estiver em construção,
              o ideal é deixar inativo até que todas as seções e perguntas estejam conforme o esperado.
            </p>
            <div className="docs-callout">
              Sempre revise a sequência das perguntas antes de publicar. Perguntas mal organizadas geram respostas
              incompletas ou inconsistentes.
            </div>
          </section>

          <section id="boas-praticas" className="docs-section">
            <h3>5. Boas práticas</h3>
            <ul className="docs-list">
              <li>Use nomes claros e específicos para facilitar a identificação do formulário.</li>
              <li>Separe os temas em seções visíveis e lógicas.</li>
              <li>Evite redundância entre perguntas.</li>
              <li>Revise a ordem das perguntas antes de ativar o formulário.</li>
              <li>Mantenha registros de versões quando houver mudanças relevantes no briefing.</li>
            </ul>
          </section>
        </article>
      </div>
    </section>
  )
}
