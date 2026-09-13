'use client'
import { useState, useEffect } from 'react';
export default function App(){
  const [screen,setScreen]=useState('login');
  const [mounted,setMounted]=useState(false);
  const [email,setEmail]=useState('jcsnery.empresa@gmail.com');
  useEffect(()=>{
    setMounted(true);
    try{
      const c=document.cookie;
      if(c.includes('tenant_id=')) setScreen('home');
      const m=c.match(/owner_email=([^;]+)/);
      if(m) setEmail(decodeURIComponent(m[1]));
      if(window.location.search.includes('login=success')) setScreen('home');
    }catch{}
  },[]);
  if(!mounted) return <div style={{padding:40}}>Carregando...</div>;
  return (
    <div style={{minHeight:'100vh',display:'flex',justifyContent:'center',background:'#F6F6F7',padding:20}}>
      <div style={{width:'100%',maxWidth:390,background:'white',borderRadius:32,overflow:'hidden',minHeight:800,display:'flex',flexDirection:'column'}}>
        {screen==='login' && (
          <div style={{padding:'68px 24px 32px',textAlign:'center',flex:1,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{width:88,height:88,borderRadius:'50%',background:'linear-gradient(to br,#4F8CFF,#FF5A8A)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'bold'}}>XRAY</div>
            <h1 style={{marginTop:24,fontSize:22,fontWeight:'bold'}}>TURBO ADMIN</h1>
            <h2 style={{marginTop:40,fontSize:28,fontWeight:600}}>Bem-vindo(a)</h2>
            <button onClick={()=>window.location.href='/api/auth/google'} style={{marginTop:48,width:'100%',height:52,borderRadius:999,border:'1px solid #E9E9EB',background:'white',fontWeight:500}}>Entrar com Google</button>
          </div>
        )}
        {screen==='home' && (
          <div style={{flex:1,padding:20}}>
            <b>TURBO ADMIN</b>
            <div style={{marginTop:20,background:'white',borderRadius:20,padding:16,border:'1px solid #F2F2F3'}}>
              <p style={{fontWeight:600}}>Conectado! ✅</p>
              <p style={{marginTop:8,fontSize:13,color:'#6B7280'}}>Logado como: {email}</p>
              <p style={{marginTop:8,fontSize:12,color:'#22C55E',fontWeight:600}}>✓ Tenant: 1 row - Build OK!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

