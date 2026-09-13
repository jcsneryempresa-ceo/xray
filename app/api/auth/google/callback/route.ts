import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'no code' }, { status: 400 })

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    })
  })
  const tokens = await tokenRes.json()
  if (!tokens.access_token) {
    return NextResponse.json({ error: 'google token fail', details: tokens }, { status: 400 })
  }

  const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  }).then(r => r.json())

  const email = userInfo.email
  const id = email

  let folderId = ''
  try {
    const driveRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `xray - ${email}`,
        mimeType: 'application/vnd.google-apps.folder'
      })
    }).then(r => r.json())
    folderId = driveRes.id || ''
  } catch {}

  await supabaseAdmin.from('tenants').upsert({
    id,
    email,
    google_folder_id: folderId,
    refresh_token: tokens.refresh_token || null
  }, { onConflict: 'id' })

  const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
  res.cookies.set('xray_email', email, { path: '/', maxAge: 2592000 })
  if (folderId) res.cookies.set('xray_folder', folderId, { path: '/', maxAge: 2592000 })
  return res
}
