# Coletor de Requisitos de Software

Aplicação em React + TypeScript para registrar e organizar requisitos de software em uma estrutura hierárquica de Cliente → Aplicação → Funcionalidade.

O projeto foi pensado para apoiar a coleta, organização e exportação de informações de projetos, permitindo manter contexto comercial e técnico em um único fluxo.

## Visão geral

A aplicação permite:
- cadastrar e gerenciar clientes
- organizar aplicações dentro de cada cliente
- registrar funcionalidades com descrição, usuários, entidades e relacionamentos
- acompanhar a data da última alteração do cliente
- exportar a aplicação em JSON ou PDF
- navegar com breadcrumbs e consultar tutoriais de uso
- manter os dados persistidos localmente no navegador

## Funcionalidades principais

- Cadastro, edição e remoção de clientes
- Cadastro de aplicações vinculadas a cada cliente
- Cadastro de funcionalidades a partir de cada aplicação
- Estrutura de dados com:
  - nome, descrição e pontos importantes
  - usuários e ações
  - entidades e campos
  - relacionamentos entre entidades
- Atualização automática da data de última alteração
- Exportação de uma aplicação em JSON
- Exportação de uma aplicação em PDF
- Tela inicial com hub de acesso
- Página de tutoriais com passo a passo de uso
- Seed inicial de dados para facilitar demonstração e testes
- Validação de regras com Zod
- Feedback visual com toasts de sucesso e erro

## Stack tecnológica

- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- localForage
- @react-pdf/renderer

## Requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run dev
```

A aplicação será aberta em:

```text
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

O resultado será gerado na pasta `dist`.

## Fluxo principal de uso

1. Acesse a home da aplicação.
2. Vá para a área de clientes.
3. Cadastre um cliente.
4. Dentro do cliente, adicione uma ou mais aplicações.
5. Dentro da aplicação, cadastre funcionalidades.
6. Preencha os dados de usuários, entidades e relacionamentos.
7. Revise, edite ou remova qualquer item quando necessário.
8. Exporte a aplicação em JSON ou PDF para compartilhamento.
9. Use os tutoriais para entender o fluxo completo.

## Estrutura de pastas

```text
src/
  components/
  pages/
    clientes/
    tutoriais/
  services/
  types/
  utils/
```

## Persistência e dados

Os dados são armazenados localmente no navegador por meio de `localforage`.

Quando o armazenamento estiver vazio, a aplicação carrega um conjunto inicial de dados por meio do seed para permitir uso imediato e demonstração.

## Observações importantes

- A data de última alteração do cliente é atualizada automaticamente sempre que houver mudanças em aplicações ou funcionalidades.
- O projeto foi pensado para uso em ambiente desktop, com navegação clara e layout mais amplo.
- A aplicação oferece suporte para a entrega de requisitos em formato pronto para apresentação e aprovação.

## Deploy

Para disponibilizar a aplicação em produção, é possível:
- publicar em Vercel com build padrão do Vite
- publicar em Netlify a partir da pasta `dist`
- empacotar a pasta `dist` para entrega interna

Preview local:

```bash
npm run preview
```

## Status do projeto

Projeto em desenvolvimento ativo, com fluxo funcional de cadastro, edição, visualização e exportação de requisitos de software.

