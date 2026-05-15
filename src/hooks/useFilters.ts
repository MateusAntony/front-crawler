import { useState, useMemo } from "react";
import type { Team, Conference } from "@/types/nba";

export function useFilters(teams: Team[], externalSearch = "") {
  const [conference, setConference] = useState<Conference>("Todos");

  const filtered = useMemo(() => {
    return teams
      .filter((t) => {
        const matchConf =
          conference === "Todos" ||
          (conference === "Leste" && t.conferencia === "Eastern Conference") ||
          (conference === "Oeste" && t.conferencia === "Western Conference");

        const matchSearch =
          externalSearch === "" ||
          t.time?.toLowerCase().includes(externalSearch.toLowerCase());

        return matchConf && matchSearch;
      })
      .sort((a, b) => {
        const posA = Number(a.posicao) || 999;
        const posB = Number(b.posicao) || 999;
        return posA - posB;
      });
  }, [teams, conference, externalSearch]);

  const leste = useMemo(
    () =>
      teams
        .filter((t) => t.conferencia === "Eastern Conference")
        .filter(
          (t) =>
            externalSearch === "" ||
            t.time?.toLowerCase().includes(externalSearch.toLowerCase())
        )
        .sort((a, b) => (Number(a.posicao) || 999) - (Number(b.posicao) || 999)),
    [teams, externalSearch]
  );

  const oeste = useMemo(
    () =>
      teams
        .filter((t) => t.conferencia === "Western Conference")
        .filter(
          (t) =>
            externalSearch === "" ||
            t.time?.toLowerCase().includes(externalSearch.toLowerCase())
        )
        .sort((a, b) => (Number(a.posicao) || 999) - (Number(b.posicao) || 999)),
    [teams, externalSearch]
  );

  return {
    conference,
    setConference,
    filtered,
    leste,
    oeste,
  };
}