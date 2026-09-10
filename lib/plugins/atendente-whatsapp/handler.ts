import { chamarLlama } from '@/lib/ia/motor'
export async function handleMensagem(tenantId: string, de: string, mensagem: string){
  const resposta = await chamarLlama(`${mensagem}`)
  // Aqui salva no Turso + Drive
  return resposta
}
