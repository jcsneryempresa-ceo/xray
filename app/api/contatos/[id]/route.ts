import { NextRequest, NextResponse } from 'next/server'
import { getAuthClientByEmail } from '@/lib/google/auth'
import { obterContato, atualizarContato, excluirContato } from '@/lib/core/contatos'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const email = req.cookies.get('xray_email')?.value
  if (!email) return NextResponse.json({ error: 'not auth' }, { status: 401 })

  const mudancas = await req.json()

  try {
    const auth = await getAuthClientByEmail(email)
    const contatoAtual = await obterContato(auth, params.id)
    const atualizado = await atualizarContato(auth, params.id, contatoAtual, mudancas)
    return NextResponse.json({ contato: atualizado })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const email = req.cookies.get('xray_email')?.value
  if (!email) return NextResponse.json({ error: 'not auth' }, { status: 401 })

  try {
    const auth = await getAuthClientByEmail(email)
    await excluirContato(auth, params.id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
