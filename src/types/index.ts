// src/types/index.ts

// Types généraux pour l’application
export interface Choice {
  code: string;
  designation: string;
  description?: string;
}

// Décision simple
export interface Decision {
  code: string;                  // Identifiant unique de la décision
  decisionAt: string;            // Date de la décision
  numeroDossier: string;         // Numéro du dossier
  objet: string;                 // Objet de la décision
  avocatDemandeur: string | null;
  avocatDefenseur: string | null;
  presidentChambre: string;
  _rankingScore: number;         // Score de pertinence
}

// Réponse de l’API pour la liste des décisions
export interface DecisionsApiResponse {
  hits: Decision[];
  query: string;
  processingTimeMs: number;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
}

// Détails complets d’une décision
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
  formationJudiciaire: any; 
  chambre: Choice;
  articleUtilises: any[];
  avocatDemandeur: string | null;
  avocatDefendeur: string | null;
  presidentChambre: string;
  anonymousContent: string;
  contextualTerms: string[];
}

// Type pour un dossier si tu veux lier les décisions
export interface DossierDecision {
  decision: Decision;
  scorePertinence: number;
}
