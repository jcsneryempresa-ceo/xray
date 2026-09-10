import { google } from 'googleapis'
/**
 * Fluxo drive.file - só vê o que ELE criou
 * 1. Cria pasta xray - ${nomeNegocio}
 * 2. Tudo dentro dela é seu
 */
export async function criarPastaRaiz(auth: any, nomeNegocio: string){
  const drive = google.drive({ version: 'v3', auth })
  const pasta = await drive.files.create({
    requestBody: {
      name: `xray - ${nomeNegocio}`,
      mimeType: 'application/vnd.google-apps.folder'
    },
    fields: 'id, webViewLink'
  })
  return { folderId: pasta.data.id, link: pasta.data.webViewLink }
}
export async function salvarArquivoNaPasta(auth: any, folderId: string, nome: string, conteudo: string){
  const drive = google.drive({ version: 'v3', auth })
  return await drive.files.create({
    requestBody: { name: nome, parents: [folderId] },
    media: { mimeType: 'text/csv', body: conteudo }
  })
}
