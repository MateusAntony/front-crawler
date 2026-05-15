"use client";

import { Trophy, Search, X } from "lucide-react";
import { cn, getSituacaoStyle } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import type { ViewTab, Team } from "@/types/nba";

interface HeaderProps {
  tab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  teams: Team[];
}

const TABS: { id: ViewTab; label: string }[] = [
  { id: "Estatisticas", label: "Tabela" },
  { id: "Comparar",     label: "Comparar" },
  { id: "Rankings",     label: "Rankings" },
];

interface TeamModalProps {
  team: Team;
  onClose: () => void;
}

function TeamModal({ team, onClose }: TeamModalProps) {
  const situacao = getSituacaoStyle(team.posicao, team.situacao);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-base">{team.time}</h2>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block", situacao.badge)}>
              {situacao.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* stats */}
        <div className="p-5 grid grid-cols-2 gap-3">
          {[
            { label: "Conferência",      value: team.conferencia },
            { label: "Posição",          value: team.posicao ?? "—" },
            { label: "Vitórias",         value: team.vitorias },
            { label: "Derrotas",         value: team.derrotas },
            { label: "Aproveitamento",   value: `${(team.percentual_vitorias * 100).toFixed(1)}%` },
            { label: "Saldo de pontos",  value: team.saldo_pontos > 0 ? `+${team.saldo_pontos}` : team.saldo_pontos },
            { label: "Pts marcados/jogo",value: Number(team.media_pontos_marcados).toFixed(1) },
            { label: "Pts sofridos/jogo",value: Number(team.media_pontos_sofridos).toFixed(1) },
            { label: "Em casa",          value: team.resultado_casa },
            { label: "Fora",             value: team.resultado_fora },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header({ tab, onTabChange, search, onSearchChange, teams }: HeaderProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = search.length >= 1
    ? teams.filter((t) => t.time.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  // fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(team: Team) {
    setSelectedTeam(team);
    onSearchChange("");
    setShowSuggestions(false);
  }

  return (
    <>
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-sm">
              <Trophy className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm leading-tight">NBA Standings</h1>
              <p className="text-xs text-muted-foreground leading-tight">Temporada 2024–25</p>
            </div>
          </div>

          {/* tabs */}
          <nav className="flex items-center gap-1 bg-muted p-1 rounded-xl">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                  tab === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* search com sugestões */}
          <div ref={containerRef} className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar time..."
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-xl border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-ring w-40 placeholder:text-muted-foreground"
            />

            {/* dropdown de sugestões */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {suggestions.map((team) => {
                  const s = getSituacaoStyle(team.posicao, team.situacao);
                  return (
                    <button
                      key={team.time}
                      onClick={() => handleSelect(team)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{team.time}</p>
                        <p className="text-xs text-muted-foreground">{team.conferencia}</p>
                      </div>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full shrink-0", s.badge)}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* modal do time */}
      {selectedTeam && (
        <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </>
  );
}