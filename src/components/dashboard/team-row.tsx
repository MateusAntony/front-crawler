import { Badge } from "@/components/ui/badge";
import { getSituacaoStyle, getConferenciaColor, formatPct } from "@/lib/utils";
import type { Team } from "@/types/nba";

interface TeamRowProps {
  team: Team;
  rank: number;
}

export function TeamRow({ team, rank }: TeamRowProps) {
  const situacao = getSituacaoStyle(team.posicao, team.situacao);
  const confColor = getConferenciaColor(team.conferencia);

  return (
    <div className="group flex items-center gap-3 py-2.5 px-2 border-b border-border/50 last:border-0 hover:bg-muted/50 rounded-xl transition-colors">
      {/* rank */}
      <span className="w-5 text-center text-xs font-bold text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
        {rank}
      </span>

      {/* nome + badge + casa/fora */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{team.time}</span>
          <Badge className={situacao.badge}>{situacao.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {team.resultado_casa} casa · {team.resultado_fora} fora
        </p>
      </div>

      {/* recorde + aproveitamento */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold" style={{ color: confColor }}>
          {team.vitorias}–{team.derrotas}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatPct(team.percentual_vitorias)}
        </p>
      </div>
    </div>
  );
}