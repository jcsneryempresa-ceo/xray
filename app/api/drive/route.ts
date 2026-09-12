
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(req: NextRequest){
  const tokenStr = req.cookies.get('xray_token')?.value
  const folderId = req.cookies.get('xray_folder')?.value
  if(!tokenStr || !folderId) return NextResponse.json({files:[]})
  const tokens = JSON.parse(tokenStr)
  const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI)
  oauth2Client.setCredentials(tokens)
  const drive = google.drive({version:'v3', auth: oauth2Client})
  const list = await drive.files.list({q:`'${folderId}' in parents and trashed=false`, fields:'files(id,name,webViewLink,createdTime)'})
  return NextResponse.json({files:list.data.files, folderId})
}

export async function POST(req: NextRequest){
  const body = await req.json()
  const tokenStr = req.cookies.get('xray_token')?.value
  const folderId = req.cookies.get('xray_folder')?.value
  if(!tokenStr || !folderId) return NextResponse.json({error:'not auth'}, {status:401})
  const tokens = JSON.parse(tokenStr)
  const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI)
  oauth2Client.setCredentials(tokens)
  const drive = google.drive({version:'v3', auth: oauth2Client})
  const nome = body.nome || `cliente-${Date.now()}.json`
  const conteudo = JSON.stringify(body, null, 2)
  const file = await drive.files.create({requestBody:{name:nome, parents:[folderId]}, media:{mimeType:'application/json', body:conteudo}, fields:'id,webViewLink'})
  return NextResponse.json(file.data)
}
