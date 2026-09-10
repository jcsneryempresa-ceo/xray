# xray - interno / Turbo Admin - fantasia
Scaffold gerado com carinho pro José Nery.

## Como rodar
1. npm install
2. cp .env.example .env.local e preencha
3. npm run dev -> http://localhost:3000

## Estrutura
- app/(painel) - sistema logado
- app/onboarding - UX com drive.file (pasta xray - nomeDoNegocio)
- lib/db/turso.ts - Turso free, não some na Vercel
- lib/plugins/atendente-whatsapp - plugin molde completo
- lib/integracoes/google-drive.ts - fluxo drive.file

## Próximos plugins copiam o molde do atendente-whatsapp
marketing-vaga-ociosa, radar-financeiro, fornecedor, avaliacoes, agenda
