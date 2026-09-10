import { createClient } from '@libsql/client'
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
})
// Salva tenants: id, nomeNegocio, googleFolderId, refreshToken criptografado
export async function initSchema(){
  await db.execute(`CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, nome_negocio TEXT, google_folder_id TEXT, refresh_token TEXT, criado_em DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  await db.execute(`CREATE TABLE IF NOT EXISTS plugins_ativos (tenant_id TEXT, plugin_id TEXT, ativo BOOLEAN, PRIMARY KEY (tenant_id, plugin_id))`)
}
