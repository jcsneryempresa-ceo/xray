export async function chamarLlama(prompt: string){
  // Troque por Groq/Together com Llama 3 - custo zero pra começar
  // const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {...})
  return `Resposta do Turbo Admin para: ${prompt}`
}
