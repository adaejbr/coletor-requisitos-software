# Coletor de Requisitos de Software

Aplicação em React + TypeScript para registrar clientes, aplicações e funcionalidades de requisitos de software em um fluxo hierárquico: Cliente → Aplicação → Funcionalidade.

## Visão geral

O sistema permite:
- cadastrar e gerenciar clientes
- organizar aplicações dentro de cada cliente
- registrar funcionalidades com usuários, entidades e pontos importantes
- exportar dados em JSON e PDF por aplicação
- manter histórico de última alteração por cliente

## Stack

- React
- TypeScript
- Vite
- React Router
- React Hook Form + Zod
- localForage
- @react-pdf/renderer

## Requisitos

- Node.js 18+
- npm ou pnpm

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run dev
```

A aplicação fica disponível em:

```text
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

O artefato final será gerado na pasta `dist`.

## Fluxo principal da aplicação

1. Acesse a home para entrar no hub.
2. Vá para Clientes.
3. Crie um cliente.
4. Dentro do cliente, cadastre aplicações.
5. Dentro da aplicação, cadastre funcionalidades.
6. Exporte a aplicação em JSON ou PDF quando necessário.

## Estrutura de pastas

```text
src/
  components/
  pages/
  services/
  types/
  utils/
```

## Observações

- Os dados ficam persistidos localmente no navegador com localForage.
- A data de última alteração do cliente é atualizada ao alterar qualquer nível da hierarquia.
- O projeto foi pensado para uso desktop, com layout ampliado e navegação clara.

## Deploy

Para disponibilizar em produção, é possível:
- publicar na Vercel com build padrão do Vite
- publicar na Netlify a partir do diretório `dist`
- empacotar o conteúdo da pasta `dist` para entrega interna

Comando de preview local:

```bash
npm run preview
```

