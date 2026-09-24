import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
})

// Garante schema - chama no boot do callback
export async function initSchema(){
  await db.execute(`CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, nome_negocio TEXT, google_folder_id TEXT, refresh_token TEXT, criado_em DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  await db.execute(`CREATE TABLE IF NOT EXISTS plugins_ativos (tenant_id TEXT, plugin_id TEXT, ativo BOOLEAN, PRIMARY KEY (tenant_id, plugin_id))`)
  // Uma linha por tenant por dia: a dica do ciclo (ou a mensagem sentinela,
  // quando nenhum sinal foi suficiente). data no formato YYYY-MM-DD, no fuso
  // do ciclo (America/Sao_Paulo). PRIMARY KEY (tenant_id, data) garante que o
  // cron é idempotente - rodar 2x no mesmo dia não duplica nem sobrescreve.
  await db.execute(`CREATE TABLE IF NOT EXISTS dicas (
    tenant_id TEXT,
    data TEXT,
    tipo TEXT,
    tema TEXT,
    titulo TEXT,
    corpo TEXT,
    acao_json TEXT,
    status TEXT DEFAULT 'pendente',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, data)
  )`)
}
