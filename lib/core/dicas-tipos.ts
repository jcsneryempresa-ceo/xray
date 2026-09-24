import type { TemaDica } from './temas-dicas'

// Plano de Dicas — especificação de produto (igual pra todo cliente; o que
// varia por usuário é só a execução: sinais da conversa dele, tom capturado,
// plugins que ele tem ativos). Documentação completa: ver Plano de Dicas.docx.

// Uma Dica é o mesmo objeto que já existia como "Insight" no core — só
// deixamos de usar a palavra "insight" na nomenclatura voltada a produto.
// A persistência (insights-estado.json) e o comportamento de arquivar
// (excluirInsight) permanecem os mesmos; não é uma entidade nova.

export type FonteDica =
  | { tipo: 'conversa' } // WhatsApp ou Central
  | { tipo: 'plugin'; plugin: string }
  | { tipo: 'pesquisa_externa'; disparadaPor: 'conversa'; query: string }

export type SinalDica = {
  tema: TemaDica
  fonte: FonteDica
  acionavel: boolean // existe algo concreto que o dono pode fazer?
  resumoSinal: string
}

// Critério de corte antes de um sinal virar dica de verdade:
// 1) casa com um tema do catálogo
// 2) é acionável (mesmo que a ação seja só orientativa, fora do app)
// 3) não repete uma dica igual/parecida arquivada recentemente
//    (consulta ao histórico existente em insights-estado.json)
export type CriterioSinalSuficiente = (
  sinal: SinalDica,
  historicoRecente: { titulo: string; resumo: string; excluidoEm: string }[]
) => boolean

// Ação de uma dica é travada ao que o app já faz hoje — nunca pode implicar
// crescimento de produto (plugin novo, tela nova). Sem ação real disponível,
// a dica nasce só com IGNORAR + arquivar (sem "aplicar" forçado).
export type AcaoDica =
  | { tipo: 'ativar_plugin'; plugin: string; texto: string }
  | { tipo: 'abrir_contato'; contatoId: string; texto: string }
  | { tipo: 'link'; href: string; texto: string }
  | null // dica orientativa: diagnóstico + possíveis soluções, sem imperativo

export type CicloDicas = {
  horarioFechamentoDiario: string // ex: "17:00" — horário local do dono
  limiteDicasPorDia: number // teto por plano; MVP = 1
  mensagemSentinelaSeVazio: string // não conta como dica, não some o cadastro
}

// TODO (fora do escopo desta rodada): implementar o job de fechamento diário
// (cron), a extração de sinais a partir da conversa (LLM) e a pesquisa externa
// condicional (web search só quando o tema já surgiu em conversa). Este
// arquivo formaliza o contrato para quando essa lógica for implementada.
