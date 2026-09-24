// Catálogo de temas do Plano de Dicas.
// Tema é só uma categoria de conteúdo pra IA classificar um sinal — não exige
// plugin, tela ou dado novo persistido. Por isso a lista pode crescer livremente
// sem custo de arquitetura (ver ação, que é o que fica travado ao catálogo de plugins).
export const TEMAS_DICAS = [
  'marketing',
  'vendas',
  'estoque_produtos',
  'financeiro_caixa',
  'contabilidade_fiscal',
  'fornecedor_compras',
  'precificacao',
  'juridico',
  'tecnologia',
  'atendimento_relacionamento',
  'agenda_tempo',
] as const

export type TemaDica = (typeof TEMAS_DICAS)[number]

export const TEMA_LABEL: Record<TemaDica, string> = {
  marketing: 'Marketing',
  vendas: 'Vendas / Comercial',
  estoque_produtos: 'Estoque / Produtos',
  financeiro_caixa: 'Financeiro / Caixa',
  contabilidade_fiscal: 'Contabilidade / Fiscal',
  fornecedor_compras: 'Fornecedor / Compras',
  precificacao: 'Precificação',
  juridico: 'Jurídico',
  tecnologia: 'Tecnologia',
  atendimento_relacionamento: 'Atendimento / Relacionamento',
  agenda_tempo: 'Agenda / Tempo',
}
