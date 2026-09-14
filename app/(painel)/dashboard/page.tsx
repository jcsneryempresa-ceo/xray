'use client'
import { useState } from "react";
import { SmallBrainLogo, IconGear, IconPlus, IconMic, IconSend } from "@/components/xray/ui";
import { BottomNav, NavItem } from "@/components/xray/bottom-nav";

const navItems: NavItem[] = [
  { key: "dashboard", label: "Central", href: "/dashboard", icon: "house" },
  { key: "contatos", label: "Contatos", href: "/contatos", icon: "users" },
  { key: "plugins", label: "Plugins", href: "/plugins", icon: "box" },
];

export default function Dashboard() {
  const [inputText, setInputText] = useState("");

  return (
    <div className="min-h-screen w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter]">
      <div className="w-full max-w-[390px] bg-white min-h-screen md:min-h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
        <div className="flex items-center justify-between px-5 h-[56px] shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#F3F3F4] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <SmallBrainLogo />
            <span className="font-bold text-[14px] tracking-[-0.01em]">TURBO ADMIN</span>
          </div>
          <a href="/config" className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#6B7280] hover:bg-[#F0F0F2] transition">
            <IconGear />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 bg-[#FBFBFC]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#9333EA] text-[11px] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-pulse" /> INSIGHTS
          </div>

          <div className="mt-4 space-y-4">
            <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_0_4px_rgba(34,197,94,0.15)]" />
                <p className="text-[14px] font-semibold text-[#111] leading-tight">Conectado! Suas contas estão ligadas.</p>
              </div>
              <p className="mt-3 text-[13px] leading-[1.5] text-[#6B7280]">
                Seus arquivos ficam organizados no seu Drive.
                <br />
                <span className="font-medium text-[#111]">Você controla tudo.</span>
              </p>
            </div>
            <div className="h-6" />
          </div>
        </div>

        <div className="px-3 pb-2 bg-[#FBFBFC]">
          <div className="h-[52px] rounded-full bg-white border border-[#EDEDEF] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 px-2">
            <button className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#6B7280] hover:bg-[#F0F0F2] transition">
              <IconPlus />
            </button>
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Fale com seu Turbo Admin"
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#9AA0A6]"
            />
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#9AA0A6] hover:text-[#6B7280]">
              <IconMic />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-[0_4px_12px_rgba(59,130,246,0.35)] hover:bg-[#2563EB] active:scale-95 transition">
              <IconSend />
            </button>
          </div>
        </div>

        <BottomNav items={navItems} activeHref="/dashboard" />
      </div>
    </div>
  );
}
