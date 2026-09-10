export async function handleMensagem(mensagem: any) {
  console.log("mensagem:", mensagem)
  return { ok: true }
}
export async function handleWebhook(req: any) {
  return { ok: true }
}
