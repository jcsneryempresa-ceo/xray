import { NextRequest, NextResponse } from 'next/server'
import { getAuthClientByEmail } from '@/lib/google/auth'
import { obterEstadoInsights, excluirInsight } from '@/lib/core/insights'

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
    return NextResponse.json({ error: 'not auth', estado: { excluidos: {} } }, { status: 401 })
  }
  try {
    const auth = await getAuthClientByEmail(email)
    const { estado } = await obterEstadoInsights(auth, folderId)
    return NextResponse.json({ estado })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, estado: { excluidos: {} } }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { email, folderId } = getSessao(req)
  if (!email || !folderId) {
    return NextResponse.json({ error: 'not auth' }, { status: 401 })
  }

  const body = await req.json()
  if (!body.id || !body.titulo) {
    return NextResponse.json({ error: 'id e titulo são obrigatórios' }, { status: 400 })
  }

  try {
    const auth = await getAuthClientByEmail(email)
    const estado = await excluirInsight(auth, folderId, body.id, body.titulo, body.resumo || '')
    return NextResponse.json({ estado })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
