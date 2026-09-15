'use client'
import { useEffect, useState } from "react";
import { SmallBrainLogo, IconPlus } from "@/components/xray/ui";
import { BottomNav, NavItem } from "@/components/xray/bottom-nav";
import type { ContatoComArquivo, Papel } from "@/lib/core/contatos";

const navItems: NavItem[] = [
  { key: "dashboard", label: "Central", href: "/dashboard", icon: "house" },
  { key: "contatos", label: "Contatos", href: "/contatos", icon: "users" },
  { key: "plugins", label: "Plugins", href: "/plugins", icon: "box" },
];

export default function Contatos() {
  const [contatos, setContatos] = useState<ContatoComArquivo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [papel, setPapel] = useState<Papel>("indefinido");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/contatos");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar contatos");
      setContatos(data.contatos || []);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar() {
    if (!nome) return;
    setSalvando(true);
    try {
      const res = await fetch("/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone: telefone || undefined, papel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar contato");
      setNome("");
      setTelefone("");
      setPapel("indefinido");
      setMostrarForm(false);
      await carregar();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(fileId: string) {
    try {
      const res = await fetch(`/api/contatos/${fileId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao excluir contato");
      }
      setContatos((prev) => prev.filter((c) => c.fileId !== fileId));
    } catch (e: any) {
      setErro(e.message);
    }
  }

  const rotuloPapel: Record<Papel, string> = {
    cliente: "Cliente",
    fornecedor: "Fornecedor",
    indefinido: "Contato",
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F6F7] flex justify-center items-start md:items-center md:py-8 font-[Inter]">
      <div className="w-full max-w-[390px] bg-white h-screen md:h-[860px] md:rounded-[32px] md:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
        <div className="flex items-center justify-between px-5 h-[56px] shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#F3F3F4] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <SmallBrainLogo />
            <span className="font-bold text-[14px] tracking-[-0.01em]">CONTATOS</span>
          </div>
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="w-9 h-9 rounded-full bg-[#3B82F6] flex items-center justify-center text-white hover:bg-[#2563EB] transition"
          >
            <IconPlus />
          </button>
        </div>

        {mostrarForm && (
          <div className="px-4 pt-4 bg-[#FBFBFC] border-b border-[#F0F0F0] pb-4 space-y-2">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome ou apelido"
              className="w-full h-[44px] rounded-[12px] border border-[#EDEDEF] px-3 text-[14px] outline-none"
            />
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Telefone (opcional)"
              className="w-full h-[44px] rounded-[12px] border border-[#EDEDEF] px-3 text-[14px] outline-none"
            />
            <select
              value={papel}
              onChange={(e) => setPapel(e.target.value as Papel)}
              className="w-full h-[44px] rounded-[12px] border border-[#EDEDEF] px-3 text-[14px] outline-none bg-white"
            >
              <option value="indefinido">Ainda não sei</option>
              <option value="cliente">Cliente</option>
              <option value="fornecedor">Fornecedor</option>
            </select>
            <button
              onClick={criar}
              disabled={salvando || !nome}
              className="w-full h-[44px] rounded-[12px] bg-[#3B82F6] text-white text-[14px] font-semibold disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar contato"}
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 bg-[#FBFBFC] space-y-3">
          {erro && (
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] text-[12.5px] rounded-[12px] p-3">{erro}</div>
          )}

          {carregando && <p className="text-[13px] text-[#9AA0A6]">Carregando...</p>}

          {!carregando && contatos.length === 0 && !erro && (
            <p className="text-[13px] text-[#9AA0A6]">Nenhum contato ainda. Toque em + pra adicionar o primeiro.</p>
          )}

          {contatos.map((c) => (
            <div key={c.fileId} className="bg-white rounded-[16px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#F2F2F3] flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-[#111]">{c.nome}</p>
                {c.telefone && <p className="text-[12.5px] text-[#6B7280] mt-0.5">{c.telefone}</p>}
                <span className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full inline-block mt-1.5">
                  {rotuloPapel[c.papel]}
                </span>
              </div>
              <button onClick={() => excluir(c.fileId)} className="text-[12px] text-[#B91C1C] font-medium px-2">
                excluir
              </button>
            </div>
          ))}
        </div>

        <BottomNav items={navItems} activeHref="/contatos" />
      </div>
    </div>
  );
}
