import { useQuery } from "@tanstack/react-query";
import { nbaService } from "@/services/api";

export function useCompare(time1: string, time2: string) {
  return useQuery({
    queryKey: ["compare", time1, time2],
    queryFn: () => nbaService.comparar(time1, time2),
    enabled: !!time1 && !!time2,
    staleTime: 60_000,
    retry: false,
  });
}