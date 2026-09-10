export default function Onboarding(){
  return (
    <div style={{padding:24, maxWidth:480, margin:'0 auto'}}>
      <h1>Onde guardar suas fichas?</h1>
      <div style={{border:'1px solid #eee', padding:16, borderRadius:12, marginTop:16}}>
        <p>🔒 Vamos criar 1 pasta no seu Drive</p>
        <p style={{color:'#666', fontSize:14}}>Vamos criar a pasta <b>xray - seu negócio</b> no seu Google Drive. Só o que estiver DENTRO dela o Turbo Admin consegue ver. Suas fotos e outros arquivos continuam só seus.</p>
        <button style={{marginTop:12, padding:'12px 16px', borderRadius:8, background:'black', color:'white', width:'100%'}}>Continuar com Google</button>
        <p style={{fontSize:12, color:'#999', marginTop:8}}>Usamos jcsnery.empresa@gmail.com como conta teste. Mais seguro e é seu.</p>
      </div>
    </div>
  )
}
