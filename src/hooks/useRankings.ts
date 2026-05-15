import { useQuery } from "@tanstack/react-query";
import { nbaService, api } from "@/services/api";

export function useRankingAtaque(n = 30, conferencia?: string) {
  return useQuery({
    queryKey: ["rankings", "ataque", n, conferencia],
    queryFn: () => nbaService.getRankingAtaque(n, conferencia),
    staleTime: 60_000,
  });
}

export function useRankingDefesa(n = 30, conferencia?: string) {
  return useQuery({
    queryKey: ["rankings", "defesa", n, conferencia],
    queryFn: () => nbaService.getRankingDefesa(n, conferencia),
    staleTime: 60_000,
  });
}

export function useRankingCasa(conferencia?: string) {
  return useQuery({
    queryKey: ["rankings", "casa", conferencia],
    queryFn: () =>
      api
        .get<{ total: number; ranking_casa: any[] }>("/standings/casa", {
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
        .get<{ total: number; ranking_fora: any[] }>("/standings/fora", {
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
        .get<{ divisao: string; total: number; times: any[] }>(
          `/standings/divisao/${nome}`
        )
        .then((r) => r.data),
    staleTime: 60_000,
  });
}