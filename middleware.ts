import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest){
  const email = req.cookies.get('xray_email')?.value
  const folder = req.cookies.get('xray_folder')?.value
  const isOnboarding = req.nextUrl.pathname.startsWith('/onboarding')
  const isAuth = req.nextUrl.pathname.startsWith('/api/auth')

  // Se está tentando acessar painel sem auth, manda pro onboarding
  if(!email || !folder){
    if(req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/clientes') || req.nextUrl.pathname.startsWith('/plugins')){
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*','/clientes/:path*','/plugins/:path*'] }
