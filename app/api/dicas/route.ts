import { NextRequest, NextResponse } from 'next/server'
import { obterDicaDeHoje, atualizarStatusDica, StatusDica } from '@/lib/core/ciclo-dicas'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getEmail(req: NextRequest) {
  return req.cookies.get('xray_email')?.value
}

// GET /api/dicas — retorna a dica (ou sentinela) já fechada hoje pro tenant da sessão.
export async function GET(req: NextRequest) {
  const email = getEmail(req)
  if (!email) {
    return NextResponse.json({ error: 'not auth', dica: null }, { status: 401 })
  }
  const dica = await obterDicaDeHoje(email)
  return NextResponse.json({ dica })
}

// POST /api/dicas — { status: 'aplicada' | 'ignorada' | 'arquivada' }
// Usado pelos botões APLICAR / IGNORAR / arquivar (x) do card no dashboard.
export async function POST(req: NextRequest) {
  const email = getEmail(req)
  if (!email) {
    return NextResponse.json({ error: 'not auth' }, { status: 401 })
  }
  const body = await req.json()
  const status = body.status as StatusDica
  if (!['aplicada', 'ignorada', 'arquivada'].includes(status)) {
    return NextResponse.json({ error: 'status inválido' }, { status: 400 })
  }
  await atualizarStatusDica(email, status)
  return NextResponse.json({ ok: true })
}
