"use client";

import { useState, useMemo } from "react";
import { useStandings } from "@/hooks/useStandings";
import type { ViewTab } from "@/types/nba";
import { RankingsPanel } from "@/components/dashboard/rankings-panel";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { StandingsTable } from "@/components/dashboard/standings-table";
import { ComparePanel } from "@/components/dashboard/compare-panel";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  const [tab, setTab] = useState<ViewTab>("Estatisticas");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useStandings();

  const teams = data?.standings ?? [];

  const teamNames = useMemo(
    () => [...new Set(teams.map((t) => t.time))].sort(),
    [teams]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        tab={tab}
        onTabChange={setTab}
        search={search}
        onSearchChange={setSearch}
        teams={teams}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          Não foi possível conectar à API: {error.message}
        </div>
      )}

      {tab === "Estatisticas" && (
        <>
          <SummaryCards teams={teams} loading={isLoading} />
          <StandingsTable teams={teams} loading={isLoading}  />
        </>
      )}

      {tab === "Comparar" && (
        <ComparePanel teamNames={teamNames} />
      )}

      {tab === "Rankings" && (
        <RankingsPanel />
      )}
</main>
    </div>
  );
}