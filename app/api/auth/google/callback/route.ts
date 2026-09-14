export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { saveTenant } from '@/lib/google/auth'

export async function GET(req: NextRequest){
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')
  if(error) return NextResponse.json({error}, {status:400})
  if(!code) return NextResponse.json({error:'no code'}, {status:400})

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({version:'v2', auth: oauth2Client})
  const userInfo = await oauth2.userinfo.get()
  const email = userInfo.data.email || 'usuario'

  const drive = google.drive({version:'v3', auth: oauth2Client})
  const pastaExistente = await drive.files.list({
    q: `name='xray - ${email}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields:'files(id,name,webViewLink)'
  })
  let folderId = pastaExistente.data.files?.[0]?.id
  let webViewLink = (pastaExistente.data.files?.[0] as any)?.webViewLink

  if(!folderId){
    const nova = await drive.files.create({
      requestBody:{name:`xray - ${email}`, mimeType:'application/vnd.google-apps.folder'},
      fields:'id, webViewLink'
    })
    folderId = nova.data.id as string
    webViewLink = nova.data.webViewLink as string
  }

  // Salva refresh_token no Turso (persistente) - só vem na primeira autorização
  const refreshToken = tokens.refresh_token || null
  try {
    await saveTenant(email, folderId!, refreshToken)
  } catch(e){
    console.error('erro turso', e)
  }

  const baseUrl = new URL(req.url).origin
  const res = NextResponse.redirect(new URL('/dashboard', baseUrl))

  // Cookie leve: só email e folder. Token fica no Turso.
  res.cookies.set('xray_email', email, {httpOnly:true, secure:true, sameSite:'lax', maxAge: 60*60*24*30, path:'/'})
  res.cookies.set('xray_folder', folderId || '', {httpOnly:true, secure:true, sameSite:'lax', maxAge: 60*60*24*30, path:'/'})
  // Flag se tem refresh
  res.cookies.set('xray_has_refresh', refreshToken ? '1' : '0', {httpOnly:false, maxAge: 60*60*24*30, path:'/'})
  if(webViewLink) res.cookies.set('xray_folder_link', webViewLink, {httpOnly:false, maxAge: 60*60*24*30, path:'/'})

  return res
}
