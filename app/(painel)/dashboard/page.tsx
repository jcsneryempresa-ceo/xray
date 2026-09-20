'use client'
import { useEffect, useRef, useState } from "react";
import { SmallBrainLogo, IconGear, IconPlus, IconMic, IconSend, IconX } from "@/components/xray/ui";
import { BottomNav, NavItem } from "@/components/xray/bottom-nav";

const navItems: NavItem[] = [
  { key: "dashboard", label: "Central", href: "/dashboard", icon: "house" },
  { key: "contatos", label: "Contatos", href: "/contatos", icon: "users" },
  { key: "plugins", label: "Plugins", href: "/plugins", icon: "box" },
];

type Acao = { texto: string; onClick: () => void } | { texto: string; href: string };

type Insight = {
  id: string;
  titulo: string;
  corpo: React.ReactNode;
  resumo: string; // versão em texto puro, usada no histórico
  concluido: boolean;
  tom?: "alerta" | "convite"; // só importa quando não concluído
  acao?: Acao;
};

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [mensagens, setMensagens] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [excluidos, setExcluidos] = useState<Set<string>>(new Set());
  const [excluindo, setExcluindo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((data) => {
        if (data?.estado?.excluidos) {
          setExcluidos(new Set(Object.keys(data.estado.excluidos)));
        }
      })
      .catch(() => {});
  }, []);

  async function enviar() {
    const texto = inputText.trim();
    if (!texto || enviando) return;
    setInputText("");
    const novoHistorico = [...mensagens, { role: "user" as const, content: texto }];
    setMensagens(novoHistorico);
    setEnviando(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto, historico: mensagens }),
      });
      const data = await res.json();
      const resposta = res.ok ? data.resposta : `Deu erro aqui: ${data.error}`;
      setMensagens([...novoHistorico, { role: "assistant", content: resposta }]);
    } catch (e: any) {
      setMensagens([...novoHistorico, { role: "assistant", content: "Não consegui conectar agora, tenta de novo em instantes." }]);
    } finally {
      setEnviando(false);
    }
  }

  const insights: Insight[] = [
    {
      id: "google",
      titulo: "Google conectado",
      concluido: true,
      resumo: "Pasta no Google Drive criada para guardar as fichas de contato.",
      corpo: (
        <>
          Criamos uma pasta só sua no Google Drive — é lá que suas fichas de contato ficam guardadas, com você no controle total.
          <br />
          <span className="font-medium text-[#111]">Importante: não apague essa pasta.</span> Se ela sumir, o Turbo Admin perde o acesso aos seus dados salvos.
        </>
      ),
    },
    {
      id: "whatsapp",
      titulo: "Conecte seu WhatsApp",
      concluido: false,
      tom: "alerta",
      resumo: "Conectar o WhatsApp para o assistente entender o negócio automaticamente.",
      corpo: "É por ele que seu assistente vai entender seu negócio e ajudar sem você precisar digitar nada. Leva menos de 2 minutos.",
      acao: { texto: "Conectar WhatsApp", href: "/config/whatsapp" },
    },
    {
      id: "primeira-conversa",
      titulo: "Vamos nos conhecer",
      concluido: mensagens.length > 0,
      tom: "convite",
      resumo: "Contar ao assistente o que o negócio vende ou o serviço que presta.",
      corpo: "Me conta um pouco do seu negócio — o que você vende ou o serviço que presta — pra eu já começar a te ajudar com o que fizer sentido.",
      acao: {
        texto: "Contar agora",
        onClick: () => inputRef.current?.focus(),
      },
    },
  ].filter((i) => !excluidos.has(i.id));

  async function excluir(insight: Insight) {
    setExcluindo(insight.id);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: insight.id, titulo: insight.titulo, resumo: insight.resumo }),
      });
      if (!res.ok) throw new Error("falha ao excluir");
      setExcluidos((prev) => new Set(prev).add(insight.id));
    } catch (e) {
      // o card só some da tela quando a gravação no Drive realmente funcionar
      console.error("Erro ao excluir insight:", e);
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <div className="h-[100dvh] w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter] overflow-hidden">
      <div className="w-full max-w-[390px] bg-white h-[100dvh] md:h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
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
          <div className="space-y-2.5">
            {insights.map((insight) =>
              insight.concluido ? (
                <div key={insight.id} className="bg-[#F4F4F5] rounded-[20px] p-4 relative">
                  {excluindo === insight.id ? null : (
                    <button
                      onClick={() => excluir(insight)}
                      aria-label="Excluir"
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[#C1C4C9] hover:bg-[#EAEAEC] hover:text-[#9AA0A6] transition"
                    >
                      <IconX />
                    </button>
                  )}
                  <div className="flex items-center gap-2 pr-6">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#B4B7BC]" />
                    <p className="text-[13.5px] font-medium text-[#6B7280] leading-tight">{insight.titulo}</p>
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-[1.5] text-[#9AA0A6]">{insight.corpo}</p>
                </div>
              ) : (
                <div
                  key={insight.id}
                  className={`bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border ${
                    insight.tom === "convite" ? "border-[#BBF7D0]" : "border-[#FDE9C8]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        insight.tom === "convite"
                          ? "bg-[#22C55E] shadow-[0_0_0_4px_rgba(34,197,94,0.15)]"
                          : "bg-[#F59E0B] shadow-[0_0_0_4px_rgba(245,158,11,0.15)]"
                      }`}
                    />
                    <p className="text-[14px] font-semibold text-[#111] leading-tight">{insight.titulo}</p>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.5] text-[#6B7280]">{insight.corpo}</p>
                  {insight.acao && "href" in insight.acao && (
                    <a
                      href={insight.acao.href}
                      className={`mt-3 inline-block h-[38px] leading-[38px] px-4 rounded-full text-white text-[13px] font-semibold transition ${
                        insight.tom === "convite" ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-[#111] hover:bg-[#2A2A2A]"
                      }`}
                    >
                      {insight.acao.texto}
                    </a>
                  )}
                  {insight.acao && "onClick" in insight.acao && (
                    <button
                      onClick={insight.acao.onClick}
                      className={`mt-3 h-[38px] px-4 rounded-full text-white text-[13px] font-semibold transition ${
                        insight.tom === "convite" ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-[#111] hover:bg-[#2A2A2A]"
                      }`}
                    >
                      {insight.acao.texto}
                    </button>
                  )}
                </div>
              )
            )}

            {insights.length === 0 && mensagens.length === 0 && (
              <p className="text-[13px] text-[#9AA0A6] mt-6 text-center">Tudo em dia por aqui.</p>
            )}

            {mensagens.length > 0 && (
              <div className="mt-2 space-y-2.5">
                {mensagens.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-[16px] px-3.5 py-2.5 text-[13.5px] leading-[1.45] ${
                        m.role === "user" ? "bg-[#3B82F6] text-white rounded-br-[4px]" : "bg-white border border-[#F0F0F0] text-[#111] rounded-bl-[4px] shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {enviando && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#F0F0F0] rounded-[16px] rounded-bl-[4px] px-3.5 py-2.5 text-[13px] text-[#9AA0A6]">
                      digitando...
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="h-6" />
          </div>
        </div>

        <div className="px-3 pb-2 bg-[#FBFBFC]">
          <div className="h-[52px] rounded-full bg-white border border-[#EDEDEF] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 px-2">
            <button className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#6B7280] hover:bg-[#F0F0F2] transition">
              <IconPlus />
            </button>
            <input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") enviar(); }}
              placeholder="Fale com seu Turbo Admin"
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#9AA0A6]"
            />
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#9AA0A6] hover:text-[#6B7280]">
              <IconMic />
            </button>
            <button
              onClick={enviar}
              disabled={enviando}
              className="w-9 h-9 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-[0_4px_12px_rgba(59,130,246,0.35)] hover:bg-[#2563EB] active:scale-95 transition disabled:opacity-50"
            >
              <IconSend />
            </button>
          </div>
        </div>

        <BottomNav items={navItems} activeHref="/dashboard" />
      </div>
    </div>
  );
}
