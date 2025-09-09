
export interface Choice {
    code: string;
    designation: string;
    description?: string;
}

// --- Types pour les Décisions ---
export interface Decision {
    code: string;
    objet?: string;
    avocatDemandeur?: string;
    avocatDefenseur?: string;
    decisionAt?: string;
    numeroDossier?: string;
}

export interface DecisionsApiResponse {
    hits: Decision[];
    query: string;
    processingTimeMs: number;
    limit: number;
    offset: number;
    estimatedTotalHits: number;
}

// ✅ Version complète de la décision pour les détails
export interface DecisionDetails {
    code: string;
    numero: string;
    decisionAt: string;
    numeroDossier: string;
    principeJuridique: string;
    keywords: string[];
    matiere: string;
    objet: string;
    juridiction: Choice;
    nature: Choice;
    solution: Choice;
    isSolutionTotal?: boolean;
    formationJudiciaire: Choice;
    chambre: Choice;
    articleUtilises: string[];
    avocatDemandeur: string;
    avocatDefendeur: string;
    presidentChambre: string;
    anonymousContent: string;
    contextualTerms: string[];
}


// --- Types pour les Lois ---
export interface Loi {
    "loi_id": string;
    "code": string;
    "titre": string;
    "version": string;
    "publieAt": string;
}

export interface LoisApiResponse {
    member: Loi[];
    totalItems: number;
}


// --- Types pour les articles de Loi ---
export interface LoiArticle {
    numero: string;
    content: string;
    code: string;
    loi: string;
    keywords: string[];
    loi_code: string;
    _formatted?: Record<string, unknown>; // Remplace any par un type plus sûr
    _rankingScore?: number;
}


export interface LoiArticleApiResponse {
    hits: LoiArticle[];
    query: string;
    processingTimeMs: number;
    limit: number;
    offset: number;
    estimatedTotalHits: number;
}


// --- Types pour les Avocats ---
export interface Avocat {
    "@id": string;
    "@type": "Avocat";
    "code": string;
    "matricule": string;
    "inscriptionAt": string;
    "genre": {
        "@type": "Genre";
        "@id": string;
        "code": string;
        "designation": string;
    };
    "ville": string;
    "createdAt": string;
    "nom": string;
    "prenoms": string;
    "phonePrincipal": string | null;
    "autrePhone": string[];
    "email": string;
    "yearExercice": number;
    "region": {
        "@id": string;
        "@type": "Region";
        "code": string;
        "designation": string;
    };
    "district": null;
    "commune": null;
}

export interface AvocatsApiResponse {
    "@context": string;
    "@id": string;
    "@type": "Collection";
    "totalItems": number;
    "member": Avocat[];
}
export interface AvocatDetails {
    "@id": string;
    "@type": "Avocat";
    "@context": string;
    code: string;
    matricule: string;
    inscriptionAt: string;
    genre: Choice;
    ville: string;
    createdAt: string;
    nom: string;
    prenoms: string;
    phonePrincipal: string | null;
    autrePhone: string[];
    email: string;
    yearExercice: number;
    region: Choice;
    district: Choice;
    commune: Choice;
}
// src/types.ts
export interface Juridiction {
  code: string;
  designation: string;
  description: string;
}

export interface JuridictionsApiResponse {
  totalItems: number;
  member: Juridiction[];
}
export interface Dossier {
    code: string;
    createdAt: string;
    objet: string;
}
