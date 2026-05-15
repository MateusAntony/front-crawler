"use client";

import { Modal } from "@/components/ui/modal";
import { TeamRow } from "./team-row";
import type { Team } from "@/types/nba";

interface TeamsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  teams: Team[];
}

export function TeamsModal({ open, onClose, title, teams }: TeamsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={`${title} — ${teams.length} times`}>
      {teams.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhum time encontrado.
        </p>
      ) : (
        <div>
          {teams
            .sort((a, b) => {
              // playoffs e playin ordenam por posição, eliminados por vitórias
              if (a.posicao && b.posicao) return a.posicao - b.posicao;
              return b.vitorias - a.vitorias;
            })
            .map((t, i) => (
              <TeamRow key={t.time} team={t} rank={t.posicao || i + 1} />
            ))}
        </div>
      )}
    </Modal>
  );
}