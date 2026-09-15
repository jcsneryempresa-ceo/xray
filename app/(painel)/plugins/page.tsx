import { plugins } from "@/lib/config/plugins-registry";
import { BottomNav, NavItem } from "@/components/xray/bottom-nav";
import { SmallBrainLogo } from "@/components/xray/ui";

const navItems: NavItem[] = [
  { key: "dashboard", label: "Central", href: "/dashboard", icon: "house" },
  { key: "contatos", label: "Contatos", href: "/contatos", icon: "users" },
  { key: "plugins", label: "Plugins", href: "/plugins", icon: "box" },
];

export default function Plugins() {
  return (
    <div className="min-h-screen w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter]">
      <div className="w-full max-w-[390px] bg-white h-screen md:h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
        <div className="flex items-center gap-2.5 px-5 h-[56px] shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#F3F3F4] sticky top-0 z-10">
          <SmallBrainLogo />
          <span className="font-bold text-[14px] tracking-[-0.01em]">PLUGINS</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 bg-[#FBFBFC] space-y-3">
          {plugins.map((p) => (
            <div key={p.id} className="bg-white rounded-[16px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3] flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-[#111]">{p.nome}</p>
                <p className="text-[12.5px] text-[#6B7280] mt-0.5">{p.descricao}</p>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${p.ativo ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F3F4F6] text-[#9AA0A6]"}`}>
                {p.ativo ? "Ativo" : "Em breve"}
              </span>
            </div>
          ))}
        </div>

        <BottomNav items={navItems} activeHref="/plugins" />
      </div>
    </div>
  );
}
