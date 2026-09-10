Abaixo está um backlog organizado por épicos e dependências, considerando React + LocalForage, sem backend, e os dois fluxos: **configuração** e **preenchimento**.

## Premissas e decisões recomendadas

1. **Entidade de resposta** deve relacionar:
   - `idCliente`
   - `idAplicacao`
   - `idFormulario`
   - `respostas`
   - `status: 'rascunho' | 'concluido'`

2. **Formulário configurável** deve ser salvo como agregado:
   - `FormularioBriefing` contém `secoes[]`
   - `SecaoBriefing` contém `perguntas[]`

3. **Exclusão não existe**:
   - Formulários, seções e perguntas só podem ser **inativados/reativados**.
   - Não criar botão de excluir nem métodos `delete` no repositório.

4. **Versionamento/snapshot**:
   - Como formulários podem ser editados depois de já respondidos, o ideal é salvar um `snapshotFormulario` na resposta ou versionar o formulário.
   - Para MVP, recomendo salvar o snapshot da estrutura no momento da primeira resposta.

5. **LocalForage**:
   - Sugestão de chaves:
     - `briefing:forms` → lista de formulários
     - `briefing:responses` → lista de respostas
   - Ou chaves individuais + índices, se preferir escalar melhor.

---

## Modelagem sugerida

```ts
type FormularioBriefing = {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  versao: number;
  secoes: SecaoBriefing[];
  criadoEm: string;
  atualizadoEm: string;
};

type SecaoBriefing = {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  ativo: boolean;
  perguntas: PerguntaBriefing[];
};

type PerguntaBriefing = {
  id: string;
  enunciado: string;
  descricaoAjuda?: string;
  tipo: 'texto' | 'textarea' | 'numero' | 'data' | 'select' | 'radio' | 'checkbox' | 'booleano';
  obrigatoria: boolean;
  opcoes?: { id: string; label: string; valor: string }[];
  ordem: number;
  ativo: boolean;
  placeholder?: string;
};

type RespostaBriefing = {
  id: string;
  idCliente: string;
  idAplicacao: string;
  idFormulario: string;
  versaoFormulario: number;
  snapshotFormulario?: FormularioBriefing;
  respostas: Record<string, unknown>;
  status: 'rascunho' | 'concluido';
  criadoEm: string;
  atualizadoEm: string;
  concluidoEm?: string;
};
```

---

# Épico 0 — Fundação e persistência

| Task | Descrição | Entregável | Critério de aceite |
|---|---|---|---|
| T0.1 | Criar tipos/contratos de `FormularioBriefing`, `SecaoBriefing`, `PerguntaBriefing` e `RespostaBriefing`. | Arquivo `types/briefing.ts` | Tipos exportados e usados nos serviços |
| T0.2 | Criar repositório LocalForage para formulários. | `briefingFormRepository.ts` | `listar`, `buscarPorId`, `salvar`, `inativar`, `reativar` |
| T0.3 | Criar repositório LocalForage para respostas. | `briefingResponseRepository.ts` | `listarPorAplicacao`, `buscarPorFormularioEAplicacao`, `salvar`, `concluir` |
| T0.4 | Criar hooks de acesso aos dados. | `useBriefingForms`, `useBriefingResponses` | Componentes não acessam LocalForage diretamente |
| T0.5 | Definir regras de validação. | Funções utilitárias | Formulário ativo exige nome; seção ativa exige título; pergunta exige enunciado e tipo |
| T0.6 | Definir estratégia de snapshot/versão. | Documento curto + implementação | Resposta guarda estrutura usada no preenchimento |

---

# Épico 1 — Fluxo de Configuração

Rota sugerida:  
`/configuracoes/formularios`  
`/configuracoes/formularios/novo`  
`/configuracoes/formularios/:idFormulario/editar`

| Task | Descrição | Entregável | Critério de aceite |
|---|---|---|---|
| T1.1 | Criar tela de listagem de formulários. | Tabela com nome, qtd. seções, qtd. perguntas, status, atualizado em, ações | Lista todos os formulários cadastrados |
| T1.2 | Criar ação “Novo formulário”. | Rota/tela de criação | Usuário informa nome, descrição e status inicial |
| T1.3 | Criar edição de dados gerais do formulário. | Formulário de edição | Nome, descrição, ativo/inativo editáveis |
| T1.4 | Criar componente `FormularioBriefingBuilder`. | Componente de construção do formulário | Gerencia seções, ordem e salvamento do agregado |
| T1.5 | Criar componente `SecaoBriefingBuilder`. | Componente de seção | Adicionar, editar, inativar/reativar e ordenar seções |
| T1.6 | Criar componente `PerguntaBriefingBuilder`. | Componente de pergunta | Adicionar, editar, inativar/reativar e ordenar perguntas |
| T1.7 | Implementar inativação sem exclusão. | Botões “Inativar” e “Reativar” | Não existe ação de excluir em nenhum nível |
| T1.8 | Implementar salvamento individual do formulário. | `salvarFormulario(formulario)` | Cada formulário é salvo com suas seções e perguntas |
| T1.9 | Validar formulário antes de ativar. | Feedback de erro | Não ativar formulário sem seção/pergunta mínima, se essa for a regra |
| T1.10 | Criar estados vazios, loading e erro. | UX da configuração | Usuário entende quando não há formulários |

**Aceite do fluxo de configuração:**
- Consigo cadastrar, editar e inativar formulários.
- Consigo cadastrar, editar e inativar seções.
- Consigo cadastrar, editar e inativar perguntas.
- Não consigo excluir formulários, seções ou perguntas.
- A tabela lista todos os formulários cadastrados.
- Cada formulário é salvo individualmente com suas seções e perguntas.

---

# Épico 2 — Fluxo de Preenchimento

Rota existente:  
`/clientes/{idCliente}/aplicacoes/{idAplicacao}`

| Task | Descrição | Entregável | Critério de aceite |
|---|---|---|---|
| T2.1 | Carregar formulários ativos e respostas da aplicação. | Hook integrado à rota | Dados vêm do LocalForage |
| T2.2 | Separar formulários em “pendentes” e “preenchidos”. | Componentes `FormulariosPendentes` e `FormulariosPreenchidos` | Pendente = sem resposta concluída; preenchido = resposta concluída |
| T2.3 | Exibir cards de formulários pendentes. | Área “Formulários não preenchidos” | Cada card tem ação “Preencher” |
| T2.4 | Exibir cards de formulários preenchidos. | Área “Formulários preenchidos” | Cada card tem ação “Visualizar/Editar” |
| T2.5 | Criar componente `FormularioBriefingRenderer`. | Componente principal de preenchimento | Recebe formulário, resposta inicial e callbacks |
| T2.6 | Criar componente `SecaoBriefingRenderer`. | Renderiza seção e perguntas ativas | Respeita ordem e ignora inativos |
| T2.7 | Criar componente `PerguntaBriefingRenderer`. | Renderiza por tipo | Suporta texto, textarea, número, data, select, radio, checkbox e booleano |
| T2.8 | Implementar estado de respostas. | `respostas: Record<string, unknown>` | Alterações controladas por pergunta |
| T2.9 | Implementar salvamento como rascunho. | Botão “Salvar rascunho” | Permite salvar incompleto |
| T2.10 | Implementar conclusão do formulário. | Botão “Concluir” | Valida perguntas obrigatórias antes de concluir |
| T2.11 | Persistir resposta com `idCliente`, `idAplicacao` e `idFormulario`. | `RespostaBriefing` salva | Entidade relaciona-se ao cliente e à aplicação |
| T2.12 | Atualizar listas após salvar/concluir. | Estado reativo | Formulário sai de pendentes e entra em preenchidos |
| T2.13 | Permitir visualizar/editar formulário já preenchido. | Tela de resposta | Mantém dados salvos e permite atualização |
| T2.14 | Tratar formulário inativo. | Regra de exibição | Inativo não aparece como pendente; se já respondido, continua visível em preenchidos |
| T2.15 | Tratar pergunta/seção inativa em respostas antigas. | Renderização segura | Dados antigos não quebram a tela |

**Aceite do fluxo de preenchimento:**
- Na rota da aplicação, aparecem formulários pendentes e preenchidos separadamente.
- Consigo preencher um formulário pendente.
- Consigo salvar rascunho.
- Consigo concluir somente com obrigatórias preenchidas.
- Após concluir, o formulário muda para a área de preenchidos.
- Os dados ficam salvos relacionados ao `idCliente` e `idAplicacao`.
- Formulários inativos não aparecem para novos preenchimentos.

---

# Épico 3 — Integração, testes e acabamento

| Task | Descrição | Entregável | Critério de aceite |
|---|---|---|---|
| T3.1 | Integrar com clientes/aplicações existentes. | Uso dos IDs já existentes | Nenhum dado duplicado ou hardcoded |
| T3.2 | Testes unitários de repositórios. | Jest/Vitest | CRUD, inativação e filtros funcionam |
| T3.3 | Testes unitários de validação. | Testes de regras | Obrigatórias e formulário ativo validados |
| T3.4 | Testes de integração com React Testing Library. | Configuração e preenchimento | Fluxos principais cobertos |
| T3.5 | Teste manual de persistência. | Reload da página | Dados continuam no LocalForage |
| T3.6 | Melhorar UX. | Loading, empty states, mensagens de erro/sucesso | Fluxo compreensível |
| T3.7 | Documentar decisões e componentes. | README ou doc interna | Próximo dev entende a arquitetura |
| T3.8 | Revisar acessibilidade básica. | Labels, foco, teclado | Formulários navegáveis |

---

## Ordem recomendada de implementação

1. T0.1 a T0.6 — tipos, repositórios, hooks e regras.
2. T1.1 a T1.10 — fluxo de configuração completo.
3. T2.1 a T2.15 — fluxo de preenchimento.
4. T3.1 a T3.8 — integração, testes e polimento.

## Definition of Done da feature

- Formulários, seções e perguntas podem ser cadastrados, editados e inativados, mas nunca excluídos.
- Tabela de formulários cadastrados disponível.
- Formulário salvo como agregado com seções e perguntas.
- Na página da aplicação, formulários pendentes e preenchidos aparecem separados.
- Componentização respeitada:
  - `FormularioBriefingBuilder`
  - `SecaoBriefingBuilder`
  - `PerguntaBriefingBuilder`
  - `FormularioBriefingRenderer`
  - `SecaoBriefingRenderer`
  - `PerguntaBriefingRenderer`
- Respostas salvas em entidade relacionada por `idCliente` e `idAplicacao`.
- Persistência funcionando via LocalForage.
- Validações de obrigatoriedade e status funcionando.
- Testes principais passando.