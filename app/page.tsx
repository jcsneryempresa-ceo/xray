export default function Home(){
  return (
    <div style={{padding:40, fontFamily:'sans-serif', textAlign:'center'}}>
      <h1 style={{fontSize:32}}>XRAY 🧠</h1>
      <p>Seu sistema está no ar!</p>
      <p style={{marginTop:20}}>Status: <span style={{color:'green', fontWeight:'bold'}}>ONLINE ✅</span></p>
      <div style={{marginTop:40, display:'flex', gap:10, justifyContent:'center'}}>
        <a href="/onboarding" style={{padding:'10px 20px', background:'black', color:'white', borderRadius:8, textDecoration:'none'}}>Começar Onboarding</a>
        <a href="/api/webhooks/whatsapp" style={{padding:'10px 20px', background:'#eee', borderRadius:8, textDecoration:'none', color:'black'}}>Testar Webhook</a>
      </div>
    </div>
  )
}
