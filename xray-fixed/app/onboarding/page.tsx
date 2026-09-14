import Link from 'next/link'

export default function Onboarding(){
  return (
    <div style={{padding:24, maxWidth:480, margin:'0 auto', fontFamily:'Inter, sans-serif'}}>
      <h1 style={{fontSize:24, fontWeight:800}}>Onde guardar suas fichas?</h1>
      <p style={{color:'#666', fontSize:14, marginTop:8}}>Fase 1 - Identidade e Onboarding</p>
      
      <div style={{border:'1px solid #eee', padding:16, borderRadius:12, marginTop:24}}>
        <p style={{fontWeight:600}}>🔒 Vamos criar 1 pasta no seu Drive</p>
        <p style={{color:'#666', fontSize:14, marginTop:8, lineHeight:'20px'}}>
          Vamos criar a pasta <b>xray - seu negócio</b> no seu Google Drive. 
          Só o que estiver DENTRO dela o XRAY consegue ver. 
          Suas fotos e outros arquivos continuam só seus.
        </p>
        <p style={{color:'#666', fontSize:12, marginTop:12, background:'#f6f6f6', padding:8, borderRadius:8}}>
          Escopo: drive.file (mínimo). Usamos jcsnery.empresa@gmail.com como conta teste.
          Seus dados ficam com você. <a href='/termos' style={{textDecoration:'underline'}}>Ver termos LGPD</a>
        </p>
        <Link href='/api/auth/google' style={{marginTop:16, display:'block', textAlign:'center', padding:'12px 16px', borderRadius:8, background:'black', color:'white', width:'100%', fontWeight:600}}>
          Continuar com Google
        </Link>
        <p style={{fontSize:11, color:'#999', marginTop:8, textAlign:'center'}}>Você será redirecionado para autorizar apenas a criação de pasta</p>
      </div>

      <div style={{marginTop:16, border:'1px dashed #ddd', padding:12, borderRadius:12}}>
        <p style={{fontSize:13, fontWeight:600}}>Próximos passos Fase 1:</p>
        <p style={{fontSize:13, color:'#666'}}>1. ✅ Google (este passo)</p>
        <p style={{fontSize:13, color:'#aaa'}}>2. Instagram (conectar)</p>
        <p style={{fontSize:13, color:'#aaa'}}>3. WhatsApp (validar)</p>
      </div>
    </div>
  )
}
