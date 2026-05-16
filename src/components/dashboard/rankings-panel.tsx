"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import {
  useRankingAtaque,
  useRankingDefesa,
  useRankingCasa,
  useRankingFora,
  useDivisao,
} from "@/hooks/useRankings";
import { formatPts, getConferenciaColor } from "@/lib/utils";

// ── BarRow ──────────────────────────────────────────────
function BarRow({
  rank, name, value, max, barValue, color, suffix,
}: {
  rank: number;
  name: string;
  value: number | string;
  max: number;
  barValue?: number;
  color: string;
  suffix: string;
}) {
  const numValue = Number(value);
  const display = barValue ?? numValue;
  const pct = Math.min(Math.round((display / max) * 100), 100);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-4 text-right">{rank}</span>
      <span className="text-xs font-medium w-32 truncate">{name}</span>
      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold text-foreground w-14 text-right">
        {typeof value === "number" ? formatPts(value) : value}{suffix}
      </span>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────
function RankingSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="w-4 h-3 rounded" />
          <Skeleton className="w-32 h-3 rounded" />
          <Skeleton className="flex-1 h-2 rounded-full" />
          <Skeleton className="w-14 h-3 rounded" />
        </div>
      ))}
    </div>
  );
}

// ── Painel de Ataque e Defesa ─────────────────────────────
function AtaqueDefesaPanel() {
  const { data: ataqueData, isLoading: loadingAtaque } = useRankingAtaque(10);
  const { data: defesaData, isLoading: loadingDefesa } = useRankingDefesa(10);


  const ataque = ataqueData?.ranking_ataque ?? [];
  const defesa = defesaData?.ranking_defesa ?? [];

  const maxAtaque = ataque[0]?.media_pontos_marcados ?? 1;
  const maxDefesa = defesa.length
    ? Math.max(...defesa.map((t) => t.media_pontos_sofridos))
    : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="px-5 pt-5 pb-0">
          <SectionHeader title="Melhores Ataques" />
          <p className="text-xs text-muted-foreground -mt-1">Mais pontos marcados por jogo</p>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          {loadingAtaque ? <RankingSkeleton /> : ataque.map((t, i) => (
            <BarRow
              key={t.time}
              rank={i + 1}
              name={t.time}
              value={t.media_pontos_marcados}
              max={maxAtaque}
              color={getConferenciaColor(t.conferencia)}
              suffix=" pts"
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-5 pt-5 pb-0">
          <SectionHeader title="Melhores Defesas" />
          <p className="text-xs text-muted-foreground -mt-1">Menos pontos sofridos por jogo</p>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          {loadingDefesa ? <RankingSkeleton /> : defesa.map((t, i) => (
            <BarRow
              key={t.time}
              rank={i + 1}
              name={t.time}
              value={t.media_pontos_sofridos}
              max={maxDefesa}
              barValue={maxDefesa - t.media_pontos_sofridos + maxDefesa * 0.1}
              color={getConferenciaColor(t.conferencia)}
              suffix=" pts"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Painel Casa e Fora ────────────────────────────────────
function CasaForaPanel() {
  const { data: casaData, isLoading: loadingCasa } = useRankingCasa();
  const { data: foraData, isLoading: loadingFora } = useRankingFora();

  const casa = casaData?.ranking_casa ?? [];
  const fora = foraData?.ranking_fora ?? [];

  const maxCasa = casa[0]?.vitorias_casa ?? 1;
  const maxFora = fora[0]?.vitorias_fora ?? 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="px-5 pt-5 pb-0">
          <SectionHeader title="Melhor Desempenho em Casa" />
          <p className="text-xs text-muted-foreground -mt-1">Vitórias jogando em casa</p>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          {loadingCasa ? <RankingSkeleton rows={5} /> : casa.slice(0, 10).map((t, i) => (
            <BarRow
              key={t.time}
              rank={i + 1}
              name={t.time}
              value={t.resultado_casa}
              max={maxCasa}
              barValue={t.vitorias_casa}
              color={getConferenciaColor(t.conferencia)}
              suffix=""
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-5 pt-5 pb-0">
          <SectionHeader title="Melhor Desempenho Fora" />
          <p className="text-xs text-muted-foreground -mt-1">Vitórias jogando fora de casa</p>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          {loadingFora ? <RankingSkeleton rows={5} /> : fora.slice(0, 10).map((t, i) => (
            <BarRow
              key={t.time}
              rank={i + 1}
              name={t.time}
              value={t.resultado_fora}
              max={maxFora}
              barValue={t.vitorias_fora}
              color={getConferenciaColor(t.conferencia)}
              suffix=""
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Painel de Divisões ────────────────────────────────────
const DIVISOES = [
  { nome: "atlantico",  label: "Atlântico" },
  { nome: "central",   label: "Central" },
  { nome: "sudeste",   label: "Sudeste" },
  { nome: "noroeste",  label: "Noroeste" },
  { nome: "pacifico",  label: "Pacífico" },
  { nome: "sudoeste",  label: "Sudoeste" },
];

function DivisaoCard({ nome, label }: { nome: string; label: string }) {
  const { data, isLoading } = useDivisao(nome);
  const times = data?.times ?? [];

  const sorted = [...times].sort((a, b) => b.vitorias - a.vitorias);
  const leader = sorted[0]?.vitorias ?? 0;

  return (
    <Card>
      <CardHeader className="px-5 pt-4 pb-0">
        <SectionHeader title={`Divisão ${label}`} />
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        {isLoading ? (
          <RankingSkeleton rows={5} />
        ) : (
          <div className="space-y-1">
            {sorted.map((t, i) => {
              const gb = i === 0 ? "-" : ((leader - t.vitorias) / 1).toFixed(0) + " GB";
              const pct = (t.vitorias / (t.vitorias + t.derrotas)) * 100;
              const barColor = getConferenciaColor(t.conferencia);

              return (
                <div
                  key={t.time}
                  className="flex items-center gap-2 py-1.5 border-b border-border/40 last:border-0"
                >
                  {/* rank */}
                  <span className="text-xs text-muted-foreground w-4 text-center font-bold">
                    {i + 1}
                  </span>

                  {/* nome */}
                  <span className="text-xs font-semibold flex-1 truncate">
                    {t.time}
                  </span>

                  {/* barra de aproveitamento */}
                  <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>

                  {/* W/L */}
                  <span className="text-xs font-bold text-foreground w-12 text-right">
                    {t.vitorias}-{t.derrotas}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DivicoesPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {DIVISOES.map((d) => (
        <DivisaoCard key={d.nome} nome={d.nome} label={d.label} />
      ))}
    </div>
  );
}

// ── Rankings Panel principal ──────────────────────────────
export function RankingsPanel() {
  return (
    <div className="space-y-6">
      <AtaqueDefesaPanel />

      <div>
        <h2 className="text-sm font-bold text-foreground mb-3 px-1">
          Desempenho Casa & Fora
        </h2>
        <CasaForaPanel />
      </div>

      <div>
        <h2 className="text-sm font-bold text-foreground mb-3 px-1">
          Rankings por Divisão
        </h2>
        <DivicoesPanel />
      </div>
    </div>
  );
}
