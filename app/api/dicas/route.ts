import { NextRequest, NextResponse } from 'next/server'
import { obterDicaDeHoje } from '@/lib/core/ciclo-dicas'

// GET /api/dicas — retorna a dica (ou sentinela) já fechada hoje pro tenant
// da sessão. Ainda não plugada no dashboard nesta rodada; próxima etapa é o
// dashboard passar a chamar esta rota junto com /api/insights.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const email = req.cookies.get('xray_email')?.value
  if (!email) {
    return NextResponse.json({ error: 'not auth', dica: null }, { status: 401 })
  }
  const dica = await obterDicaDeHoje(email)
  return NextResponse.json({ dica })
}
