import { NextResponse } from 'next/server'
import { saveTenant } from '@/lib/db/supabase'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect('https://xray-brown.vercel.app?error=no_code')
  }

  try {
    // 1. Troca o code pelos tokens do Google
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

    if (!tokenRes.ok) {
      console.error('Token error', tokens)
      return NextResponse.redirect('https://xray-brown.vercel.app?error=token_failed')
    }

    // 2. Pega email do usuário
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const user = await userRes.json()
    console.log('GOOGLE USER:', user)

    const email = user.email
    if (!email) throw new Error('No email from Google')

    // 3. Salva no Supabase (tenants)
    // Cria um ID a partir do email
    const tenantId = email.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    await saveTenant({
      id: tenantId,
      owner_email: email,
      google_refresh_token: tokens.refresh_token || null,
      google_access_token: tokens.access_token,
      google_folder_id: 'root', // por enquanto, depois cria pasta
    })

    console.log('TENANT SAVED:', tenantId)

    // 4. Redireciona e seta um cookie simples
    const response = NextResponse.redirect('https://xray-brown.vercel.app/dashboard')
    response.cookies.set('tenant_id', tenantId, { path: '/', httpOnly: false })
    response.cookies.set('owner_email', email, { path: '/', httpOnly: false })
    return response

  } catch (e: any) {
    console.error('CALLBACK ERROR:', e)
    return NextResponse.redirect(`https://xray-brown.vercel.app?error=${encodeURIComponent(e.message)}`)
  }
}
