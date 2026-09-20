import {
  listarArquivos,
  salvarArquivoNaPasta,
  obterConteudoArquivo,
  atualizarArquivoNaPasta,
} from '@/lib/integracoes/google-drive'

// O sistema não decide sozinho quando um insight "acabou" — ele só registra
// o que o usuário decidiu explicitamente (excluir). O status pendente/concluído
// em si é calculado no front, a partir do estado real (ex: WhatsApp conectado ou não).
export type InsightExcluido = {
  titulo: string
  resumo: string
  excluidoEm: string
}

export type EstadoInsights = {
  excluidos: Record<string, InsightExcluido>
}

const NOME_ARQUIVO = 'insights-estado.json'
const ESTADO_VAZIO: EstadoInsights = { excluidos: {} }

async function localizarArquivo(auth: any, folderId: string): Promise<string | null> {
  const arquivos = await listarArquivos(auth, folderId)
  const arquivo = (arquivos || []).find((f) => f.name === NOME_ARQUIVO)
  return arquivo?.id || null
}

export async function obterEstadoInsights(
  auth: any,
  folderId: string
): Promise<{ fileId: string | null; estado: EstadoInsights }> {
  const fileId = await localizarArquivo(auth, folderId)
  if (!fileId) return { fileId: null, estado: ESTADO_VAZIO }
  try {
    const conteudo = await obterConteudoArquivo(auth, fileId)
    const estado = JSON.parse(conteudo) as EstadoInsights
    return { fileId, estado: { excluidos: estado.excluidos || {} } }
  } catch (e) {
    console.error('Erro lendo insights-estado.json:', e)
    return { fileId, estado: ESTADO_VAZIO }
  }
}

async function salvarEstado(
  auth: any,
  folderId: string,
  fileId: string | null,
  estado: EstadoInsights
): Promise<string> {
  const conteudo = JSON.stringify(estado, null, 2)
  if (fileId) {
    await atualizarArquivoNaPasta(auth, fileId, conteudo)
    return fileId
  }
  const arquivo = await salvarArquivoNaPasta(auth, folderId, NOME_ARQUIVO, conteudo)
  if (!arquivo.data.id) throw new Error('Drive não retornou o id do arquivo criado')
  return arquivo.data.id
}

export async function excluirInsight(
  auth: any,
  folderId: string,
  id: string,
  titulo: string,
  resumo: string
): Promise<EstadoInsights> {
  const { fileId, estado } = await obterEstadoInsights(auth, folderId)
  const novoEstado: EstadoInsights = {
    excluidos: {
      ...estado.excluidos,
      [id]: { titulo, resumo, excluidoEm: new Date().toISOString() },
    },
  }
  await salvarEstado(auth, folderId, fileId, novoEstado)
  return novoEstado
}
