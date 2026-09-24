import { db } from '@/lib/db/turso'
import type { TemaDica } from './temas-dicas'
import type { AcaoDica } from './dicas-tipos'

export type StatusDica = 'pendente' | 'aplicada' | 'ignorada' | 'arquivada'

export type DicaDoDia = {
  tenantId: string
  data: string // YYYY-MM-DD, fuso America/Sao_Paulo
  tipo: 'dica' | 'sentinela'
  tema: TemaDica | null
  titulo: string
  corpo: string
  acao: AcaoDica
  status: StatusDica
}

const MENSAGEM_SENTINELA = {
  titulo: 'Nada de urgente por hoje',
  corpo: 'Mas continuo atento e aviso assim que aparecer alguma novidade.',
}

function dataDeHojeSaoPaulo(): string {
  // America/Sao_Paulo não observa horário de verão desde 2019 (fixo UTC-3),
  // então dá pra formatar direto sem lib externa.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

async function jaFechouHoje(tenantId: string, data: string): Promise<boolean> {
  const rs = await db.execute({
    sql: 'SELECT 1 FROM dicas WHERE tenant_id = ? AND data = ?',
    args: [tenantId, data],
  })
  return rs.rows.length > 0
}

async function salvarDicaDoDia(dica: DicaDoDia): Promise<void> {
  await db.execute({
    sql: `INSERT INTO dicas (tenant_id, data, tipo, tema, titulo, corpo, acao_json, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(tenant_id, data) DO NOTHING`,
    args: [
      dica.tenantId,
      dica.data,
      dica.tipo,
      dica.tema,
      dica.titulo,
      dica.corpo,
      dica.acao ? JSON.stringify(dica.acao) : null,
      dica.status,
    ],
  })
}

// Fecha o ciclo diário de UM tenant. Idempotente: se já rodou hoje, não faz nada.
//
// TODO (próxima rodada): antes de cair direto na sentinela, chamar a extração
// de sinal (LLM, reaproveitando lib/ia/motor.ts) a partir das conversas do dia
// + estado dos plugins ativos, aplicar os 3 critérios de suficiência (tema,
// acionável, sem repetição - consultando esta mesma tabela `dicas` como
// histórico) e, se houver sinal válido, salvar tipo 'dica' com tema/ação reais
// no lugar da sentinela.
export async function fecharCicloDoDia(tenantId: string): Promise<DicaDoDia | null> {
  const data = dataDeHojeSaoPaulo()
  if (await jaFechouHoje(tenantId, data)) return null

  const dica: DicaDoDia = {
    tenantId,
    data,
    tipo: 'sentinela',
    tema: null,
    titulo: MENSAGEM_SENTINELA.titulo,
    corpo: MENSAGEM_SENTINELA.corpo,
    acao: null,
    status: 'pendente',
  }
  await salvarDicaDoDia(dica)
  return dica
}

export async function obterDicaDeHoje(tenantId: string): Promise<DicaDoDia | null> {
  const data = dataDeHojeSaoPaulo()
  const rs = await db.execute({
    sql: 'SELECT * FROM dicas WHERE tenant_id = ? AND data = ?',
    args: [tenantId, data],
  })
  const row = rs.rows[0] as any
  if (!row) return null
  return {
    tenantId: row.tenant_id,
    data: row.data,
    tipo: row.tipo,
    tema: row.tema,
    titulo: row.titulo,
    corpo: row.corpo,
    acao: row.acao_json ? JSON.parse(row.acao_json) : null,
    status: row.status || 'pendente',
  }
}

// Usado pelos botões APLICAR / IGNORAR / arquivar (x) no dashboard.
export async function atualizarStatusDica(
  tenantId: string,
  status: StatusDica
): Promise<void> {
  const data = dataDeHojeSaoPaulo()
  await db.execute({
    sql: 'UPDATE dicas SET status = ? WHERE tenant_id = ? AND data = ?',
    args: [status, tenantId, data],
  })
}
