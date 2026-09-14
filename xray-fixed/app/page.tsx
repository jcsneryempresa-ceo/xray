'use client'
import { useState } from "react";

type Screen = "login" | "onboarding" | "home" | "config" | "plugins";
type FilterChip = "Vendas" | "Atendimento" | "Organização" | "Financeiro";

interface PluginDef {
  key: string;
  title: string;
  shortTitle: string;
  desc: string;
  navLabel: string;
  categories: FilterChip[];
  icon: "box" | "chart" | "whatsapp" | "instagram" | "users" | "calendar" | "dollar" | "receipt";
}

const pluginsConfig: PluginDef[] = [
  { key: "produtos", title: "Produtos e Estoque", shortTitle: "Produtos", desc: "Gerencie produtos e inventário", navLabel: "Produtos", categories: ["Vendas", "Organização"], icon: "box" },
  { key: "vendas", title: "Vendas e Caixa", shortTitle: "Vendas", desc: "Controle vendas e pagamentos", navLabel: "Vendas", categories: ["Vendas", "Financeiro"], icon: "chart" },
  { key: "whatsapp", title: "WhatsApp Business", shortTitle: "WhatsApp", desc: "Automação e mensagens", navLabel: "WhatsApp", categories: ["Atendimento"], icon: "whatsapp" },
  { key: "instagram", title: "Instagram Direct", shortTitle: "Instagram", desc: "Mensagens e engajamento", navLabel: "Instagram", categories: ["Atendimento"], icon: "instagram" },
  { key: "clientes", title: "Clientes CRM", shortTitle: "Clientes", desc: "Gestão de clientes e contatos", navLabel: "Clientes", categories: ["Atendimento", "Organização"], icon: "users" },
  { key: "agenda", title: "Agenda e Horários", shortTitle: "Agenda", desc: "Agendamentos e horários", navLabel: "Agenda", categories: ["Organização"], icon: "calendar" },
  { key: "financeiro", title: "Financeiro", shortTitle: "Financeiro", desc: "Contas e fluxo", navLabel: "Financeiro", categories: ["Financeiro", "Vendas"], icon: "dollar" },
  { key: "notas", title: "Notas Fiscais", shortTitle: "Notas", desc: "Emissão de NF", navLabel: "Notas Fiscais", categories: ["Financeiro", "Vendas"], icon: "receipt" },
];

function BrainLogo({ size = 72 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#FF5A8A] flex items-center justify-center shadow-[0_8px_24px_rgba(79,140,255,0.35)] shrink-0"
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path
          d="M9.5 3.5C7 3.5 4.8 5.2 4.8 8c0 1.2.4 2.3 1.1 3.2-.7.8-1.1 1.9-1.1 3 0 2.8 2.2 4.5 4.7 4.5.8 0 1.5-.2 2.1-.5.6.3 1.3.5 2.1.5 2.5 0 4.7-1.7 4.7-4.5 0-1.1-.4-2.2-1.1-3 .7-.9 1.1-2 1.1-3.2 0-2.8-2.2-4.5-4.7-4.5-1.2 0-2.2.4-3 1.1-.8-.7-1.8-1.1-3-1.1Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path d="M13.2 8.2L11 12h2.3l-1.5 4 4-6.2H13l1.2-1.6h-1Z" fill="#4F8CFF" />
      </svg>
    </div>
  );
}

function SmallBrainLogo() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#FF5A8A] flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9.5 3.5C7 3.5 4.8 5.2 4.8 8c0 1.2.4 2.3 1.1 3.2-.7.8-1.1 1.9-1.1 3 0 2.8 2.2 4.5 4.7 4.5.8 0 1.5-.2 2.1-.5.6.3 1.3.5 2.1.5 2.5 0 4.7-1.7 4.7-4.5 0-1.1-.4-2.2-1.1-3 .7-.9 1.1-2 1.1-3.2 0-2.8-2.2-4.5-4.7-4.5-1.2 0-2.2.4-3 1.1-.8-.7-1.8-1.1-3-1.1Z" fill="white" />
        <path d="M13.2 8.2L11 12h2.3l-1.5 4 4-6.2H13l1.2-1.6h-1Z" fill="#4F8CFF" />
      </svg>
    </div>
  );
}

function IconHouse({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 10.2L12 3l8.5 7.2V20.5a.5.5 0 0 1-.5.5H15v-6H9v6H4a.5.5 0 0 1-.5-.5V10.2Z" />
    </svg>
  );
}
function IconUsers({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconBox({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="M3.3 7L12 12l8.7-5M12 22V12" />
    </svg>
  );
}
function IconChart({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 2 5-6" />
    </svg>
  );
}
function IconGear({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 9 15a1.65 1.65 0 0 0-1-1.51V13a2 2 0 0 1 0-4v-.5a1.65 1.65 0 0 0 1-1.51 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 13.5 3.5a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19 9a1.65 1.65 0 0 0 1 1.51V11a2 2 0 0 1 0 4v.5Z" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconMic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}
function IconWhatsappSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l4.9-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.6-6c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.5.1s-.6.8-.8.9c-.1.2-.3.2-.5.1-.3-.1-1-.4-1.8-1.2-.7-.6-1.1-1.3-1.2-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4 0-.1-.5-1.2-.7-1.6-.2-.4-.3-.4-.5-.4h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}
function IconAt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B8B8B" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v6c0 2.5-1.5 4-4 4s-4-1.5-4-4 1.5-4 4-4h4" />
    </svg>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-[42px] h-[26px] rounded-full p-[3px] transition-all duration-200 flex ${on ? "bg-[#3B82F6] justify-end" : "bg-[#E8E8EA] justify-start"}`}
    >
      <div className="w-[20px] h-[20px] rounded-full bg-white shadow-sm" />
    </button>
  );
}

function BottomNav({
  activeNav,
  setActiveNav,
  plugins,
}: {
  activeNav: string;
  setActiveNav: (id: string) => void;
  plugins: { key: string; label: string; icon: PluginDef["icon"] }[];
}) {
  const renderIcon = (icon: PluginDef["icon"] | "house", active: boolean) => {
    if (icon === "house") return <IconHouse active={active} />;
    if (icon === "users") return <IconUsers active={active} />;
    if (icon === "box") return <IconBox active={active} />;
    if (icon === "chart") return <IconChart active={active} />;
    // extras for dynamic
    if (icon === "whatsapp") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l4.9-1.3A10 10 0 1 0 12 2Z" />
        </svg>
      );
    }
    if (icon === "instagram") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="18" cy="6" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    }
    if (icon === "calendar") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    }
    if (icon === "dollar") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    }
    if (icon === "receipt") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
          <path d="M6 2h12a1 1 0 0 1 1 1v19l-3-2-3 2-3-2-3 2-1-1V3a1 1 0 0 1 1-1Z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    }
    return <IconBox active={active} />;
  };

  return (
    <div className="w-full bg-white border-t border-[#F0F0F0] px-2 py-2.5 flex items-center justify-around shrink-0">
      <button
        onClick={() => setActiveNav("home")}
        className={`flex flex-col items-center justify-center w-[56px] h-[44px] rounded-xl transition ${activeNav === "home" ? "text-[#3B82F6]" : "text-[#9AA0A6]"}`}
      >
        <div className={activeNav === "home" ? "text-[#3B82F6]" : ""}>{renderIcon("house", activeNav === "home")}</div>
      </button>
      {plugins.map((p) => {
        const isActive = activeNav === p.key;
        return (
          <button
            key={p.key}
            onClick={() => setActiveNav(p.key)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] px-1 h-[44px] rounded-xl transition ${isActive ? "text-[#3B82F6]" : "text-[#9AA0A6]"}`}
          >
            <span className={isActive ? "text-[#3B82F6]" : ""}>{renderIcon(p.icon, isActive)}</span>
            <span className={`text-[10px] font-medium leading-none tracking-tight ${isActive ? "text-[#3B82F6]" : "text-[#9AA0A6]"}`}>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [whatsapp, setWhatsapp] = useState("");
  const [social, setSocial] = useState("");
  const [activeNav, setActiveNav] = useState("home");
  const [empresaNome, setEmpresaNome] = useState("");
  const [filter, setFilter] = useState<FilterChip>("Vendas");
  const [pluginsState, setPluginsState] = useState<Record<string, boolean>>({
    produtos: true,
    vendas: true,
    whatsapp: false,
    instagram: false,
    clientes: true,
    agenda: true,
    financeiro: false,
    notas: false,
  });
  const [inputText, setInputText] = useState("");
  const [bgColor, setBgColor] = useState("bg-white");

  const activePlugins = pluginsConfig.filter((p) => pluginsState[p.key]);

  const togglePlugin = (key: string) => {
    setPluginsState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredPlugins = pluginsConfig.filter((p) => {
    if (filter === "Vendas") return true; // show all for demo as per mock
    return p.categories.includes(filter);
  });

  return (
    <div className="min-h-screen w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter] selection:bg-[#4F8CFF]/20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{font-family:'Inter',system-ui,-apple-system,sans-serif}`}</style>

      <div className={`w-full max-w-[390px] ${bgColor} min-h-screen md:min-h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative`}>
        {/* SCREEN 1 - LOGIN */}
        {screen === "login" && (
          <div className="flex-1 flex flex-col px-6 pt-[68px] pb-8">
            <div className="flex flex-col items-center text-center">
              <BrainLogo size={88} />
              <h1 className="mt-6 text-[22px] font-bold tracking-[-0.02em] text-black">TURBO ADMIN</h1>
              <div className="mt-10">
                <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-black">Bem-vindo(a)</h2>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#6B7280] max-w-[280px]">Organize sua gestão com o poder que turbina.</p>
              </div>

              <button
                onClick={() => window.location.href = "/api/auth/google"}
                className="mt-12 w-full h-[52px] rounded-full bg-white border border-[#E9E9EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center gap-3 hover:bg-[#FCFCFD] active:scale-[0.99] transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                  <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.73.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
                </svg>
                <span className="text-[15px] font-medium text-[#1F1F1F]">Entrar com Google</span>
              </button>

              <p className="mt-auto pt-16 text-[11px] leading-[1.5] text-[#9AA0A6] max-w-[300px] text-center">
                Ao continuar, você concorda com nossos <span className="underline decoration-[#D1D5DB]">Termos de Uso</span> e <span className="underline decoration-[#D1D5DB]">Política de Privacidade</span>.
              </p>
            </div>
          </div>
        )}

        {/* SCREEN 2 - ONBOARDING */}
        {screen === "onboarding" && (
          <div className="flex-1 flex flex-col px-6 pt-14 pb-8">
            <div className="flex justify-center">
              <BrainLogo size={64} />
            </div>
            <div className="mt-8">
              <h2 className="text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-black">
                Só mais um passo!
                <br />
                <span className="text-[#6B7280] font-medium">Pra personalizar seu feed.</span>
              </h2>
            </div>

            <div className="mt-10 space-y-5">
              <div>
                <label className="text-[13px] font-medium text-[#111]">Seu WhatsApp</label>
                <div className="mt-2 h-[52px] rounded-[14px] bg-[#F7F7F8] border border-[#EFEFF1] flex items-center px-4 gap-3 focus-within:border-[#D6D6DB] focus-within:bg-white transition">
                  <IconWhatsappSmall />
                  <span className="text-[#9AA0A6] text-[14px]">+55</span>
                  <div className="w-px h-5 bg-[#E5E7EB]" />
                  <input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[#B8BCC2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#111]">Instagram ou Facebook</label>
                <div className="mt-2 h-[52px] rounded-[14px] bg-[#F7F7F8] border border-[#EFEFF1] flex items-center px-4 gap-3 focus-within:border-[#D6D6DB] focus-within:bg-white transition">
                  <IconAt />
                  <input
                    value={social}
                    onChange={(e) => setSocial(e.target.value)}
                    placeholder="@seuusuario"
                    className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[#B8BCC2]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setScreen("home")}
              className="mt-auto w-full h-[52px] rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#FF5A8A] text-white font-semibold text-[15px] shadow-[0_8px_20px_rgba(79,140,255,0.35)] active:scale-[0.99] transition"
            >
              Continuar
            </button>
            <p className="mt-4 text-center text-[12px] text-[#9AA0A6]">Você pode editar isso depois em Configurações</p>
          </div>
        )}

        {/* SCREEN 3 - HOME */}
        {screen === "home" && (
          <>
            <div className="flex items-center justify-between px-5 h-[56px] shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#F3F3F4] sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <SmallBrainLogo />
                <span className="font-bold text-[14px] tracking-[-0.01em]">TURBO ADMIN</span>
              </div>
              <button onClick={() => setScreen("config")} className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#6B7280] hover:bg-[#F0F0F2] transition">
                <IconGear />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 bg-[#FBFBFC]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#9333EA] text-[11px] font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-pulse" /> INSIGHTS
              </div>

              <div className="mt-4 space-y-4">
                {/* Card 1 */}
                <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3] relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_0_4px_rgba(34,197,94,0.15)]" />
                      <p className="text-[14px] font-semibold text-[#111] leading-tight">Conectado! Parabéns, você conectou seu Gmail, WhatsApp e Instagram.</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <button className="w-7 h-7 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#9AA0A6]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>
                      </button>
                      <button className="w-7 h-7 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#9AA0A6]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.5] text-[#6B7280]">
                    Seus arquivos ficam organizados no seu Drive e planilhas.
                    <br />
                    <span className="font-medium text-[#111]">Você controla tudo.</span>
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] shadow-[0_0_0_4px_rgba(234,179,8,0.15)]" />
                    <p className="text-[13px] font-semibold text-[#111]">WhatsApp - autorização pendente</p>
                  </div>
                  <p className="mt-2.5 text-[13px] leading-[1.5] text-[#6B7280]">
                    Você informou seu número mas ainda precisamos da sua permissão no WhatsApp Business pra enviar mensagens.
                  </p>
                  <button className="mt-3 h-8 px-4 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[12.5px] font-semibold hover:bg-[#DBEAFE] transition">Autorizar agora</button>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_0_4px_rgba(59,130,246,0.15)]" />
                    <p className="text-[13px] font-semibold text-[#111]">Agora vamos finalizar:</p>
                  </div>
                  <p className="mt-2.5 text-[14px] leading-[1.5] text-[#111] font-medium">
                    Me conta sobre seu trabalho... Você vende algum produto ou presta serviço? Pode me falar do seu jeito que vai dar tudo certo.
                  </p>
                  <div className="mt-4 rounded-[12px] bg-[#F9FAFB] border border-dashed border-[#E5E7EB] p-3">
                    <p className="text-[12.5px] leading-[1.5] text-[#9AA0A6] italic">
                      Ex: Sou vendedor autônomo, trabalho com cosméticos e faço entregas na região de Campinas. Tenho 2 funcionários...
                    </p>
                  </div>
                </div>

                <div className="h-6" />
              </div>
            </div>

            {/* Input bar */}
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

            <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} plugins={activePlugins.map((p) => ({ key: p.key, label: p.navLabel, icon: p.icon }))} />
          </>
        )}

        {/* SCREEN 4 - CONFIG */}
        {screen === "config" && (
          <>
            <div className="flex items-center gap-3 px-4 h-[56px] shrink-0 bg-white border-b border-[#F3F3F4] sticky top-0 z-10">
              <button onClick={() => setScreen("home")} className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#111] hover:bg-[#F0F0F2] transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <h2 className="font-semibold text-[16px] tracking-[-0.01em]">Configurações</h2>
              <div className="ml-auto w-9 h-9 rounded-full bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
                <IconGear active />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#FBFBFC] space-y-4">
              {/* Nome empresa */}
              <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-[#F2F2F3] flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[#111]">Nome da Empresa ou do Negócio</p>
                  <input
                    value={empresaNome}
                    onChange={(e) => setEmpresaNome(e.target.value)}
                    placeholder="Ex: Minha Empresa"
                    className="mt-1 w-full bg-transparent outline-none text-[13px] text-[#6B7280] placeholder:text-[#9AA0A6]"
                  />
                </div>
                <button className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#9AA0A6] ml-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="M15 5l4 4"/></svg>
                </button>
              </div>

              {/* Foto ou Logo */}
              <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-[#F2F2F3] flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-[#111]">Foto ou Logo</p>
                  <p className="text-[12px] text-[#9AA0A6] mt-0.5">Sua marca no topo do app</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#E5E7EB] flex items-center justify-center bg-[#FBFBFC]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4F8CFF] to-[#FF5A8A] flex items-center justify-center opacity-80">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9.5 3.5C7 3.5 4.8 5.2 4.8 8c0 1.2.4 2.3 1.1 3.2-.7.8-1.1 1.9-1.1 3 0 2.8 2.2 4.5 4.7 4.5.8 0 1.5-.2 2.1-.5.6.3 1.3.5 2.1.5 2.5 0 4.7-1.7 4.7-4.5 0-1.1-.4-2.2-1.1-3 .7-.9 1.1-2 1.1-3.2 0-2.8-2.2-4.5-4.7-4.5-1.2 0-2.2.4-3 1.1-.8-.7-1.8-1.1-3-1.1Z"/></svg>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-[0_4px_10px_rgba(59,130,246,0.35)]">
                    <IconPlus />
                  </button>
                </div>
              </div>

              {/* Adicionar Plugins */}
              <button
                onClick={() => setScreen("plugins")}
                className="w-full bg-white rounded-[18px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-[#F2F2F3] flex items-center justify-between text-left hover:bg-[#FCFCFD] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F0FF] flex items-center justify-center text-[#7C3AED]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 3h4a2 2 0 0 1 2 2v4M15 3v4h4M9 21H5a2 2 0 0 1-2-2v-4M9 21v-4H5M21 9v4a2 2 0 0 1-2 2h-4M21 9h-4v4M3 15v-4a2 2 0 0 1 2-2h4M3 15h4v-4"/><circle cx="12" cy="12" r="2"/></svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111]">Adicionar Plugins</p>
                    <p className="text-[11px] text-[#9AA0A6]">Ative novas funções no seu painel</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center">
                  <IconPlus />
                </div>
              </button>

              {/* Cor de fundo */}
              <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-[#F2F2F3]">
                <p className="text-[13px] font-medium text-[#111]">Alterar cor de fundo ou usar uma imagem</p>
                <div className="mt-3 flex items-center gap-2.5">
                  {[
                    { c: "#F5EFE6", border: true },
                    { c: "#FFD6E0", border: false },
                    { c: "#C7E0FF", border: false },
                    { c: "#C8F5D8", border: false },
                    { c: "#D9C6FF", border: false },
                    { c: "#E9D5FF", border: false },
                  ].map((dot, i) => (
                    <button
                      key={i}
                      onClick={() => setBgColor(i === 0 ? "bg-[#F5EFE6]" : i === 1 ? "bg-[#FFF0F3]" : "bg-white")}
                      className={`w-8 h-8 rounded-full transition ${dot.border ? "ring-1 ring-[#E5E7EB]" : ""} ${i === 2 ? "ring-2 ring-[#3B82F6] ring-offset-2" : ""}`}
                      style={{ background: dot.c }}
                    />
                  ))}
                  <button className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#9AA0A6] border border-[#EFEFEF]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-3.5-3.5a2 2 0 0 0-2.8 0L3 21"/></svg>
                  </button>
                </div>
              </div>

              {/* Esquema de cores */}
              <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-[#F2F2F3]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-[#111]">Alterar esquema de cores</p>
                  <span className="text-[11px] font-medium text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-full">Azul → Rosa Selecionado</span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#FF5A8A] relative">
                  <div className="absolute left-[72%] -top-1 w-4 h-4 rounded-full bg-white border-2 border-[#4F8CFF] shadow-md" />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-[#9AA0A6] font-medium">
                  <span>Azul</span>
                  <span>Rosa</span>
                </div>
              </div>

              {/* Etc */}
              <button className="w-full bg-white rounded-[18px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] border border-[#F2F2F3] flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#111]">Notificações, idioma, conta e mais</p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA0A6" strokeWidth="1.8"><path d="M9 18l6-6-6-6"/></svg>
              </button>

              <div className="h-6" />
            </div>

            <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} plugins={activePlugins.map((p) => ({ key: p.key, label: p.navLabel, icon: p.icon }))} />
          </>
        )}

        {/* SCREEN 5 - PLUGINS */}
        {screen === "plugins" && (
          <>
            <div className="flex items-center gap-3 px-4 h-[56px] shrink-0 bg-white border-b border-[#F3F3F4] sticky top-0 z-10">
              <button onClick={() => setScreen("config")} className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#111] hover:bg-[#F0F0F2] transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <h2 className="font-semibold text-[16px] tracking-[-0.01em]">Adicionar Plugins</h2>
            </div>

            <div className="px-4 pt-4 pb-2 bg-white border-b border-[#F6F6F7]">
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
                {(["Vendas", "Atendimento", "Organização", "Financeiro"] as FilterChip[]).map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setFilter(chip)}
                    className={`h-8 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition border ${
                      filter === chip ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_4px_12px_rgba(59,130,246,0.3)]" : "bg-[#F7F7F8] text-[#6B7280] border-[#F0F0F1] hover:bg-[#F0F0F2]"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 bg-[#FBFBFC]">
              <div className="grid grid-cols-2 gap-3">
                {filteredPlugins.map((plugin) => {
                  const isOn = pluginsState[plugin.key];
                  return (
                    <div key={plugin.key} className="bg-white rounded-[18px] p-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.05)] border border-[#F2F2F3] flex flex-col min-h-[132px]">
                      <div className="flex items-start justify-between">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isOn ? "bg-[#EFF6FF] text-[#3B82F6]" : "bg-[#F7F7F8] text-[#9AA0A6]"}`}>
                          {plugin.icon === "box" && <IconBox active={isOn} />}
                          {plugin.icon === "chart" && <IconChart active={isOn} />}
                          {plugin.icon === "users" && <IconUsers active={isOn} />}
                          {plugin.icon === "whatsapp" && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={isOn ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isOn ? 0 : 1.8}><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l4.9-1.3A10 10 0 1 0 12 2Z"/></svg>
                          )}
                          {plugin.icon === "instagram" && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isOn ? 2.2 : 1.6}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
                          )}
                          {plugin.icon === "calendar" && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isOn ? 2.2 : 1.6}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                          )}
                          {plugin.icon === "dollar" && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isOn ? 2.2 : 1.6}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          )}
                          {plugin.icon === "receipt" && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isOn ? 2.2 : 1.6}><path d="M6 2h12a1 1 0 0 1 1 1v19l-3-2-3 2-3-2-3 2-1-1V3a1 1 0 0 1 1-1Z"/></svg>
                          )}
                        </div>
                        {isOn ? (
                          <Toggle on={true} onChange={() => togglePlugin(plugin.key)} />
                        ) : (
                          <div className="w-[22px] h-[22px]" />
                        )}
                      </div>
                      <p className="mt-3 text-[13px] font-semibold leading-[1.25] text-[#111]">{plugin.title}</p>
                      <p className="mt-1 text-[11.5px] leading-[1.35] text-[#8B8F97] flex-1">{plugin.desc}</p>
                      <div className="mt-3">
                        {isOn ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${plugin.key === "vendas" || plugin.key === "agenda" ? "bg-[#22C55E]" : "bg-[#3B82F6]"}`} />
                            <span className="text-[11px] font-medium text-[#6B7280]">Ativo</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => togglePlugin(plugin.key)}
                            className="h-7 px-3 rounded-full bg-[#111] text-white text-[11.5px] font-semibold flex items-center gap-1 hover:bg-[#222] active:scale-95 transition"
                          >
                            <span className="text-[13px] leading-none">+</span> Adicionar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-6" />
            </div>

            <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} plugins={activePlugins.map((p) => ({ key: p.key, label: p.navLabel, icon: p.icon }))} />
          </>
        )}
      </div>
    </div>
  );
}
