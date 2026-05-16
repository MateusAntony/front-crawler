import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Team } from "@/types/nba";

export function useRankingAtaque(n = 30, conferencia?: string) {
  return useQuery({
    queryKey: ["rankings", "ataque", n, conferencia],
    queryFn: () =>
      api
        .get<{ total: number; ranking_ataque: Team[] }>("/rankings/ataque", {
          params: { n, conferencia },
        })
        .then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useRankingDefesa(n = 30, conferencia?: string) {
  return useQuery({
    queryKey: ["rankings", "defesa", n, conferencia],
    queryFn: () =>
      api
        .get<{ total: number; ranking_defesa: Team[] }>("/rankings/defesa", {
          params: { n, conferencia },
        })
        .then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useRankingCasa(conferencia?: string) {
  return useQuery({
    queryKey: ["rankings", "casa", conferencia],
    queryFn: () =>
      api
        .get<{ total: number; ranking_casa: Team[] }>("/standings/casa", {
          params: { conferencia },
        })
        .then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useRankingFora(conferencia?: string) {
  return useQuery({
    queryKey: ["rankings", "fora", conferencia],
    queryFn: () =>
      api
        .get<{ total: number; ranking_fora: Team[] }>("/standings/fora", {
          params: { conferencia },
        })
        .then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useDivisao(nome: string) {
  return useQuery({
    queryKey: ["divisao", nome],
    queryFn: () =>
      api
        .get<{ divisao: string; total: number; times: Team[] }>(
          `/standings/divisao/${nome}`
        )
        .then((r) => r.data),
    staleTime: 60_000,
  });
}
