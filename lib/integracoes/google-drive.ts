import { google } from 'googleapis'
import { Readable } from 'stream'

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

export async function salvarArquivoNaPasta(auth: any, folderId: string, nome: string, conteudo: string, mime='application/json'){
  const drive = google.drive({ version: 'v3', auth })
  const stream = Readable.from([conteudo])
  return await drive.files.create({
    requestBody: { name: nome, parents: [folderId] },
    media: { mimeType: mime, body: stream },
    fields: 'id, webViewLink'
  })
}

export async function listarArquivos(auth: any, folderId: string){
  const drive = google.drive({ version: 'v3', auth })
  const list = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields:'files(id,name,webViewLink,createdTime)'
  })
  return list.data.files
}
