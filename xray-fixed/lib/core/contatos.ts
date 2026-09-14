import { randomUUID } from 'crypto'
import {
  listarArquivos,
  salvarArquivoNaPasta,
  obterConteudoArquivo,
  atualizarArquivoNaPasta,
  moverParaLixeira,
} from '@/lib/integracoes/google-drive'

export type HistoricoItem = {
  data: string
  tipo: 'mensagem' | 'agendamento' | 'nota'
  conteudo: string
}

export type Papel = 'cliente' | 'fornecedor' | 'indefinido'

export type Contato = {
  id: string
  nome: string // único campo garantido - pode ser um apelido ("Seu Neco de irmã da Josy")
  telefone?: string
  papel: Papel
  origem: 'whatsapp' | 'manual' | 'instagram'
  tags: string[]
  notas: string
  criadoEm: string
  atualizadoEm: string
  historico: HistoricoItem[]
}

export type ContatoComArquivo = Contato & { fileId: string }

const PREFIXO_ARQUIVO = 'contato-'

export async function listarContatos(auth: any, folderId: string): Promise<ContatoComArquivo[]> {
  const arquivos = await listarArquivos(auth, folderId)
  const fichas = (arquivos || []).filter(
    (f) => f.name?.startsWith(PREFIXO_ARQUIVO) && f.name.endsWith('.json')
  )

  const contatos: ContatoComArquivo[] = []
  for (const arquivo of fichas) {
    if (!arquivo.id) continue
    try {
      const conteudo = await obterConteudoArquivo(auth, arquivo.id)
      const contato = JSON.parse(conteudo) as Contato
      contatos.push({ ...contato, fileId: arquivo.id })
    } catch (e) {
      console.error(`Erro lendo ficha ${arquivo.id}:`, e)
    }
  }

  return contatos.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
}

export async function criarContato(
  auth: any,
  folderId: string,
  dados: {
    nome: string
    telefone?: string
    papel?: Papel
    origem?: Contato['origem']
    tags?: string[]
    notas?: string
  }
): Promise<ContatoComArquivo> {
  const agora = new Date().toISOString()
  const contato: Contato = {
    id: randomUUID(),
    nome: dados.nome,
    telefone: dados.telefone,
    papel: dados.papel || 'indefinido',
    origem: dados.origem || 'manual',
    tags: dados.tags || [],
    notas: dados.notas || '',
    criadoEm: agora,
    atualizadoEm: agora,
    historico: [],
  }

  const nomeArquivo = `${PREFIXO_ARQUIVO}${contato.id}.json`
  const arquivo = await salvarArquivoNaPasta(auth, folderId, nomeArquivo, JSON.stringify(contato, null, 2))

  if (!arquivo.data.id) throw new Error('Drive não retornou o id do arquivo criado')
  return { ...contato, fileId: arquivo.data.id }
}

export async function obterContato(auth: any, fileId: string): Promise<ContatoComArquivo> {
  const conteudo = await obterConteudoArquivo(auth, fileId)
  const contato = JSON.parse(conteudo) as Contato
  return { ...contato, fileId }
}

export async function atualizarContato(
  auth: any,
  fileId: string,
  contatoAtual: Contato,
  mudancas: Partial<Omit<Contato, 'id' | 'criadoEm'>>
): Promise<Contato> {
  const atualizado: Contato = {
    ...contatoAtual,
    ...mudancas,
    atualizadoEm: new Date().toISOString(),
  }
  await atualizarArquivoNaPasta(auth, fileId, JSON.stringify(atualizado, null, 2))
  return atualizado
}

export async function adicionarHistorico(
  auth: any,
  fileId: string,
  contatoAtual: Contato,
  item: HistoricoItem
): Promise<Contato> {
  return atualizarContato(auth, fileId, contatoAtual, {
    historico: [...contatoAtual.historico, item],
  })
}

export async function excluirContato(auth: any, fileId: string): Promise<void> {
  await moverParaLixeira(auth, fileId)
}
