"use client";

import { useState } from "react";
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { useCompare } from "@/hooks/useCompare";
import { formatPts, formatPct } from "@/lib/utils";
import type { Team } from "@/types/nba";

interface ComparePanelProps {
  teamNames: string[];
}

const STAT_ROWS = [
  { key: "vitorias",              label: "Vitórias",       better: "maior" },
  { key: "derrotas",              label: "Derrotas",       better: "menor" },
  { key: "percentual_vitorias",   label: "Aproveitamento", better: "maior", fmt: "pct" },
  { key: "media_pontos_marcados", label: "Pts marcados",   better: "maior", fmt: "pts" },
  { key: "media_pontos_sofridos", label: "Pts sofridos",   better: "menor", fmt: "pts" },
  { key: "saldo_pontos",          label: "Saldo",          better: "maior" },
] as const;

function WinnerIcon({ side }: { side: "left" | "right" | "draw" }) {
  if (side === "draw") return <Minus className="w-3 h-3 text-muted-foreground" />;
  return <TrendingUp className="w-3 h-3 text-emerald-500" />;
}

export function ComparePanel({ teamNames }: ComparePanelProps) {
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");

  const { data, isFetching, error } = useCompare(t1, t2);

  const team1 = data?.[t1] as Team | undefined;
  const team2 = data?.[t2] as Team | undefined;

  function formatVal(val: number, fmt?: string) {
    if (fmt === "pct") return formatPct(val);
    if (fmt === "pts") return formatPts(val);
    return String(val);
  }

  function winner(key: string, better: string): "left" | "right" | "draw" {
    if (!team1 || !team2) return "draw";
    const v1 = Number(team1[key as keyof Team]);
    const v2 = Number(team2[key as keyof Team]);
    if (v1 === v2) return "draw";
    return (better === "maior" ? v1 > v2 : v1 < v2) ? "left" : "right";
  }

  return (
    <Card>
      <CardHeader className="px-5 pt-5 pb-0">
        <SectionHeader title="Comparar Times" />
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* selects */}
        <div className="flex gap-2 items-center">
          <select
            value={t1}
            onChange={(e) => setT1(e.target.value)}
            className="flex-1 rounded-xl border border-input bg-muted text-sm p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Time 1</option>
            {teamNames.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <ArrowLeftRight className="w-4 h-4 text-muted-foreground shrink-0" />

          <select
            value={t2}
            onChange={(e) => setT2(e.target.value)}
            className="flex-1 rounded-xl border border-input bg-muted text-sm p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Time 2</option>
            {teamNames.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* erro */}
        {error && (
          <p className="text-sm text-destructive text-center py-2">
            {error.message}
          </p>
        )}

        {/* loading */}
        {isFetching && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* resultado */}
        {team1 && team2 && !isFetching && (
          <div className="rounded-xl border border-border overflow-hidden">
            {/* header */}
            <div className="grid grid-cols-3 bg-muted px-4 py-2 text-xs font-bold text-muted-foreground">
              <span className="truncate">{team1.time}</span>
              <span className="text-center">Estatística</span>
              <span className="text-right truncate">{team2.time}</span>
            </div>
        
            {/* linhas */}
            {STAT_ROWS.map(({ key, label, better, fmt }) => {
              const w = winner(key, better);
              const v1 = formatVal(
                Number(team1[key as keyof Team]),
                fmt
              );
              const v2 = formatVal(
                Number(team2[key as keyof Team]),
                fmt
              );

              return (
                <div
                  key={key}
                  className="grid grid-cols-3 px-4 py-2.5 border-t border-border text-sm items-center"
                >
                  <div className="flex items-center gap-1">
                    {w === "left" && <WinnerIcon side="left" />}
                    {w === "draw" && <WinnerIcon side="draw" />}
                    <span className={w === "left" ? "font-bold text-foreground" : "text-muted-foreground"}>
                      {v1}
                    </span>
                  </div>
                  <span className="text-center text-xs text-muted-foreground">
                    {label}
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <span className={w === "right" ? "font-bold text-foreground" : "text-muted-foreground"}>
                      {v2}
                    </span>
                    {w === "right" && <WinnerIcon side="right" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* estado inicial */}
        {!t1 && !t2 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Selecione dois times para comparar
          </p>
        )}
      </CardContent>
    </Card>
  );
}