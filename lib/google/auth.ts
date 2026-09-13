
import { google } from 'googleapis'
import { db } from '@/lib/db/turso'

export async function getAuthClientByEmail(email: string) {
  const rs = await db.execute({ sql: 'SELECT refresh_token FROM tenants WHERE id = ?', args: [email] })
  const row = rs.rows[0] as any
  if (!row?.refresh_token) throw new Error('no_refresh_token')

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  oauth2Client.setCredentials({ refresh_token: row.refresh_token })
  // força refresh
  const { credentials } = await oauth2Client.refreshAccessToken()
  oauth2Client.setCredentials(credentials)
  return oauth2Client
}

export async function saveTenant(email: string, folderId: string, refreshToken: string | null) {
  await db.execute({ sql: `CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, nome_negocio TEXT, google_folder_id TEXT, refresh_token TEXT, criado_em DATETIME DEFAULT CURRENT_TIMESTAMP)`, args: [] })
  if (refreshToken) {
    await db.execute({
      sql: `INSERT INTO tenants (id, nome_negocio, google_folder_id, refresh_token) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET google_folder_id=excluded.google_folder_id, refresh_token=excluded.refresh_token`,
      args: [email, email, folderId, refreshToken]
    })
  } else {
    await db.execute({
      sql: `INSERT INTO tenants (id, nome_negocio, google_folder_id) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET google_folder_id=excluded.google_folder_id`,
      args: [email, email, folderId]
    })
  }
}
