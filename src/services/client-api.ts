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
    Dossier,
    DossierDetails,
    NewDossierData, // 🚀 Import the NewDossierData type
} from "@/types";

// Nouveau type pour la réponse de l'API des dossiers
export interface DossiersApiResponse {
  data: Dossier[];
  totalCount: number;
}

// 🚀 Nouveau type pour Chambre Juridique
export interface ChambreJuridique {
  code: string;
  designation: string;
  description: string;
}

// 🚀 Nouveau type pour la réponse de l'API des chambres juridiques
export interface ChambresJuridiquesApiResponse {
  totalItems: number;
  member: ChambreJuridique[];
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
  if (query) params.query = query;

  const response = await serverApiClient.get<JuridictionsApiResponse>("/juridictions", { params });
  return response.data;
};

// 🚀 Nouvelle fonction pour récupérer les chambres juridiques
export const fetchChambresJuridiques = async () => {
    const response = await serverApiClient.get<ChambresJuridiquesApiResponse>("/chambres-juridiques");
    // Assurez-vous que le chemin est correct selon votre API
    return response.data.member;
};

/**
 * Avocats
 */
export const fetchAvocats = async (query = '', limit = 10, page = 1) => {
    const offset = (page - 1) * limit;
    const params: Record<string, string | number> = { limit, offset };
    if (query) params.query = query;

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
export const fetchDossiers = async (query = '', limit = 10, page = 1): Promise<DossiersApiResponse> => {
    const response = await serverApiClient.get<Dossier[]>("/dossiers/my/list");

    const filteredDossiers = response.data.filter(dossier => 
      dossier.objet.toLowerCase().includes(query.toLowerCase()) ||
      dossier.code.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDossiers = filteredDossiers.slice(startIndex, endIndex);

    return {
        data: paginatedDossiers,
        totalCount: filteredDossiers.length,
    };
};

export const fetchDossierByCode = async (code: string) => {
    const response = await serverApiClient.get<DossierDetails>(`/dossiers/${code}`);
    return response.data;
};

// 🚀 Nouvelle fonction pour la création d'un dossier
export const createDossier = async (dossierData: NewDossierData): Promise<DossierDetails> => {
    try {
        const response = await serverApiClient.post<DossierDetails>("/api/dossiers/create-dossier", dossierData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du dossier:", error);
        throw error;
    }
};