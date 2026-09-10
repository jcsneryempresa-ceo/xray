import { NextRequest } from 'next/server'
export async function GET(req: NextRequest){
  // troca code por tokens, salva refresh_token, cria pasta xray - negocio
  return Response.json({ok:true, msg:'Google callback - criar pasta drive.file aqui'})
}
