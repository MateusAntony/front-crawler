export interface Team {
    time: string;
    conferencia: "Eastern Conference" | "Western Conference";
    posicao: number;
    vitorias: number;
    derrotas: number;
    percentual_vitorias: number;
    saldo_pontos: number;
    resultado_casa: string;
    resultado_fora: string;
    media_pontos_marcados: number;
    media_pontos_sofridos: number;
    situacao: string;
    data_coleta?: string;
    vitorias_casa?: number;  
    vitorias_fora?: number;
}

export interface StandingsResponse{
    total:number;
    standings: Team [];
}

export interface ConferenciaResponse{
    conferencia: string;
    total: number;
    times: Team[];
}

export interface CompareResponse{
    vantagens: Record<string,string>;
    [teamName: string]: string | Record<string, string>;
}

export interface RankingResponse{
    total: number;
    ranking_ataque?: Team[];
    ranking_defesa?: Team[];
}

export type Conference = "Todos" | "Leste" | "Oeste";
export type Situacao = "Todos" | "Playoffs" | "Play-In" | "Eliminados";
export type ViewTab = "Estatisticas" | "Comparar" | "Rankings"
