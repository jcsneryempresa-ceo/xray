
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(req: NextRequest){
  const code = req.nextUrl.searchParams.get('code')
  if(!code) return NextResponse.json({error:'no code'}, {status:400})
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  
  // pega email
  const oauth2 = google.oauth2({version:'v2', auth: oauth2Client})
  const userInfo = await oauth2.userinfo.get()
  const email = userInfo.data.email || 'usuario'
  
  // cria pasta xray - email
  const drive = google.drive({version:'v3', auth: oauth2Client})
  const pastaExistente = await drive.files.list({q: `name='xray - ${email}' and mimeType='application/vnd.google-apps.folder' and trashed=false`, fields:'files(id,name)'})
  let folderId = pastaExistente.data.files?.[0]?.id
  let link = ''
  if(!folderId){
    const nova = await drive.files.create({requestBody:{name:`xray - ${email}`, mimeType:'application/vnd.google-apps.folder'}, fields:'id, webViewLink'})
    folderId = nova.data.id as string
    link = nova.data.webViewLink as string
  }

  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('xray_token', JSON.stringify(tokens), {httpOnly:true, maxAge: 60*60*24*30})
  res.cookies.set('xray_email', email, {httpOnly:true, maxAge: 60*60*24*30})
  res.cookies.set('xray_folder', folderId || '', {httpOnly:true, maxAge: 60*60*24*30})
  return res
}
