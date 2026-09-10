import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(req: NextRequest){
  // protege (painel) se não logado - MVP deixa passar
  return NextResponse.next()
}
export const config = { matcher: ['/dashboard/:path*','/clientes/:path*'] }
