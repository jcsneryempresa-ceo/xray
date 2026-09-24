import { NextRequest, NextResponse } from 'next/server'
import { db, initSchema } from '@/lib/db/turso'
import { fecharCicloDoDia } from '@/lib/core/ciclo-dicas'

// Vercel Cron chama esta rota 1x/dia (ver vercel.json) e envia automaticamente
// o header Authorization: Bearer $CRON_SECRET quando a env var CRON_SECRET
// está configurada no projeto. Configure-a no painel da Vercel.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ erro: 'não autorizado' }, { status: 401 })
  }

  await initSchema()

  const rs = await db.execute('SELECT id FROM tenants')
  const tenantIds = rs.rows.map((r: any) => r.id as string)

  const resultados = await Promise.allSettled(
    tenantIds.map((id) => fecharCicloDoDia(id))
  )

  const falhas = resultados.filter((r) => r.status === 'rejected').length
  return NextResponse.json({
    tenants: tenantIds.length,
    falhas,
  })
}
