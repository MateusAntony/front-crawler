import { Team } from "@/types/nba";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSituacaoStyle(posicao: number, situacao: string) {
  if (posicao >= 1 && posicao <= 6)
    return {
      badge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      label: "Playoffs",
      dot: "bg-emerald-400",
    };
  if (posicao >= 7 && posicao <= 10)
    return {
      badge: "bg-amber-100 text-amber-800 border border-amber-200",
      label: "Play-In",
      dot: "bg-amber-400",
    };
  return {
    badge: "bg-red-100 text-red-700 border border-red-200",
    label: "Eliminado",
    dot: "bg-red-400",
  };
}
export function getConferenciaColor(conf: string) {
  return conf === "Leste" ? "#3b82f6" : "#f59e0b";
}

export function formatPct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatPts(value: number | string) {
  return Number(value).toFixed(1);
}

export function getLeagueHighlights(teams: Team[]) {
  if (!teams.length) return null;

  return {
    bestAttack: teams.reduce((b, t) =>
      t.media_pontos_marcados > b.media_pontos_marcados ? t : b
    ),
    bestDefense: teams.reduce((b, t) =>
      t.media_pontos_sofridos < b.media_pontos_sofridos ? t : b
    ),
    bestRecord: teams.reduce((b, t) => (t.vitorias > b.vitorias ? t : b)),
    playoffs: teams.filter((t) => t.posicao >= 1 && t.posicao <= 6).length,
    playin: teams.filter((t) => t.posicao >= 7 && t.posicao <= 10).length,
  };
}