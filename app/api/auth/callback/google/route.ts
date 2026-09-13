import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect('https://xray-brown.vercel.app?error=no_code')
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()
    console.log('GOOGLE TOKENS:', tokens)

    if (!tokenRes.ok) throw new Error(JSON.stringify(tokens))

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const user = await userRes.json()
    const email = user.email
    if (!email) throw new Error('No email from Google')

    const tenantId = email.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    // Salva direto no Supabase sem depender do lib/db
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('tenants').upsert({
      id: tenantId,
      owner_email: email,
      google_refresh_token: tokens.refresh_token || null,
      google_access_token: tokens.access_token,
      google_folder_id: 'root',
    }, { onConflict: 'id' })

    if (error) throw error

    console.log('TENANT SAVED:', tenantId)

    const response = NextResponse.redirect('https://xray-brown.vercel.app')
    response.cookies.set('tenant_id', tenantId, { path: '/' })
    response.cookies.set('owner_email', email, { path: '/' })
    return response

  } catch (e: any) {
    console.error('CALLBACK ERROR:', e.message)
    return NextResponse.redirect(`https://xray-brown.vercel.app?error=${encodeURIComponent(e.message)}`)
  }
}
