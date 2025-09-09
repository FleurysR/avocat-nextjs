import serverApiClient from "./serverApiClient";
import { 
    DecisionsApiResponse, 
    LoisApiResponse, 
    LoiArticleApiResponse, 
    DecisionDetails, 
    AvocatsApiResponse,
    Juridiction, 
    JuridictionsApiResponse,
    AvocatDetails,
    Dossier
} from "@/types";

// Nouveau type pour la réponse de l'API des dossiers
export interface DossiersApiResponse {
  data: Dossier[];
  totalCount: number;
}

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

/**
 * Dossiers
 */
// Correction : cette fonction va maintenant effectuer la pagination côté client
// puisque l'API ne gère pas la pagination et renvoie tous les dossiers.
export const fetchDossiers = async (query = '', limit = 10, page = 1): Promise<DossiersApiResponse> => {
    
    // L'API renvoie un simple tableau de Dossiers
    const response = await serverApiClient.get<Dossier[]>("/dossiers/my/list");

    // Filtrer les dossiers en fonction de la recherche
    const filteredDossiers = response.data.filter(dossier => 
      dossier.objet.toLowerCase().includes(query.toLowerCase()) ||
      dossier.code.toLowerCase().includes(query.toLowerCase())
    );
    
    // Déterminer les dossiers de la page actuelle
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDossiers = filteredDossiers.slice(startIndex, endIndex);

    // Retourner les données paginées et le nombre total de dossiers filtrés
    return {
        data: paginatedDossiers,
        totalCount: filteredDossiers.length,
    };
};
