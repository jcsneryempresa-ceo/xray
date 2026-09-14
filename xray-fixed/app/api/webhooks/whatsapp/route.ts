import { NextRequest } from 'next/server'

export async function GET(req: NextRequest){
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')
  if(token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('forbidden', {status:403})
}

export async function POST(req: NextRequest){
  const body = await req.json()
  console.log("webhook whatsapp:", JSON.stringify(body).slice(0,500))
  return Response.json({ok:true})
}
