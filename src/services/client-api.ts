// src/services/client-api.ts
// ✅ FICHIER COMPLET ET CORRIGÉ + FONCTION UPDATE FIELDS

import serverApiClient from "./serverApiClient";
import { 
    DecisionsApiResponse, 
    LoisApiResponse, 
    LoiArticleApiResponse, 
    DetailedDecision, 
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

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 0 : CRÉATION DOSSIER COMPLET ✅
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✅ Crée un dossier COMPLET en UN seul appel
 */
export const createCompleteDossier = async (dossierData: NewDossierData): Promise<{
    status: string;
    message: string;
    dossier: DossierDetails;
}> => {
    try {
        console.log('📤 Appel API : POST /api/dossiers/create-dossier');
        console.log('📋 Données envoyées:', dossierData);
        
        const response = await serverApiClient.post("/dossiers/create-dossier", dossierData);
        
        console.log('✅ Dossier créé complètement:', response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la création du dossier complet:", error);
        throw error;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 : DÉCISIONS
// ═══════════════════════════════════════════════════════════════════════════

export const fetchDecisions = async (
    query = '', 
    limit = 10, 
    page = 1,
    filters: DecisionsFilters = {} 
): Promise<DecisionsApiResponse | { hits: [], limit: number, offset: number, estimatedTotalHits: number }> => {
    const offset = Math.max(0, page - 1) * limit;
    const params: Record<string, string | number> = { limit, offset };
    
    if (query) params.query = query;
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
    });

    try {
        const response = await serverApiClient.get<DecisionsApiResponse>("/decisions", { params });
        return response.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération des décisions:", error);
        if (error.response && error.response.status === 408) {
            console.warn("La recherche a expiré (Timeout 408).");
        }
        return { hits: [], limit, offset, estimatedTotalHits: 0 };
    }
};

export const fetchDecisionByCode = async (code: string): Promise<DetailedDecision> => {
    const response = await serverApiClient.get<DetailedDecision>(`/decisions/${code}`);
    return response.data;
};

export const exportDecisionPdf = async (code: string): Promise<Blob> => {
    try {
        const response = await serverApiClient.get<Blob>(`/decisions/${code}/export/pdf`, {
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'exportation du PDF de la décision :", error);
        throw error;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2 : LOIS ET ARTICLES
// ═══════════════════════════════════════════════════════════════════════════

export const fetchLois = async (query = '', limit = 10, page = 1): Promise<LoisApiResponse> => {
    const params: Record<string, string | number> = { limit, page };
    if (query) params.search = query;
    const response = await serverApiClient.get<LoisApiResponse>("/lois", { params });
    return response.data;
};

export const fetchLoiArticles = async (query = '', limit = 10, page = 1): Promise<LoiArticleApiResponse> => {
    const params: Record<string, string | number> = { limit, page };
    if (query) params.query = query;
    const response = await serverApiClient.get<LoiArticleApiResponse>("/loi_articles", { params });
    return response.data;
};

interface LoiCategoryApiResponse {
    member: Array<{
        code: string;
        designation: string;
        description: string;
    }>;
}

export const fetchLoiCategories = async (): Promise<LoiCategoryApiResponse> => {
    try {
        const response = await serverApiClient.get<LoiCategoryApiResponse>("/loi_categories");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories de loi :", error);
        throw error;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3 : JURIDICTIONS ET CHAMBRES
// ═══════════════════════════════════════════════════════════════════════════

export const fetchJuridictions = async (query = '', limit = 10, page = 1): Promise<JuridictionsApiResponse> => {
    const params: Record<string, string | number> = { limit, page };
    if (query) params.query = query;
    const response = await serverApiClient.get<JuridictionsApiResponse>("/juridictions", { params });
    return response.data;
};

export const fetchChambresJuridiques = async () => {
    const response = await serverApiClient.get<ChambresJuridiquesApiResponse>("/chambres-juridiques");
    return response.data['hydra:member'];
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 : AVOCATS
// ═══════════════════════════════════════════════════════════════════════════

export const fetchAvocats = async (
    query: string = '', 
    sortField: 'nom' | 'ville' | null = null,
    sortOrder: 'asc' | 'desc' | null = null,
    limit: number = 10, 
    page: number = 1
): Promise<AvocatsApiResponse> => {
    const baseParams: Record<string, string | number> = { limit, page };
    const filterParams: Record<string, string | number> = {};

    if (query) filterParams.search = query;
    if (sortField && sortOrder) {
        if (sortField === 'nom') {
            filterParams['order[nom]'] = sortOrder;
        } else if (sortField === 'ville') {
            filterParams['order[ville]'] = sortOrder;
        }
    }

    const params = { ...baseParams, ...filterParams };
    const response = await serverApiClient.get<AvocatsApiResponse>("/avocats", { params });
    return response.data;
};

export const fetchAvocatDetails = async (code: string): Promise<AvocatDetails> => {
    const response = await serverApiClient.get<AvocatDetails>(`/avocats/${code}`);
    const avocat = response.data;

    const fetchRelation = async <T extends Region | District | Commune>(
        relation: string | T | null
    ): Promise<T | null> => {
        if (!relation) return null;
        if (typeof relation !== "string") return relation;
        const cleanedUrl = relation.startsWith("/api") ? relation.replace(/^\/api/, "") : relation;
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

    return { ...avocat, region, district, commune };
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5 : DOSSIERS
// ═══════════════════════════════════════════════════════════════════════════

export const fetchDossiers = async (query = '', limit = 10, page = 1): Promise<DossiersApiResponse> => {
    const response = await serverApiClient.get<Dossier[]>("/dossiers/my/list");

    const filteredDossiers = response.data.filter(dossier => 
        (dossier.objet?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (dossier.code?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDossiers = filteredDossiers.slice(startIndex, endIndex);

    return {
        data: paginatedDossiers,
        totalCount: filteredDossiers.length,
    };
};

export const fetchDossierByCode = async (code: string): Promise<DossierDetails> => {
    const response = await serverApiClient.get<DossierDetails>(`/dossiers/${code}`);
    return response.data;
};

export const fetchDossierDetails = async (dossierCode: string): Promise<DossierDetails> => {
    const response = await serverApiClient.get<DossierDetails>(`/dossiers/${dossierCode}`);
    return response.data;
};

export const createDossier = async (dossierData: NewDossierData): Promise<DossierDetails> => {
    try {
        const response = await serverApiClient.post<DossierDetails>("/dossiers/create-dossier", dossierData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du dossier:", error);
        throw error;
    }
};

export const generateDossierDraft = async (dossierData: NewDossierData): Promise<{
    status: string;
    message: string;
    dossier: DossierDetails;
}> => {
    try {
        const response = await serverApiClient.post("/dossiers/generate-draft", dossierData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la génération du brouillon:", error);
        throw error;
    }
};

export const confirmAndSaveDossier = async (dossier: DossierDetails): Promise<{
    status: string;
    message: string;
    dossier: DossierDetails;
}> => {
    try {
        const response = await serverApiClient.post("/dossiers/confirm-and-save", {
            dossier: dossier
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du dossier:", error);
        throw error;
    }
};

export const updateDossier = async (code: string, dossierData: NewDossierData): Promise<DossierDetails> => {
    try {
        const response = await serverApiClient.put<DossierDetails>(`/dossiers/${code}`, dossierData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du dossier:", error);
        throw error;
    }
};

/**
 * ✅ NOUVELLE FONCTION - Met à jour les champs individuels d'un dossier
 * Correspond à la route PUT /api/dossiers/{code}/update-fields
 */
export const updateDossierFields = async (
    code: string, 
    fields: {
        juridictionCode?: string;
        chambreJuridiqueCode?: string;
        solutionJuridiqueCode?: string;
        stylePlaidoirieCode?: string;
        strategyCode?: string;
        objet?: string;
        matiere?: string;
        resume?: string;
        objectif?: string;
        faits?: string;
        preuves?: string;
        pointFort?: string;
        pointFaible?: string;
    }
): Promise<DossierDetails> => {
    try {
        console.log('📤 updateDossierFields - Appel API');
        console.log('🔗 URL:', `/dossiers/${code}/update-fields`);
        console.log('📋 Payload:', fields);
        
        const response = await serverApiClient.put<DossierDetails>(
            `/dossiers/${code}/update-fields`, 
            fields
        );
        
        console.log('✅ Réponse API:', response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Erreur lors de la mise à jour des champs:", error);
        console.error("❌ Détails erreur:", error.response?.data);
        throw error;
    }
};

export const addDecisionToDossier = async (
    dossierCode: string, 
    decisionCode: string | number, 
    scorePertinence: number = 1
) => {
    const payload = {
        decision_id: decisionCode,
        scorePertinence,
    };
    return serverApiClient.post(`/dossiers/${dossierCode}/decision`, payload);
};

export const removeDecisionFromDossier = async (
    dossierCode: string, 
    decisionCode: string
): Promise<{ message: string }> => {
    try {
        const response = await serverApiClient.delete(`/dossiers/${dossierCode}/decision/${decisionCode}`);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur suppression décision:", error);
        throw error;
    }
};

export const addArticleToDossier = async (
    dossierCode: string, 
    articleCode: string | number, 
    scorePertinence: number = 1
) => {
    const payload = {
        loi_article_id: articleCode,
        scorePertinence,
    };
    return serverApiClient.post(`/dossiers/${dossierCode}/loi_article`, payload);
};

export const removeLoiFromDossier = async (
    dossierCode: string, 
    loiCode: string
): Promise<{ message: string }> => {
    try {
        const response = await serverApiClient.delete(`/dossiers/${dossierCode}/loi/${loiCode}`);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur suppression loi:", error);
        throw error;
    }
};

export const generateDossierStrategy = async (code: string): Promise<{
    status: string;
    message: string;
    dossier: DossierDetails;
}> => {
    try {
        const response = await serverApiClient.get(`/dossiers/${code}/generate-strategy`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la génération de la stratégie:", error);
        throw error;
    }
};

export const exportDossierStrategyPdf = async (code: string): Promise<Blob> => {
    try {
        const response = await serverApiClient.get<Blob>(`/dossiers/${code}/export-strategy-pdf`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de l'exportation du PDF:", error);
        throw error;
    }
};

export const downloadDossierStrategyPdf = async (code: string, fileName?: string): Promise<void> => {
    try {
        const blob = await exportDossierStrategyPdf(code);
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || `Stratégie-dossier-${code}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log("✅ PDF téléchargé avec succès");
    } catch (error) {
        console.error("❌ Erreur téléchargement PDF:", error);
        throw error;
    }
};

export const viewDossierStrategyPdf = async (code: string): Promise<void> => {
    try {
        const blob = await exportDossierStrategyPdf(code);
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        console.log("✅ PDF ouvert dans un nouvel onglet");
    } catch (error) {
        console.error("❌ Erreur ouverture PDF:", error);
        throw error;
    }
};

export async function fetchDossierStrategies(): Promise<DossierStrategyApiResponse> {
    const response = await serverApiClient.get<DossierStrategyApiResponse>("/dossier_strategies");
    return response.data;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6 : RECHERCHE GLOBALE
// ═══════════════════════════════════════════════════════════════════════════

export const globalSearch = async (query: string): Promise<GlobalSearchResult[]> => {
    if (!query) return [];
    try {
        const encodedQuery = encodeURIComponent(query);

        const [avocatsResponse, decisionsResponse, loisArticlesResponse] = await Promise.all([
            serverApiClient.get<AvocatsApiResponse>(`/avocats?query=${encodedQuery}&limit=10`), 
            serverApiClient.get<DecisionsApiResponse>(`/decisions?query=${encodedQuery}&limit=10`),
            serverApiClient.get<LoiArticleApiResponse>(`/loi_articles?query=${encodedQuery}&limit=10`)
        ]);
        
        const formattedResults: GlobalSearchResult[] = [];
        
        const avocats = avocatsResponse.data['hydra:member'];
        if (avocats && Array.isArray(avocats)) {
            avocats.forEach((avocat: Avocat) => {
                formattedResults.push({
                    id: avocat.code,
                    title: `${avocat.nom} ${avocat.prenoms}`,
                    type: "avocat",
                    details: avocat,
                });
            });
        }

        const decisionsHits = decisionsResponse.data?.hits;
        if (decisionsHits && Array.isArray(decisionsHits)) {
            decisionsHits.forEach(decision => {
                formattedResults.push({
                    id: decision.code,
                    title: decision.objet || `Décision n° ${decision.numeroDossier}`,
                    type: "decision",
                    details: decision,
                });
            });
        }
        
        const loisHits = loisArticlesResponse.data?.hits;
        if (loisHits && Array.isArray(loisHits)) {
            loisHits.forEach((article: LoiArticle) => {
                formattedResults.push({
                    id: article.code,
                    title: `Loi Article n° ${article.numero}`,
                    type: "article",
                    details: article,
                });
            });
        }

        return formattedResults;
    } catch (error) {
        console.error("Erreur lors de la recherche globale:", error);
        return [];
    }
};
