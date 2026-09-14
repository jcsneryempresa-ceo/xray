import { NextRequest, NextResponse } from 'next/server'
import { getAuthClientByEmail } from '@/lib/google/auth'
import { listarContatos, criarContato } from '@/lib/core/contatos'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getSessao(req: NextRequest) {
  const email = req.cookies.get('xray_email')?.value
  const folderId = req.cookies.get('xray_folder')?.value
  return { email, folderId }
}

export async function GET(req: NextRequest) {
  const { email, folderId } = getSessao(req)
  if (!email || !folderId) {
    return NextResponse.json({ error: 'not auth', contatos: [] }, { status: 401 })
  }
  try {
    const auth = await getAuthClientByEmail(email)
    const contatos = await listarContatos(auth, folderId)
    return NextResponse.json({ contatos })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, contatos: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { email, folderId } = getSessao(req)
  if (!email || !folderId) {
    return NextResponse.json({ error: 'not auth' }, { status: 401 })
  }

  const body = await req.json()
  if (!body.nome) {
    return NextResponse.json({ error: 'nome é obrigatório' }, { status: 400 })
  }

  try {
    const auth = await getAuthClientByEmail(email)
    const contato = await criarContato(auth, folderId, body)
    return NextResponse.json({ contato }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
