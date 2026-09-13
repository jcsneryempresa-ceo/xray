import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function GET(req: NextRequest) {
  const email = req.cookies.get('xray_email')?.value
  if (!email) return NextResponse.json({ error: 'not logged' }, { status: 401 })

  const { data } = await supabaseAdmin.from('tenants').select('*').eq('id', email).single()
  if (!data?.refresh_token) return NextResponse.json({ error: 'no refresh_token, refaca login' }, { status: 401 })

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: data.refresh_token,
      grant_type: 'refresh_token'
    })
  }).then(r => r.json())

  const files = await fetch(`https://www.googleapis.com/drive/v3/files?q='${data.google_folder_id}' in parents&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${tokenRes.access_token}` }
  }).then(r => r.json())

  return NextResponse.json({ folder: data.google_folder_id, files: files.files || [] })
}
