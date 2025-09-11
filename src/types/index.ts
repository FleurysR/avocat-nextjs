// Interfaces de base
export interface ApiCollection<T> {
  "@context": string;
  "@id": string;
  "@type": string;
  "hydra:member": T[];
  "hydra:totalItems": number;
}

export interface ApiItem {
  "@context": string;
  "@id": string;
  "@type": string;
}

export interface Choice {
    code: string;
    designation: string;
    description?: string;
}

// ==============
// Définitions géographiques précises
// ==============

export interface Region {
  "@id": string;
  "@type": "Region";
  code: string;
  designation: string;
}

export interface District {
  "@id": string;
  "@type": "District";
  code: string;
  designation: string;
  region: Region;
}

export interface Commune {
  "@id": string;
  "@type": "Commune";
  code: string;
  designation: string;
  district: District;
}

// ==============
// Décisions
// ==============

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

// ==============
// Avocats
// ==============

export interface Avocat {
    "@id": string;
    "@type": "Avocat";
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
    region: Region;
    district: District;
    commune: Commune;
}

export interface AvocatsApiResponse {
    "@context": string;
    "@id": string;
    "@type": "Collection";
    totalItems: number;
    member: Avocat[];
}

export interface AvocatDetails {
    "@id": string;
    "@type": "Avocat";
    "@context": string;
    code: string;
    matricule: string;
    inscriptionAt: string;
    genre: Choice;
    designation: string;
    ville: string;
    createdAt: string;
    nom: string;
    prenoms: string;
    phonePrincipal: string | null;
    autrePhone: string[];
    email: string;
    yearExercice: number;
    region: Region;
    district: District;
    commune: Commune;
}

// ==============
// Lois
// ==============

export interface Loi {
    loi_id: string;
    code: string;
    titre: string;
    version: string;
    publieAt: string;
}

export interface LoisApiResponse {
    member: Loi[];
    totalItems: number;
}

export interface LoiArticle {
    numero: string;
    content: string;
    code: string;
    loi: string;
    keywords: string[];
    loi_code: string;
    _formatted?: Record<string, unknown>;
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

// ==============
// Juridictions
// ==============

export interface Juridiction {
  code: string;
  designation: string;
  description: string;
}

export interface JuridictionsApiResponse {
  totalItems: number;
  member: Juridiction[];
}


// ==============
// Dossiers
// ==============

// Type pour la liste des dossiers
export interface Dossier {
    code: string;
    createdAt: string;
    objet: string;
}

// Type pour les objets imbriqués dans le dossier détaillé
export interface DossierNestedEntity extends ApiItem {
  code: string;
  designation: string;
  description: string;
}

// Type pour les décisions associées à un dossier
export interface DossierDecision {
  "@context": string;
  "@id": string;
  "@type": string;
  decision: Decision;
  scorePertinence: number;
}

// Type pour les articles de loi associés à un dossier
export interface DossierLoiArticle {
  "@context": string;
  "@id": string;
  "@type": string;
  loiArticle: LoiArticle;
  scorePertinence: number;
  formattedContent: string;
}

// Type principal pour un dossier détaillé
export interface DossierDetails extends ApiItem {
  code: string;
  description: string;
  objectif: string;
  createdAt: string;
  chambreJuridique: DossierNestedEntity;
  solutionJuridique: DossierNestedEntity;
  strategy: DossierNestedEntity;
  objet: string;
  matiere: string;
  juridiction: DossierNestedEntity;
  preuves: string;
  pointFaible: string;
  pointFort: string;
  stylePlaidoirie: DossierNestedEntity;
  keywords: string[];
  contextualTerms: string[];
  resume: string;
  faits: string;
  generated: boolean;
  dossierDecisions: DossierDecision[];
  dossierLoiArticles: DossierLoiArticle[];
}
