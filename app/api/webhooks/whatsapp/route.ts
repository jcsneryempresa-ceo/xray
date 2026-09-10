import { NextRequest } from 'next/server'
import { handleMensagem } from '@/lib/plugins/atendente-whatsapp/handler'
export async function GET(req: NextRequest){
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')
  if(token === process.env.WHATSAPP_VERIFY_TOKEN) return new Response(challenge)
  return new Response('forbidden', {status:403})
}
export async function POST(req: NextRequest){
  const body = await req.json()
  // extrai mensagem e chama handler
  // await handleMensagem(tenantId, from, text)
  return Response.json({ok:true})
}
