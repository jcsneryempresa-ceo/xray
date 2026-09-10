export type Cliente = { id: string, nome: string, telefone: string, origem: 'whatsapp' | 'manual' }
export async function listarClientes(tenantId: string){ return [] as Cliente[] }
