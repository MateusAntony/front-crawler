"use client";

import { BarChart2, ArrowLeftRight, ListIcon  } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewTab } from "@/types/nba";

interface TabNavProps {
  active: ViewTab;
  onChange: (tab: ViewTab) => void;
}

const TABS: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
  { id: "Estatisticas", label: "Tabela", icon: <ListIcon className="w-3.5 h-3.5" /> },
  { id: "Comparar",     label: "Comparar", icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
  { id: "Rankings",     label: "Rankings", icon: <BarChart2 className="w-3.5 h-3.5" /> },
];

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="flex gap-1 bg-muted p-1 rounded-2xl w-fit">
      {TABS.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150",
            active === id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}