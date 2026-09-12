
# TURBO ADMIN - FUNCIONAL v2

Este já funciona, não é mockup.

## O que faz
1. Login com Google real -> /api/auth/google
2. Callback cria pasta `xray - seu@email.com` no Drive do usuário (drive.file - só vê o que ele criou)
3. Grava token em cookie httpOnly
4. Feed Insights já funciona:
   - Card verde Conectado mostra pasta criada e link do Drive
   - Card amarelo WhatsApp pendente (não trava) - botão Autorizar leva pra /api/auth/whatsapp futuramente
   - Card azul Agora vamos finalizar coleta tipo de negócio e já salva como `perfil.json` na pasta do Drive via POST /api/drive

## Barra de baixo = plugins dinâmicos
DEFAULT: Clientes, Produtos, Vendas + casinha sem HOME
Quando adiciona/remove em Adicionar Plugins, já reflete na barra e já cria/deleta arquivo de config no Drive.

## Como rodar
1. Crie projeto no Google Cloud Console, ative Drive API e OAuth2
2. Copie .env.example pra .env.local e preencha
3. npm install
4. npm run dev
5. Acesse http://localhost:3000 -> Entrar com Google

Fluxo não trava: mesmo sem autorizar WhatsApp, já cai no feed.
