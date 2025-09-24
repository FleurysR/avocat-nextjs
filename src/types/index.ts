// ==============
// Interfaces de base
// ==============
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
  region: Region | string; // parfois Hydra renvoie juste l'IRI "/api/regions/53"
}

export interface Commune {
  "@id": string;
  "@type": "Commune";
  code: string;
  designation: string;
  district: District | string;
}
// ==============
// Décisions
// ==============
export interface Decision {
  code: string;
  objet?: string;
  avocatDemandeur?: string;
  avocatDefendeur?: string;
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
/**
 * Décisions
 */
export interface DecisionsFilters {
  solution_code?: string;
  nature_code?: string;
  juridiction_code?: string;
  numero?: string;
  numeroDossier?: string;
  avocatDemandeur?: string;
  dossier?: string;
  // Ajoutez ici tous les champs que vous souhaitez utiliser comme filtres
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
// Nouveau type pour la réponse de l'API des dossiers
export interface DossiersApiResponse {
  data: Dossier[];
  totalCount: number;
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

// 🚀 Le type final pour les détails de l'avocat,
// après que la fonction d'API a résolu toutes les relations.
export interface AvocatDetails {
  "@id": string;
  "@type": "Avocat";
  "@context": string;
  code: string;
  matricule: string;
  inscriptionAt: string;
  genre: Choice | null;
  ville: string;
  createdAt: string;
  nom: string;
  prenoms: string;
  phonePrincipal: string | null;
  autrePhone: string[];
  email: string;
  yearExercice: number;
  region: Region | null;
  district: District | null;
  commune: Commune | null;
  lastActivityAt: string | null;
  biographie?: string; // 👈 Add the biographie field
  specialites?: Choice[]; // 👈 Add the specialites field
}
// ==============
// Lois
// ==============
export interface Loi {
  loi_id: string;
  code: string;
  titre: string;
  version: string;
  numero: string; 
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
  loi: Loi;
  keywords: string[];
  loi_code: string;
  _formatted?: Record<string, unknown>;
  _rankingScore?: number;
  
}
// Définir la structure de la réponse de l'API pour les catégories de loi


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

// Type pour les objets imbriqués dans le dossier détaillé (similaire à votre Choice)
export interface DossierNestedEntity extends ApiItem {
  code: string;
  designation: string;
  description?: string;
}
export interface LoiCategory {
    code: string;
    designation: string;
    description: string;
}


export interface LoiCategoryApiResponse {
    member: Array<{
        code: string;
        designation: string;
        description: string;
    }>;
    "@context": string;
    "@id": string;
    "@type": string;
    totalItems: number;
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

// L'interface **NewDossierData**
export interface NewDossierData {
  objet: string;
  matiere: string;
  description?: string;
  objectif?: string;
  faits?: string;
  resume?: string;
  preuves?: string;
  pointFort?: string;
  pointFaible?: string;
  juridiction: string;
  chambreJuridique: string;
  solutionJuridique: string;
  strategy: string;
  stylePlaidoirie: string;
  keywords?: string[];
  contextualTerms?: string[];
}

// Type principal pour un dossier détaillé
export interface DossierDetails extends ApiItem {
  code: string;
  description: string;
  objectif: string;
  createdAt: string;
  objet: string;
  matiere: string;
  preuves: string;
  pointFaible: string;
  pointFort: string;
  stylePlaidoirie: DossierNestedEntity;
  keywords: string[];
  contextualTerms: string[];
  resume: string;
  faits: string;
  generated: boolean;

  chambreJuridique: DossierNestedEntity;
  solutionJuridique: DossierNestedEntity;
  strategy: DossierNestedEntity;
  juridiction: DossierNestedEntity;
  
  dossierDecisions: DossierDecision[];
  dossierLoiArticles: DossierLoiArticle[];
}


// ==============
// ✨ NOUVEAU TYPE POUR LA RECHERCHE GLOBALE ✨
// ==============
/**
 * Interface pour un résultat de recherche global, combinant avocats, décisions, lois, etc.
 * C'est le format que la fonction `globalSearch` doit renvoyer.
 */
export interface GlobalSearchResult {
  id: string; // Un identifiant unique pour l'élément (ex: code de l'avocat, code de la décision)
  title: string; // Le titre ou le nom à afficher (ex: nom de l'avocat, objet de la décision)
  type: "avocat" | "decision" | "loi" | "article"; // Le type de l'élément pour le différencier
  details?: any; // L'objet complet si vous en avez besoin plus tard
}

/**
 * Interface pour stocker les résultats de recherche regroupés par type.
 * C'est le format que le composant `GlobalSearchResults` affichera.
 */
export interface GroupedSearchResults {
    avocat: GlobalSearchResult[];
    decision: GlobalSearchResult[];
    loi: GlobalSearchResult[];
    article: GlobalSearchResult[];
    // Vous pouvez ajouter d'autres types ici si nécessaire
}

// list dossier_stratedy ....
export interface DossierStrategy {
  code: string;
  designation: string; // ou name si ta propriété est différente
}

export interface DossierStrategyApiResponse {
  "@context": string;
  "@id": string;
  "@type": string;
  // totalItems: number;
  member: DossierStrategy[];
}
