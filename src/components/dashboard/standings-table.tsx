"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { TeamRow } from "./team-row";
import { useFilters } from "@/hooks/useFilters";
import type { Team } from "@/types/nba";

interface StandingsTableProps {
  teams: Team[];
  loading: boolean;
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-5 h-3 rounded" />
          <Skeleton className="flex-1 h-4 rounded" />
          <Skeleton className="w-16 h-4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function StandingsTable({ teams, loading }: StandingsTableProps) {
  const { leste, oeste } = useFilters(teams, "");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[
        { label: "Conferência Leste", dot: "bg-blue-500", list: leste },
        { label: "Conferência Oeste", dot: "bg-amber-500", list: oeste },
      ].map(({ label, dot, list }) => (
        <Card key={label}>
          <CardHeader className="px-5 pt-5 pb-0">
            <SectionHeader title={label} dot={dot} count={list.length} />
          </CardHeader>
          {loading ? (
            <TableSkeleton />
          ) : (
            <CardContent className="pt-2 pb-4">
              {list.map((t, i) => (
                <TeamRow key={t.time} team={t} rank={t.posicao || i + 1} />
              ))}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}