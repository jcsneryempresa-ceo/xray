'use client'
import { useEffect, useMemo, useState } from "react";
import { SmallBrainLogo } from "@/components/xray/ui";
import { BottomNav, NavItem } from "@/components/xray/bottom-nav";

const navItems: NavItem[] = [
  { key: "dashboard", label: "Central", href: "/dashboard", icon: "house" },
  { key: "contatos", label: "Contatos", href: "/contatos", icon: "users" },
  { key: "plugins", label: "Plugins", href: "/plugins", icon: "box" },
];

type ItemHistorico = {
  id: string;
  titulo: string;
  resumo: string;
  excluidoEm: string;
};

type Filtro = "semana" | "mes" | "tudo";

const filtros: { key: Filtro; label: string }[] = [
  { key: "semana", label: "Essa semana" },
  { key: "mes", label: "Esse mês" },
  { key: "tudo", label: "Tudo" },
];

export default function HistoricoInsights() {
  const [itens, setItens] = useState<ItemHistorico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("tudo");

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((data) => {
        const excluidos = data?.estado?.excluidos || {};
        const lista: ItemHistorico[] = Object.entries(excluidos).map(([id, v]: [string, any]) => ({
          id,
          titulo: v.titulo,
          resumo: v.resumo,
          excluidoEm: v.excluidoEm,
        }));
        lista.sort((a, b) => b.excluidoEm.localeCompare(a.excluidoEm));
        setItens(lista);
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  const itensFiltrados = useMemo(() => {
    if (filtro === "tudo") return itens;
    const agora = new Date();
    const limite = new Date(agora);
    if (filtro === "semana") limite.setDate(agora.getDate() - 7);
    if (filtro === "mes") limite.setMonth(agora.getMonth() - 1);
    return itens.filter((i) => new Date(i.excluidoEm) >= limite);
  }, [itens, filtro]);

  function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="h-[100dvh] w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter] overflow-hidden">
      <div className="w-full max-w-[390px] bg-white h-[100dvh] md:h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
        <div className="flex items-center gap-2.5 px-5 h-[56px] shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#F3F3F4] sticky top-0 z-10">
          <a href="/config" className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F7F7F8] transition -ml-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </a>
          <SmallBrainLogo />
          <span className="font-bold text-[14px] tracking-[-0.01em]">HISTÓRICO</span>
        </div>

        <div className="px-4 pt-3 pb-1 bg-[#FBFBFC] flex gap-2">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`h-[30px] px-3 rounded-full text-[12px] font-semibold transition ${
                filtro === f.key ? "bg-[#111] text-white" : "bg-white border border-[#EDEDEF] text-[#6B7280]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 bg-[#FBFBFC] space-y-2.5">
          {!carregando && itensFiltrados.length === 0 && (
            <p className="text-[13px] text-[#9AA0A6] mt-6 text-center">Nada por aqui ainda.</p>
          )}

          {itensFiltrados.map((item) => (
            <div key={item.id} className="bg-white rounded-[16px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13.5px] font-semibold text-[#111]">{item.titulo}</p>
                <span className="text-[11px] text-[#9AA0A6] shrink-0">{formatarData(item.excluidoEm)}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-[#6B7280]">{item.resumo}</p>
            </div>
          ))}
        </div>

        <BottomNav items={navItems} activeHref="/config" />
      </div>
    </div>
  );
}
