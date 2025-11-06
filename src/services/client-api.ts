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
    NewDossierData,
    LoiArticle,
    Avocat,
    GlobalSearchResult,
    DossierStrategyApiResponse,
    DossierStrategy,
    Region,
    District,
    Commune,
    Choice,
    DecisionsFilters,
    DossiersApiResponse,
    ChambresJuridiquesApiResponse

} from "@/types";

/**
 * Récupère les décisions avec pagination et filtres.
 * Calcule l'offset sur le front-end pour un back-end qui attend 'offset'.
 * Intègre la gestion des erreurs de réseau et de timeout (408).
 */
export const fetchDecisions = async (
    query = '', 
    limit = 10, 
    page = 1,
    filters: DecisionsFilters = {} 
): Promise<DecisionsApiResponse | { hits: [], limit: number, offset: number, estimatedTotalHits: number }> => {
    
    // Calcul de l'offset nécessaire pour le back-end
    // L'offset est le décalage, calculé comme (page - 1) * limit
    const offset = Math.max(0, page - 1) * limit; // Utilise Math.max pour s'assurer que l'offset n'est pas négatif

    // Les paramètres de base pour la requête
    const params: Record<string, string | number> = { 
        limit, 
        // IMPORTANT : On envoie 'offset' au lieu de 'page'
        offset 
    };
    
    // Ajoutez le paramètre de recherche si la requête n'est pas vide
    if (query) {
        params.query = query;
    }

    // Parcourez l'objet de filtres et ajoutez chaque filtre à l'URL si sa valeur n'est pas vide
    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            params[key] = value;
        }
    });

    try {
        const response = await serverApiClient.get<DecisionsApiResponse>("/decisions", { params });
        return response.data;
    } catch (error: any) {
        // En cas d'erreur réseau, de timeout (comme le 408) ou d'échec de l'API
        console.error("Erreur lors de la récupération des décisions:", error);
        
        // Gérer spécifiquement le Timeout (408)
        if (error.response && error.response.status === 408) {
            console.warn("La recherche a expiré (Timeout 408). Veuillez affiner votre requête.");
            // Loggez ou utilisez un système de notification d'interface utilisateur ici
        }
        
        // Retourner un objet de réponse vide mais structuré pour éviter de faire planter l'UI
        return {
            hits: [],
            limit: limit,
            offset: offset,
            estimatedTotalHits: 0,
            // Ajoutez d'autres champs si votre type DecisionsApiResponse en contient d'obligatoires
        };
    }
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

export const fetchLoiArticles = async (query = '', limit = 10, page = 1) => {
    const params: Record<string, string | number> = { limit, page };
    if (query) params.query = query;

    const response = await serverApiClient.get<LoiArticleApiResponse>("/loi_articles", { params });
    return response.data;
};
// Définir la structure de la réponse de l'API pour les catégories de loi
interface LoiCategoryApiResponse {
    member: Array<{
        code: string;
        designation: string;
        description: string;
    }>;
    // autres propriétés si nécessaire
}

export const fetchLoiCategories = async () => {
    try {
        const response = await serverApiClient.get<LoiCategoryApiResponse>("/loi_categories");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories de loi :", error);
        throw error;
    }
};


export const fetchJuridictions = async (query = '', limit = 10, page = 1) => {
  // 🚀 Suppression du calcul d'offset, on utilise directement 'page'
  const params: Record<string, string | number> = { limit, page };
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


export const fetchAvocats = async (
    query: string = '', 
    sortField: 'nom' | 'ville' | null = null, // MODIFIÉ
    sortOrder: 'asc' | 'desc' | null = null,
    limit: number = 10, 
    page: number = 1
) => {
    const baseParams: Record<string, string | number> = { 
        limit, 
        page 
    };

    const filterParams: Record<string, string | number> = {};

    if (query) {
        filterParams.search = query;
    }
    
    // MODIFIÉ : Gère le tri en fonction du champ
    if (sortField && sortOrder) {
        if (sortField === 'nom') {
            filterParams['order[nom]'] = sortOrder;
        } else if (sortField === 'ville') {
            filterParams['order[ville]'] = sortOrder;
        }
    }

    const params = {
        ...baseParams,
        ...filterParams,
    };

    const response = await serverApiClient.get<AvocatsApiResponse>("/avocats", { params });
    
    return response.data;
};
export const fetchAvocatDetails = async (code: string): Promise<AvocatDetails> => {
  const response = await serverApiClient.get<AvocatDetails>(`/avocats/${code}`);
  const avocat = response.data;

  // Fonction utilitaire pour fetcher une relation (region, district, commune)
  const fetchRelation = async <T extends Region | District | Commune>(
    relation: string | T | null
  ): Promise<T | null> => {
    if (!relation) return null;
    if (typeof relation !== "string") return relation;

    const cleanedUrl = relation.startsWith("/api")
      ? relation.replace(/^\/api/, "")
      : relation;

    try {
      const res = await serverApiClient.get<T>(cleanedUrl);
      return res.data;
    } catch (e) {
      console.error("Erreur fetch relation:", e);
      return null;
    }
  };

  const region = await fetchRelation<Region>(avocat.region);
  const district = await fetchRelation<District>(avocat.district);
  const commune = await fetchRelation<Commune>(avocat.commune);

  let genre: Choice | Choice[] | null = null;
  if (Array.isArray(avocat.genre) && avocat.genre.length > 0) {
    genre = avocat.genre[0];
  } else if (!Array.isArray(avocat.genre) && avocat.genre) {
    genre = avocat.genre;
  }

  return {
    ...avocat,
    region,
    district,
    commune,
  };
};

/**
 * Dossiers
 */
export const fetchDossiers = async (query = '', limit = 10, page = 1): Promise<DossiersApiResponse> => {
    // Cette fonction gère la pagination manuellement côté client.
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

/**
 * 🚀 NOUVELLE FONCTION POUR L'EXPORTATION PDF 🚀
 */
export const exportDossierStrategyPdf = async (code: string): Promise<Blob> => {
    try {
        const response = await serverApiClient.get<Blob>(`/dossiers/export-strategy-pdf/${code}`, {
            responseType: 'blob', // Indique à Axios que la réponse attendue est un fichier binaire
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'exportation du PDF:", error);
        throw error;
    }
};


export const createDossier = async (dossierData: NewDossierData): Promise<DossierDetails> => {
    try {
        const response = await serverApiClient.post<DossierDetails>("/api/dossiers/create-dossier", dossierData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du dossier:", error);
        throw error;
    }
};
/**
 * 🚀 NOUVELLE FONCTION POUR LA MISE À JOUR D'UN DOSSIER 🚀
 */
export const updateDossier = async (code: string, dossierData: NewDossierData): Promise<DossierDetails> => {
    try {
        const response = await serverApiClient.put<DossierDetails>(`/dossiers/${code}`, dossierData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du dossier:", error);
        throw error;
    }
};

export async function fetchDossierStrategies(): Promise<DossierStrategyApiResponse> {
  const response = await serverApiClient.get<DossierStrategyApiResponse>("/dossier_strategies");
  return response.data;
}
/**
 * 🚀 EXPORTER UNE DÉCISION EN PDF 🚀
 */
export const exportDecisionPdf = async (code: string): Promise<Blob> => {
    try {
        const response = await serverApiClient.get<Blob>(`/decisions/${code}/export/pdf`, {
            responseType: "blob", // pour récupérer un fichier binaire
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'exportation du PDF de la décision :", error);
        throw error;
    }
};

/**
 * 🚀 NOUVELLE FONCTION DE RECHERCHE GLOBALE 🚀
 */
export const globalSearch = async (query: string): Promise<GlobalSearchResult[]> => {
    if (!query) return [];

    try {
        const [
            avocatsResponse, 
            decisionsResponse, 
            loisArticlesResponse
        ] = await Promise.all([
            serverApiClient.get<AvocatsApiResponse>(`/avocats?query=${encodeURIComponent(query)}&limit=10`),
            serverApiClient.get<DecisionsApiResponse>(`/decisions?query=${encodeURIComponent(query)}&limit=10`),
            serverApiClient.get<LoiArticleApiResponse>(`/loi_articles?query=${encodeURIComponent(query)}&limit=10`)
        ]);

        const formattedResults: GlobalSearchResult[] = [];

        avocatsResponse.data.member.forEach((avocat: Avocat) => {
            formattedResults.push({
                id: avocat.code,
                title: `${avocat.nom} ${avocat.prenoms}`,
                type: "avocat",
                details: avocat,
            });
        });

        decisionsResponse.data.hits.forEach(decision => {
            formattedResults.push({
                id: decision.code,
                title: decision.objet || `Décision n° ${decision.numeroDossier}`,
                type: "decision",
                details: decision,
            });
        });

        loisArticlesResponse.data.hits.forEach((article: LoiArticle) => {
            formattedResults.push({
                id: article.code,
                title: `Loi Article n° ${article.numero}`,
                type: "article",
                details: article,
            });
        });

        return formattedResults;
    } catch (error) {
        console.error("Erreur lors de la recherche globale:", error);
        return [];
    }
};
