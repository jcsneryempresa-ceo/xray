import { NextRequest, NextResponse } from 'next/server'
import { getAuthClientByEmail } from '@/lib/google/auth'
import { listarArquivos, salvarArquivoNaPasta } from '@/lib/integracoes/google-drive'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest){
  const email = req.cookies.get('xray_email')?.value
  const folderId = req.cookies.get('xray_folder')?.value
  if(!email || !folderId) return NextResponse.json({files:[], error:'not auth'}, {status:401})
  try{
    const auth = await getAuthClientByEmail(email)
    const files = await listarArquivos(auth, folderId)
    return NextResponse.json({files, folderId})
  } catch(e:any){
    return NextResponse.json({error:e.message, files:[]}, {status:401})
  }
}

export async function POST(req: NextRequest){
  const body = await req.json()
  const email = req.cookies.get('xray_email')?.value
  const folderId = req.cookies.get('xray_folder')?.value
  if(!email || !folderId) return NextResponse.json({error:'not auth'}, {status:401})
  try{
    const auth = await getAuthClientByEmail(email)
    const nome = body.nome || `cliente-${Date.now()}.json`
    const conteudo = JSON.stringify(body, null, 2)
    const file = await salvarArquivoNaPasta(auth, folderId, nome, conteudo)
    return NextResponse.json(file.data)
  } catch(e:any){
    return NextResponse.json({error:e.message}, {status:500})
  }
}
