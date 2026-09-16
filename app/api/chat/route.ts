import { NextRequest, NextResponse } from 'next/server'
import { chamarIA } from '@/lib/ia/motor'
import { PROMPT_CENTRAL } from '@/lib/ia/prompts/central'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const email = req.cookies.get('xray_email')?.value
  if (!email) return NextResponse.json({ error: 'not auth' }, { status: 401 })

  const body = await req.json()
  const historico: { role: 'user' | 'assistant'; content: string }[] = body.historico || []

  if (!body.mensagem) {
    return NextResponse.json({ error: 'mensagem é obrigatória' }, { status: 400 })
  }

  try {
    const resposta = await chamarIA([
      { role: 'system', content: PROMPT_CENTRAL },
      ...historico,
      { role: 'user', content: body.mensagem },
    ])
    return NextResponse.json({ resposta })
  } catch (e: any) {
    console.error('ERRO NO CHAT:', e)
    return NextResponse.json({ error: e.message || 'erro desconhecido' }, { status: 500 })
  }
}
