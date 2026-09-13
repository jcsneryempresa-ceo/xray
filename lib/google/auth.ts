import { google } from 'googleapis'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function getAuthClientByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('tenants')
    .select('refresh_token')
    .or(`id.eq.${email},owner_email.eq.${email}`)
    .limit(1)
    .single()
  if (error || !data?.refresh_token) throw new Error('no_refresh_token')
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  oauth2Client.setCredentials({ refresh_token: data.refresh_token })
  const { credentials } = await oauth2Client.refreshAccessToken()
  oauth2Client.setCredentials(credentials)
  return oauth2Client
}

export async function saveTenant(email: string, folderId: string, refreshToken: string | null) {
  const payload: any = {
    id: email,
    owner_email: email,
    nome_negocio: email,
    google_folder_id: folderId,
  }
  if (refreshToken) payload.refresh_token = refreshToken
  const { error } = await supabaseAdmin.from('tenants').upsert(payload, { onConflict: 'id' })
  if (error) throw error
}
