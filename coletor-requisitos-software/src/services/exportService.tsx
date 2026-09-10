/* eslint-disable react-refresh/only-export-components */
import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer'
import { storageService } from './storageService'
import type { Cliente, Funcionalidade } from '../types'

export interface AplicacaoExportPayload {
  cliente: {
    id: string
    nome: string
    status: string
    dataUltimaAlteracao: string
  }
  aplicacao: {
    id: string
    nome: string
    funcionalidades: Array<{
      id: string
      nome: string
      descricao: string
      pontosImportantes: string
      usuarios: Array<{ nome: string; acoes: string[] }>
      entidades: Array<{
        nome: string
        campos: string[]
        relacionamentos: Array<{ entidadeOrigemId: string; entidadeDestinoId: string }>
      }>
    }>
  }
}

const formatarData = (valor: Date | string | undefined): string => {
  if (!valor) return ''

  const data = valor instanceof Date ? valor : new Date(valor)
  if (Number.isNaN(data.getTime())) {
    return ''
  }

  return data.toISOString()
}

const normalizarTextos = (valor: string | undefined): string => valor?.trim() ?? ''

const sanitizeFileName = (valor: string): string =>
  valor
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'aplicacao'

export const montarPayloadAplicacao = async (
  clienteId: string,
  aplicacaoId: string,
): Promise<AplicacaoExportPayload | null> => {
  const cliente = await storageService.buscarCliente(clienteId)
  if (!cliente) {
    return null
  }

  const aplicacao = cliente.aplicacoes.find((item) => item.id === aplicacaoId)
  if (!aplicacao) {
    return null
  }

  const funcionalidades = aplicacao.funcionalidades.map((funcionalidade: Funcionalidade) => ({
    id: funcionalidade.id,
    nome: funcionalidade.nome,
    descricao: funcionalidade.descricao,
    pontosImportantes: funcionalidade.pontosImportantes,
    usuarios: funcionalidade.usuarios.map((usuario) => ({
      nome: usuario.nome,
      acoes: usuario.acoes,
    })),
    entidades: funcionalidade.entidades.map((entidade) => ({
      nome: entidade.nome,
      campos: entidade.campos,
      relacionamentos: entidade.relacionamentos,
    })),
  }))

  return {
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      status: cliente.status,
      dataUltimaAlteracao: formatarData(cliente.dataUltimaAlteracao),
    },
    aplicacao: {
      id: aplicacao.id,
      nome: aplicacao.nome,
      funcionalidades,
    },
  }
}

export const exportarAplicacaoJson = async (clienteId: string, aplicacaoId: string): Promise<void> => {
  const payload = await montarPayloadAplicacao(clienteId, aplicacaoId)
  if (!payload) {
    throw new Error('Cliente ou aplicação não encontrados.')
  }

  const conteudo = JSON.stringify(payload, null, 2)
  const blob = new Blob([conteudo], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `aplicacao_${sanitizeFileName(payload.aplicacao.nome)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    gap: 12,
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: '#475569',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  section: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  list: {
    fontSize: 11,
    lineHeight: 1.6,
    marginLeft: 12,
    marginTop: 4,
  },
  small: {
    fontSize: 10,
    color: '#334155',
  },
})

export const AplicacaoPDF = ({ cliente, aplicacao }: { cliente: Cliente; aplicacao: { id: string; nome: string; funcionalidades: Funcionalidade[] } }) => {
  const totalFuncionalidades = aplicacao.funcionalidades.length
  const totalUsuarios = aplicacao.funcionalidades.reduce(
    (total, funcionalidade) => total + funcionalidade.usuarios.length,
    0,
  )
  const totalEntidades = aplicacao.funcionalidades.reduce(
    (total, funcionalidade) => total + funcionalidade.entidades.length,
    0,
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{aplicacao.nome}</Text>
          <Text style={styles.subtitle}>Cliente: {cliente.nome}</Text>
          <Text style={styles.subtitle}>Status: {cliente.status}</Text>
          <Text style={styles.subtitle}>Última alteração: {formatarData(cliente.dataUltimaAlteracao)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Resumo</Text>
          <Text style={styles.paragraph}>Total de funcionalidades: {totalFuncionalidades}</Text>
          <Text style={styles.paragraph}>Total de usuários: {totalUsuarios}</Text>
          <Text style={styles.paragraph}>Total de entidades: {totalEntidades}</Text>
        </View>

        {aplicacao.funcionalidades.length === 0 ? (
          <View style={styles.section}>
            <Text style={styles.paragraph}>Nenhuma funcionalidade cadastrada para esta aplicação.</Text>
          </View>
        ) : (
          aplicacao.funcionalidades.map((funcionalidade, index) => (
            <View key={funcionalidade.id} style={styles.section} break>
              <Text style={styles.sectionTitle}>{index + 1}. {normalizarTextos(funcionalidade.nome) || 'Funcionalidade sem nome'}</Text>
              <Text style={styles.label}>Descrição</Text>
              <Text style={styles.paragraph}>{normalizarTextos(funcionalidade.descricao) || 'Descrição não informada.'}</Text>

              <Text style={styles.label}>Pontos importantes</Text>
              <Text style={styles.paragraph}>{normalizarTextos(funcionalidade.pontosImportantes) || 'Nenhum ponto importante informado.'}</Text>

              <Text style={styles.label}>Usuários</Text>
              {funcionalidade.usuarios.length === 0 ? (
                <Text style={styles.small}>Nenhum usuário associado.</Text>
              ) : (
                funcionalidade.usuarios.map((usuario) => (
                  <Text key={`${funcionalidade.id}-${usuario.nome}`} style={styles.list}>
                    • {usuario.nome}: {usuario.acoes.length ? usuario.acoes.join(', ') : 'Sem ações informadas'}
                  </Text>
                ))
              )}

              <Text style={styles.label}>Entidades</Text>
              {funcionalidade.entidades.length === 0 ? (
                <Text style={styles.small}>Nenhuma entidade cadastrada.</Text>
              ) : (
                funcionalidade.entidades.map((entidade, entidadeIndex) => (
                  <View key={`${funcionalidade.id}-${entidade.id || entidadeIndex}`} style={{ marginTop: 8 }}>
                    <Text style={styles.paragraph}>- {entidade.nome}</Text>
                    <Text style={styles.small}>Campos: {entidade.campos.length ? entidade.campos.join(', ') : 'Nenhum campo informado'}</Text>
                    <Text style={styles.small}>
                      Relacionamentos:{' '}
                      {entidade.relacionamentos.length
                        ? entidade.relacionamentos
                            .map(
                              (relacionamento) =>
                                `${relacionamento.entidadeOrigem} (${relacionamento.entidadeOrigemId}) → ${relacionamento.entidadeDestino} (${relacionamento.entidadeDestinoId})`,
                              )
                            .join('; ')
                        : 'Nenhum relacionamento definido'}
                    </Text>
                  </View>
                ))
              )}
            </View>
          ))
        )}
      </Page>
    </Document>
  )
}

export const exportarAplicacaoPdf = async (clienteId: string, aplicacaoId: string): Promise<void> => {
  const cliente = await storageService.buscarCliente(clienteId)
  if (!cliente) {
    throw new Error('Cliente não encontrado.')
  }

  const aplicacao = cliente.aplicacoes.find((item) => item.id === aplicacaoId)
  if (!aplicacao) {
    throw new Error('Aplicação não encontrada.')
  }

  const blob = await pdf(<AplicacaoPDF cliente={cliente} aplicacao={aplicacao} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `aplicacao_${sanitizeFileName(aplicacao.nome)}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
