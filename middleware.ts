import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest){
  const email = req.cookies.get('xray_email')?.value
  const folder = req.cookies.get('xray_folder')?.value
  const isOnboarding = req.nextUrl.pathname.startsWith('/onboarding')
  const isAuth = req.nextUrl.pathname.startsWith('/api/auth')

  // Se está tentando acessar painel sem auth, manda pro onboarding
  if(!email || !folder){
    if(req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/contatos') || req.nextUrl.pathname.startsWith('/plugins') || req.nextUrl.pathname.startsWith('/config')){
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*','/contatos/:path*','/plugins/:path*','/config/:path*'] }
