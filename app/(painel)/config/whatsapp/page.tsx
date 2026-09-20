'use client'
import { SmallBrainLogo } from "@/components/xray/ui";
import { BottomNav, NavItem } from "@/components/xray/bottom-nav";

const navItems: NavItem[] = [
  { key: "dashboard", label: "Central", href: "/dashboard", icon: "house" },
  { key: "contatos", label: "Contatos", href: "/contatos", icon: "users" },
  { key: "plugins", label: "Plugins", href: "/plugins", icon: "box" },
];

const passos = [
  {
    titulo: "1. Tenha o WhatsApp Business instalado",
    texto: "É o app normal do WhatsApp Business (não é a Cloud API ainda) — se você já usa esse número pra falar com seus clientes, está pronto.",
  },
  {
    titulo: "2. Deixe o número esquentar",
    texto: "A Meta pede pelo menos 7 dias de uso ativo antes de liberar a conexão. O ideal é 30 a 60 dias — número muito novo tem mais chance de ser recusado.",
  },
  {
    titulo: "3. Crie um Business Manager",
    texto: "É o painel da Meta onde a verificação do seu negócio acontece. Se você ainda não tem, é gratuito em business.facebook.com.",
    link: "https://business.facebook.com",
  },
  {
    titulo: "4. Verifique seu negócio",
    texto: "A Meta confirma que você é dono do negócio (CNPJ ou CPF, dependendo do seu caso). Pode levar alguns dias.",
  },
  {
    titulo: "5. Ative a Coexistência",
    texto: "Esse é o passo que liga seu número ao Turbo Admin, sem desligar o app do seu celular. Depois de ativo, é só abrir o WhatsApp Business no celular pelo menos uma vez a cada 14 dias.",
  },
];

export default function ConfigWhatsapp() {
  return (
    <div className="h-[100dvh] w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter] overflow-hidden">
      <div className="w-full max-w-[390px] bg-white h-[100dvh] md:h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
        <div className="flex items-center gap-2.5 px-5 h-[56px] shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#F3F3F4] sticky top-0 z-10">
          <a href="/dashboard" className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F7F7F8] transition -ml-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </a>
          <SmallBrainLogo />
          <span className="font-bold text-[14px] tracking-[-0.01em]">CONECTAR WHATSAPP</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 bg-[#FBFBFC] space-y-3">
          <p className="text-[13px] text-[#6B7280] leading-[1.5]">
            É por ele que seu assistente vai entender seu negócio sem você precisar digitar nada. Não é obrigatório pra começar a usar o Turbo Admin — mas é onde a mágica acontece de verdade.
          </p>

          {passos.map((p) => (
            <div key={p.titulo} className="bg-white rounded-[16px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3]">
              <p className="text-[13.5px] font-semibold text-[#111]">{p.titulo}</p>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-[#6B7280]">{p.texto}</p>
              {"link" in p && p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[12.5px] font-semibold text-[#3B82F6] underline">
                  {p.link.replace("https://", "")}
                </a>
              )}
            </div>
          ))}
        </div>

        <BottomNav items={navItems} activeHref="/config" />
      </div>
    </div>
  );
}
