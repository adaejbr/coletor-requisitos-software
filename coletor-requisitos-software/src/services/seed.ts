import type { Cliente } from '../types'

export const seedClientes: Cliente[] = [
  {
    id: 'cliente-1',
    nome: 'ACME',
    dataUltimaAlteracao: new Date('2026-09-08T00:00:00.000Z'),
    status: 'em andamento',
    aplicacoes: [
      {
        id: 'app-1',
        nome: 'Portal de Vendas',
        funcionalidades: [
          {
            id: 'func-1',
            nome: 'Cadastro de Usuários',
            descricao: 'Fluxo de criação e edição de usuários do sistema.',
            pontosImportantes: 'Validações de email, papel do usuário e acesso por perfil.',
            usuarios: [
              { id: 'user-1', nome: 'Administrador', acoes: ['criar', 'editar', 'excluir'] },
              { id: 'user-2', nome: 'Operador', acoes: ['visualizar', 'atualizar'] },
            ],
            entidades: [
              {
                id: 'ent-1',
                nome: 'Usuário',
                campos: ['nome', 'email', 'perfil'],
                relacionamentos: [{ entidadeOrigemId: 'ent-1', entidadeDestinoId: 'ent-2' }],
              },
              {
                id: 'ent-2',
                nome: 'Perfil',
                campos: ['nome', 'permissoes'],
                relacionamentos: [],
              },
            ],
          },
        ],
      },
    ],
  },
]
