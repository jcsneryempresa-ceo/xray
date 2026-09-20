'use client'
import { SmallBrainLogo } from "@/components/xray/ui";

const opcoes = [
  { titulo: "Conectar WhatsApp", subtitulo: "Ligue seu número ao Turbo Admin", href: "/config/whatsapp" },
  { titulo: "Histórico de insights", subtitulo: "Tudo que você já resolveu por aqui", href: "/config/historico" },
];

export default function Config() {
  return (
    <div className="h-[100dvh] w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter] overflow-hidden">
      <div className="w-full max-w-[390px] bg-white h-[100dvh] md:h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
        <div className="flex items-center gap-2.5 px-5 h-[56px] shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#F3F3F4] sticky top-0 z-10">
          <a href="/dashboard" className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F7F7F8] transition -ml-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </a>
          <SmallBrainLogo />
          <span className="font-bold text-[14px] tracking-[-0.01em]">CONFIGURAÇÕES</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 bg-[#FBFBFC] space-y-2.5">
          {opcoes.map((o) => (
            <a
              key={o.href}
              href={o.href}
              className="flex items-center justify-between bg-white rounded-[16px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3] hover:border-[#E5E5E7] transition"
            >
              <div>
                <p className="text-[13.5px] font-semibold text-[#111]">{o.titulo}</p>
                <p className="mt-0.5 text-[12.5px] text-[#9AA0A6]">{o.subtitulo}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C1C4C9] shrink-0"><path d="M9 18l6-6-6-6" /></svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
