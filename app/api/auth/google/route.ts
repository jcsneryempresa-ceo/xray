
import { NextResponse } from 'next/server'
export async function GET(){
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirect = process.env.GOOGLE_REDIRECT_URI
  const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`
  return NextResponse.redirect(url)
}
