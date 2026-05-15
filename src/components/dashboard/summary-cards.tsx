"use client";

import { useState } from "react";
import { Users, Trophy, Swords, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TeamsModal } from "./teams-modal";
import { getLeagueHighlights } from "@/lib/utils";
import type { Team } from "@/types/nba";

interface SummaryCardsProps {
  teams: Team[];
  loading: boolean;
}

type ModalType = "todos" | "playoffs" | "playin" | "eliminados" | null;

export function SummaryCards({ teams, loading }: SummaryCardsProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const stats = getLeagueHighlights(teams);

  const playoffs = teams.filter((t) => t.posicao >= 1 && t.posicao <= 6);
  const playin = teams.filter((t) => t.posicao >= 7 && t.posicao <= 10);
  const eliminados = teams.filter((t) =>
    t.situacao?.toLowerCase().includes("elimin")
  );

  const cards = [
    {
      id: "todos" as ModalType,
      label: "Times na Liga",
      value: loading ? "—" : teams.length,
      sub: "clique para ver todos",
      icon: <Users className="w-4 h-4 text-blue-500" />,
      accentColor: "#3b82f6",
    },
    {
      id: "playoffs" as ModalType,
      label: "Nos Playoffs",
      value: loading ? "—" : stats?.playoffs ?? "—",
      sub: "clique para ver",
      icon: <Trophy className="w-4 h-4 text-emerald-500" />,
      accentColor: "#10b981",
    },
    {
      id: "playin" as ModalType,
      label: "Play-In",
      value: loading ? "—" : stats?.playin ?? "—",
      sub: "clique para ver",
      icon: <Swords className="w-4 h-4 text-amber-500" />,
      accentColor: "#f59e0b",
    },
    {
      id: "eliminados" as ModalType,
      label: "Eliminados",
      value: loading
        ? "—"
        : stats
        ? teams.length - stats.playoffs - stats.playin
        : "—",
      sub: "clique para ver",
      icon: <XCircle className="w-4 h-4 text-red-400" />,
      accentColor: "#f87171",
    },
  ];

  const modalTeams: Record<string, Team[]> = {
    todos: teams,
    playoffs,
    playin,
    eliminados,
  };

  const modalTitles: Record<string, string> = {
    todos: "Todos os Times",
    playoffs: "Classificados para Playoffs",
    playin: "Play-In",
    eliminados: "Eliminados",
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Card
            key={c.label}
            className="cursor-pointer hover:shadow-md hover:border-border/80 transition-all active:scale-95"
            onClick={() => setModal(c.id)}
          >
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {c.label}
                </span>
                <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-sm">
                  {c.icon}
                </span>
              </div>
              <span className="text-2xl font-bold" style={{ color: c.accentColor }}>
                {c.value}
              </span>
              <span className="text-xs text-muted-foreground">{c.sub}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {modal && (
        <TeamsModal
          open={!!modal}
          onClose={() => setModal(null)}
          title={modalTitles[modal]}
          teams={modalTeams[modal]}
        />
      )}
    </>
  );
}