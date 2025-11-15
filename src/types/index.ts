// src/types/index.ts

// =================================================================
// SECTION 1: TYPES GÉNÉRIQUES (API Platform & Utilitaires)
// =================================================================

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

// =================================================================
// SECTION 2: DÉCISIONS
// =================================================================

/**
 * Représente une Décision dans une liste (résultat de recherche MeiliSearch).
 */
export interface Decision {
  code: string;
  objet?: string;
  avocatDemandeur?: string;
  avocatDefendeur?: string;
  decisionAt?: string;
  numeroDossier?: string;
  _rankingScore?: number;
}

/**
 * Représente les détails complets d'une Décision. C'est le type unifié.
 */
export interface DetailedDecision {
  id?: number;
  code: string;
  objet?: string;
  numero?: string;
  numeroDossier?: string;
  decisionAt?: string;
  principeJuridique?: string;
  anonymousContent?: string;
  realContent?: string;
  keywords?: string[];
  contextualTerms?: string[];
  matiere?: string;
  presidentChambre?: string;
  nomDemandeur?: string;
  nomDefendeur?: string;
  avocatDemandeur?: string;
  avocatDefendeur?: string;
  isSolutionTotal?: boolean;
  
  // Relations avec des objets imbriqués
  juridiction?: Choice;
  chambre?: Choice;
  formationJudiciaire?: Choice;
  solution?: Choice;
  nature?: Choice; // Ajouté pour la cohérence
}

/**
 * Filtres applicables lors de la recherche de décisions.
 */
export interface DecisionsFilters {
  solution_code?: string;
  nature_code?: string;
  juridiction_code?: string;
  numero?: string;
  numeroDossier?: string;
  avocatDemandeur?: string;
  dossier?: string;
  date_min?: string; 
  date_max?: string;
  chambreCode?: string;
}

/**
 * Réponse de l'API MeiliSearch pour les décisions.
 */
export interface DecisionsApiResponse {
  hits: Decision[];
  query: string;
  processingTimeMs: number;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
}

// =================================================================
// SECTION 3: DOSSIERS
// =================================================================

/**
 * Représente un Dossier dans une liste.
 */
export interface Dossier {
  code: string;
  createdAt: string;
  objet: string;
  description?: string;
  resume?: string;
}

/**
 * Représente un objet imbriqué dans les détails d'un dossier.
 */
export interface DossierNestedEntity extends ApiItem {
  code: string;
  designation: string;
  description?: string;
}

/**
 * Représente une décision associée à un dossier.
 */
export interface DossierDecision {
  "@context": string;
  "@id": string;
  "@type": string;
  decision: Decision;
  scorePertinence: number;
}

/**
 * Représente un article de loi associé à un dossier.
 */
export interface DossierLoiArticle {
  "@context": string;
  "@id": string;
  "@type": string;
  loiArticle: LoiArticle;
  scorePertinence: number;
  formattedContent: string;
}

/**
 * Représente les détails complets d'un Dossier.
 */
export interface DossierDetails extends ApiItem {
  code: string;
  objet: string;
  description: string;
  objectif: string;
  resume: string;
  faits: string;
  preuves: string;
  pointFort: string;
  pointFaible: string;
  createdAt: string;
  matiere: string;
  generated: boolean;
  keywords: string[];
  contextualTerms: string[];
  
  stylePlaidoirie: DossierNestedEntity;
  chambreJuridique: DossierNestedEntity;
  solutionJuridique: DossierNestedEntity;
  strategy: DossierNestedEntity;
  juridiction: DossierNestedEntity;
  
  dossierDecisions: DossierDecision[];
  dossierLoiArticles: DossierLoiArticle[];
   generatedStrategy?: string;
  suggestedDecision?: Decision;
}

/**
 * Données pour la création d'un nouveau dossier.
 */

/**
 * Données pour la création d'un nouveau dossier.
 * Pour le flux IA, seule la description est initialement requise.
 */
export interface NewDossierData {
  description: string; // La seule propriété vraiment requise au début

  // Toutes les autres propriétés sont maintenant optionnelles (marquées avec "?")
  objet?: string;
  matiere?: string;
  objectif?: string;
  faits?: string;
  resume?: string;
  preuves?: string;
  pointFort?: string;
  pointFaible?: string;
  juridiction?: string;
  chambreJuridique?: string;
  solutionJuridique?: string;
  strategy?: string;
  stylePlaidoirie?: string;
  keywords?: string[];
  contextualTerms?: string[];
}
/**
 * Réponse de l'API pour une liste de dossiers.
 */
export interface DossiersApiResponse {
  data: Dossier[];
  totalCount: number;
}

// =================================================================
// SECTION 4: AVOCATS
// =================================================================

export interface StatMatiere {
  total: number;
  gagne: number;
  taux_succes_pourcentage: number;
}

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
  region: Region | string | null;
  district: District | string | null;
  commune: Commune | string | null;
}

export interface AvocatDetails extends Avocat {
  lastActivityAt: string | null;
  biographie?: string;
  specialites?: Choice[];
  ancienneteEnAnnees?: number;
  nombreDecisionsPlaidees: number;
  tauxSuccesGlobalPourcentage: number;
  tauxSuccesParMatiere: Record<string, StatMatiere>;
}

export interface AvocatsApiResponse extends ApiCollection<Avocat> {}

// =================================================================
// SECTION 5: LOIS & ARTICLES
// =================================================================

export interface Loi {
  loi_id: string;
  code: string;
  titre: string;
  version: string;
  numero: string; 
  publieAt: string;
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

export interface LoiCategory {
  code: string;
  designation: string;
  description: string;
}

export interface LoisApiResponse extends ApiCollection<Loi> {}
export interface LoiCategoryApiResponse extends ApiCollection<LoiCategory> {}

export interface LoiArticleApiResponse {
  hits: LoiArticle[];
  query: string;
  processingTimeMs: number;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
}

// =================================================================
// SECTION 6: ENTITÉS STRUCTURELLES (Géo, Juridiction...)
// =================================================================

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
  region: Region | string;
}

export interface Commune {
  "@id": string;
  "@type": "Commune";
  code: string;
  designation: string;
  district: District | string;
}

export interface Juridiction {
  code: string;
  designation: string;
  description: string;
}

export interface ChambreJuridique {
  code: string;
  designation: string;
  description: string;
}

export interface JuridictionsApiResponse extends ApiCollection<Juridiction> {}
export interface ChambresJuridiquesApiResponse extends ApiCollection<ChambreJuridique> {}

// =================================================================
// SECTION 7: RECHERCHE GLOBALE
// =================================================================

export interface GlobalSearchResult {
  id: string;
  title: string;
  type: "avocat" | "decision" | "loi" | "article";
  details?: any;
}

export interface GroupedSearchResults {
  avocat: GlobalSearchResult[];
  decision: GlobalSearchResult[];
  loi: GlobalSearchResult[];
  article: GlobalSearchResult[];
}

// RAJOUTEZ CECI DANS VOTRE FICHIER types/index.ts

export interface DossierStrategy {
  code: string;
  designation: string;
}

export interface DossierStrategyApiResponse extends ApiCollection<DossierStrategy> {}

