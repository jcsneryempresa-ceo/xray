'use client'
import { IconHouse, IconUsers, IconBox, IconChart, IconKey } from "./ui";

export type NavItem = { key: string; label: string; href: string; icon: IconKey | "house" };

function renderIcon(icon: NavItem["icon"], active: boolean) {
  if (icon === "house") return <IconHouse active={active} />;
  if (icon === "users") return <IconUsers active={active} />;
  if (icon === "chart") return <IconChart active={active} />;
  return <IconBox active={active} />;
}

export function BottomNav({ items, activeHref }: { items: NavItem[]; activeHref: string }) {
  return (
    <div className="w-full bg-white border-t border-[#F0F0F0] px-2 py-2.5 flex items-center justify-around shrink-0">
      {items.map((item) => {
        const isActive = activeHref === item.href;
        return (
          <a
            key={item.key}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] px-1 h-[44px] rounded-xl transition ${isActive ? "text-[#3B82F6]" : "text-[#9AA0A6]"}`}
          >
            <span>{renderIcon(item.icon, isActive)}</span>
            <span className={`text-[10px] font-medium leading-none tracking-tight ${isActive ? "text-[#3B82F6]" : "text-[#9AA0A6]"}`}>{item.label}</span>
          </a>
        );
      })}
    </div>
  );
}
