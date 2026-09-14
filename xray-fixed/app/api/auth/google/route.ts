export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server'

export async function GET(){
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirect = process.env.GOOGLE_REDIRECT_URI
  if(!clientId || !redirect) return NextResponse.json({error:'Missing GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI'}, {status:500})
  const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')
  // access_type offline + prompt consent garante refresh_token na primeira vez
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&include_granted_scopes=false`
  return NextResponse.redirect(url)
}
