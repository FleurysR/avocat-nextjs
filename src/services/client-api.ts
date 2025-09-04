// src/services/client-api.ts
import serverApiClient from "./serverApiClient";
import { 
    DecisionsApiResponse, 
    LoisApiResponse, 
    LoiArticleApiResponse, 
    DecisionDetails, 
    AvocatsApiResponse,
    Juridiction, 
    JuridictionsApiResponse,
    AvocatDetails
} from "@/types";

/**
 * Décisions
 */
export const fetchDecisions = async (query = '', limit = 10, offset = 0) => {
    const params: Record<string, string | number> = { limit, offset };
    if (query) params.query = query;

    const response = await serverApiClient.get<DecisionsApiResponse>("/decisions", { params });
    return response.data;
};

export const fetchDecisionByCode = async (code: string) => {
    const response = await serverApiClient.get<DecisionDetails>(`/decisions/${code}`);
    return response.data;
};

/**
 * Lois
 */
export const fetchLois = async (query = '', limit = 10, page = 1) => {
    const params: Record<string, string | number> = { limit, page };
    if (query) params.search = query;

    const response = await serverApiClient.get<LoisApiResponse>("/lois", { params });
    return response.data;
};

export const fetchLoiArticles = async (query = '', limit = 10, offset = 0) => {
    const params: Record<string, string | number> = { limit, offset };
    if (query) params.query = query;

    const response = await serverApiClient.get<LoiArticleApiResponse>("/loi_articles", { params });
    return response.data;
};

export const fetchJuridictions = async (query = '', limit = 10, page = 1) => {
  const offset = (page - 1) * limit;
  const params: Record<string, string | number> = { limit, offset };
  if (query) params.query = query; // backend doit gérer ce paramètre

  const response = await serverApiClient.get<JuridictionsApiResponse>("/juridictions", { params });
  return response.data;
};

/**
 * Avocats
 */
export const fetchAvocats = async (query = '', limit = 10, page = 1) => {
    // Calculer l'offset à partir de la page pour la pagination
    const offset = (page - 1) * limit;
    const params: Record<string, string | number> = { limit, offset };
    if (query) params.query = query; // Assurez-vous que le backend attend "query"

    const response = await serverApiClient.get<AvocatsApiResponse>("/avocats", { params });
    return response.data;
};

export const fetchAvocatDetails = async (code: string) => {
    const response = await serverApiClient.get<AvocatDetails>(`/avocats/${code}`);
    return response.data;
};
