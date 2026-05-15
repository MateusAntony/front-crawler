import { useQuery } from "@tanstack/react-query";
import { nbaService } from "@/services/api";

export function useStandings() {
  return useQuery({
    queryKey: ["standings"],
    queryFn: () => nbaService.getStandings(),
    staleTime: 60_000,
  });
}