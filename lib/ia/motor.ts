type Mensagem = { role: 'system' | 'user' | 'assistant'; content: string }

export async function chamarIA(mensagens: Mensagem[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return 'Ainda não configurei minha inteligência por aqui — falta a chave da IA no servidor.'
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: mensagens,
      temperature: 0.6,
    }),
  })

  if (!res.ok) {
    const erro = await res.text()
    throw new Error(`Groq respondeu ${res.status}: ${erro}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'Não consegui pensar em uma resposta agora, tenta de novo?'
}

// Mantido por compatibilidade com o stub antigo
export async function chamarLlama(prompt: string) {
  return chamarIA([{ role: 'user', content: prompt }])
}
