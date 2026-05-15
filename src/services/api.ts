import axios from "axios";
import { StandingsResponse,ConferenciaResponse,CompareResponse,Team} from "@/types/nba";


export const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

console.log("BASE URL:", process.env.NEXT_PUBLIC_API_URL);


api.interceptors.response.use(
    (res) => res,
    (err)=>{
        const msg = err.response?.data?.detail ?? err.message ?? "Erro";
        return Promise.reject(new Error(msg));
    }
);

export const nbaService = {
    getStandings: (conferencia?: string,situacao?: string) => 
        api.get<StandingsResponse>("/standings", { params: { conferencia, situacao } })
        .then((r) => r.data),

    getByConference: (nome: string) =>
        api.get<ConferenciaResponse>(`/standings/conference/${nome}`, { params: { nome } })
        .then((r) => r.data),

    getPlayoffs: (conferencia: string) => 
        api.get<{ total: number, times: Team[] }>(`/standings/playoffs`, { params: { conferencia } })
        .then((r) => r.data),
    
    getPlayin: (conferencia: string) =>
        api.get<{ total: number, times: Team[] }>(`/standings/playin`, { params: { conferencia } })
        .then((r) => r.data),

    getEliminados: (conferencia: string) =>
        api.get<{ total: number, times: Team[] }>(`/standings/eliminados`, { params: { conferencia } })
        .then((r) => r.data),

    getRankingAtaque: (n = 30, conferencia?: string) =>
        api.get<{ total: number; ranking_ataque: Team[] }>(`/rankings/ataque`, { params: { n, conferencia } })
        .then((r) => r.data),

    getRankingDefesa: (n = 30, conferencia?: string) =>
        api.get<{ total: number; ranking_defesa: Team[] }>(`/rankings/defesa`, { params: { n, conferencia } })
        .then((r) => r.data),

    comparar: (time1: string, time2: string) =>
        api.get<CompareResponse>(`/comparar`, { params: { time1, time2 } })
        .then((r) => r.data),

};
