"use client";

/**
 * =====================================================
 * ÉTAPE 1 - DÉTAILS (AVEC SAUVEGARDE AUTOMATIQUE ✅)
 * + MISE EN ÉVIDENCE POINTS FORTS/FAIBLES
 * + INITIALISATION CORRECTE DES VALEURS
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DossierDetails } from '@/types';
import { 
  fetchJuridictions, 
  fetchChambresJuridiques, 
  fetchDossierStrategies,
  updateDossierFields
} from '@/services/client-api';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import EditableFieldSelect from '../editable-fields/EditableFieldSelect';
import EditableTextField from '../editable-fields/EditableTextField';

interface StepDetailsProps {
  dossier: DossierDetails;
}

interface SelectOption {
  code: string;
  designation: string;
}

interface RootState {
  auth: {
    token: string | null;
    isAuthenticated: boolean;
  };
}

export default function StepDetails({ dossier }: StepDetailsProps) {
  const reduxToken = useSelector((state: RootState) => state.auth?.token);

  const [selectedJuridiction, setSelectedJuridiction] = useState('');
  const [selectedChambre, setSelectedChambre] = useState('');
  const [selectedSolution, setSelectedSolution] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('');

  const [objet, setObjet] = useState('');
  const [matiere, setMatiere] = useState('');
  const [resume, setResume] = useState('');
  const [objectif, setObjectif] = useState('');
  const [faits, setFaits] = useState('');
  const [preuves, setPreuves] = useState('');
  const [pointFort, setPointFort] = useState('');
  const [pointFaible, setPointFaible] = useState('');

  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [juridictions, setJuridictions] = useState<SelectOption[]>([]);
  const [chambres, setChambres] = useState<SelectOption[]>([]);
  const [solutions, setSolutions] = useState<SelectOption[]>([]);
  const [styles, setStyles] = useState<SelectOption[]>([]);
  const [strategies, setStrategies] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (dossier) {
      console.log('🔍 Initialisation depuis dossier:', {
        stylePlaidoirie: dossier.stylePlaidoirie,
        solutionJuridique: dossier.solutionJuridique,
      });

      setSelectedJuridiction(dossier.juridiction?.code || '');
      setSelectedChambre(dossier.chambreJuridique?.code || '');
      setSelectedSolution(dossier.solutionJuridique?.code || '');
      setSelectedStyle(dossier.stylePlaidoirie?.code || '');
      setSelectedStrategy(dossier.strategy?.code || '');
      
      setObjet(dossier.objet || '');
      setMatiere(dossier.matiere || '');
      setResume(dossier.resume || '');
      setObjectif(dossier.objectif || '');
      setFaits(dossier.faits || '');
      setPreuves(dossier.preuves || '');
      setPointFort(dossier.pointFort || '');
      setPointFaible(dossier.pointFaible || '');
    }
  }, [dossier]);

  useEffect(() => {
    fetchAllOptions();
  }, []);

  const fetchAllOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Juridictions
      try {
        const juridictionsResponse = await fetchJuridictions('', 100, 1);
        let juridictionsData: SelectOption[] = [];
        if ((juridictionsResponse as any).member?.length > 0) {
          juridictionsData = (juridictionsResponse as any).member.map((j: any) => ({
            code: j.code,
            designation: j.designation,
          }));
        } else if ((juridictionsResponse as any)['hydra:member']?.length > 0) {
          juridictionsData = (juridictionsResponse as any)['hydra:member'].map((j: any) => ({
            code: j.code,
            designation: j.designation,
          }));
        } else if (Array.isArray(juridictionsResponse)) {
          juridictionsData = juridictionsResponse.map((j: any) => ({
            code: j.code,
            designation: j.designation,
          }));
        }
        setJuridictions(juridictionsData);
      } catch (err) {
        console.error('Erreur juridictions:', err);
        setJuridictions([]);
      }

      // Fetch Chambres juridiques
      try {
        const chambresResponse = await fetchChambresJuridiques();
        let chambresData: SelectOption[] = [];
        if (Array.isArray(chambresResponse)) {
          chambresData = chambresResponse.map((c: any) => ({
            code: c.code,
            designation: c.designation,
          }));
        } else if ((chambresResponse as any)['hydra:member']?.length > 0) {
          chambresData = (chambresResponse as any)['hydra:member'].map((c: any) => ({
            code: c.code,
            designation: c.designation,
          }));
        }
        setChambres(chambresData);
      } catch (err) {
        console.error('Erreur chambres:', err);
        setChambres([]);
      }

      // Fetch Stratégies
      try {
        const strategiesResponse = await fetchDossierStrategies();
        let strategiesData: SelectOption[] = [];
        if ((strategiesResponse as any).member?.length > 0) {
          strategiesData = (strategiesResponse as any).member.map((s: any) => ({
            code: s.code,
            designation: s.designation,
          }));
        } else if ((strategiesResponse as any)['hydra:member']?.length > 0) {
          strategiesData = (strategiesResponse as any)['hydra:member'].map((s: any) => ({
            code: s.code,
            designation: s.designation,
          }));
        } else if (Array.isArray(strategiesResponse)) {
          strategiesData = strategiesResponse.map((s: any) => ({
            code: s.code,
            designation: s.designation,
          }));
        }
        setStrategies(strategiesData);
      } catch (err) {
        console.error('Erreur stratégies:', err);
        setStrategies([]);
      }

      setSolutions([
        { code: 'REJ', designation: 'Rejet' },
        { code: 'CAS', designation: 'Cassation' },
        { code: 'CONF', designation: 'Confirmation' },
        { code: 'ANN', designation: 'Annulation' },
        { code: 'MOD', designation: 'Modification' },
        { code: 'APP', designation: 'Approbation' },
        { code: 'INJ', designation: 'Injonction' },
        { code: 'REN', designation: 'Renvoi' },
        { code: 'IRC', designation: 'Irrecevable' },
        { code: 'RES', designation: 'Résolution' },
        { code: 'NULI', designation: 'Nullité' },
        { code: 'REG', designation: 'Régularisation' },
        { code: 'SUSP', designation: 'Suspension' },
        { code: 'COND', designation: 'Condamnation' },
        { code: 'IND', designation: 'Indemnisation' },
      ]);

      setStyles([
        { code: 'TECH', designation: 'Technique' },
        { code: 'EMO', designation: 'Émotionnel' },
        { code: 'SYN', designation: 'Synthétique' },
        { code: 'CON', designation: 'Contradictoire' },
        { code: 'NAR', designation: 'Narratif' },
        { code: 'VAL', designation: 'Éthique / Valeurs' },
        { code: 'DID', designation: 'Didactique' },
      ]);

      console.log('✅ Toutes les options chargées');
    } catch (err: any) {
      console.error('Erreur chargement options:', err);
      setError('Impossible de charger certaines options.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FONCTION DE SAUVEGARDE AUTOMATIQUE
  const handleFieldSave = async (fieldName: string, newValue: string) => {
    try {
      setSaving(true);
      setError(null);
      
      const dossierCode = (dossier as any).code;
      const payload: any = {};
      
      // Construire le payload selon le champ modifié
      if (fieldName === 'juridiction') payload.juridictionCode = newValue;
      if (fieldName === 'chambre') payload.chambreJuridiqueCode = newValue;
      if (fieldName === 'solution') payload.solutionJuridiqueCode = newValue;
      if (fieldName === 'style') payload.stylePlaidoirieCode = newValue;
      if (fieldName === 'strategy') payload.strategyCode = newValue;
      if (fieldName === 'objet') payload.objet = newValue;
      if (fieldName === 'matiere') payload.matiere = newValue;
      if (fieldName === 'resume') payload.resume = newValue;
      if (fieldName === 'objectif') payload.objectif = newValue;
      if (fieldName === 'faits') payload.faits = newValue;
      if (fieldName === 'preuves') payload.preuves = newValue;
      if (fieldName === 'pointFort') payload.pointFort = newValue;
      if (fieldName === 'pointFaible') payload.pointFaible = newValue;
      
      console.log('💾 Sauvegarde automatique:', { fieldName, newValue, payload });
      
      // Appel API
      await updateDossierFields(dossierCode, payload);
      
      console.log('✅ Champ sauvegardé automatiquement');
      setSuccessMessage(`✅ Modification sauvegardée !`);
      
      // Effacer le message après 2 secondes
      setTimeout(() => setSuccessMessage(null), 2000);
      
    } catch (err: any) {
      console.error('❌ Erreur sauvegarde automatique:', err);
      setError(`Erreur : ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleStateChange = (fieldName: string, newValue: string) => {
    if (fieldName === 'juridiction') setSelectedJuridiction(newValue);
    if (fieldName === 'chambre') setSelectedChambre(newValue);
    if (fieldName === 'solution') setSelectedSolution(newValue);
    if (fieldName === 'style') setSelectedStyle(newValue);
    if (fieldName === 'strategy') setSelectedStrategy(newValue);
    if (fieldName === 'objet') setObjet(newValue);
    if (fieldName === 'matiere') setMatiere(newValue);
    if (fieldName === 'resume') setResume(newValue);
    if (fieldName === 'objectif') setObjectif(newValue);
    if (fieldName === 'faits') setFaits(newValue);
    if (fieldName === 'preuves') setPreuves(newValue);
    if (fieldName === 'pointFort') setPointFort(newValue);
    if (fieldName === 'pointFaible') setPointFaible(newValue);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-600">Chargement des options...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          1. Révision des Détails du Dossier
        </h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Description initiale
        </label>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-900 leading-relaxed">
            {dossier.description || 'Non disponible'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {juridictions.length > 0 ? (
          <EditableFieldSelect 
            label="Juridiction" 
            fieldName="juridiction"
            value={selectedJuridiction}
            options={juridictions}
            isEditing={editingField === 'juridiction'}
            saving={false}
            onEdit={setEditingField}
            onClose={() => setEditingField(null)}
            onStateChange={handleStateChange}
            onSave={handleFieldSave}
          />
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Juridiction
            </label>
            <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-700">{dossier.juridiction?.designation || 'Non définie'}</p>
            </div>
          </div>
        )}

        {chambres.length > 0 ? (
          <EditableFieldSelect 
            label="Chambre juridique" 
            fieldName="chambre"
            value={selectedChambre}
            options={chambres}
            isEditing={editingField === 'chambre'}
            saving={false}
            onEdit={setEditingField}
            onClose={() => setEditingField(null)}
            onStateChange={handleStateChange}
            onSave={handleFieldSave}
          />
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Chambre juridique
            </label>
            <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-700">{dossier.chambreJuridique?.designation || 'Non définie'}</p>
            </div>
          </div>
        )}

        <EditableFieldSelect 
          label="Solution Souhaitée" 
          fieldName="solution"
          value={selectedSolution}
          options={solutions}
          isEditing={editingField === 'solution'}
          saving={false}
          onEdit={setEditingField}
          onClose={() => setEditingField(null)}
          onStateChange={handleStateChange}
          onSave={handleFieldSave}
        />

        <EditableFieldSelect 
          label="Style de plaidoirie suggéré" 
          fieldName="style"
          value={selectedStyle}
          options={styles}
          isEditing={editingField === 'style'}
          saving={false}
          onEdit={setEditingField}
          onClose={() => setEditingField(null)}
          onStateChange={handleStateChange}
          onSave={handleFieldSave}
        />
      </div>

      {strategies.length > 0 ? (
        <EditableFieldSelect 
          label="Stratégie proposée" 
          fieldName="strategy"
          value={selectedStrategy}
          options={strategies}
          isEditing={editingField === 'strategy'}
          saving={false}
          onEdit={setEditingField}
          onClose={() => setEditingField(null)}
          onStateChange={handleStateChange}
          onSave={handleFieldSave}
        />
      ) : (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Stratégie proposée
          </label>
          <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
            <p className="text-sm text-gray-700">{dossier.strategy?.designation || 'Non définie'}</p>
          </div>
        </div>
      )}

      <EditableTextField 
        label="Objet" 
        fieldName="objet"
        value={objet}
        isEditing={editingField === 'objet'}
        saving={false}
        onEdit={setEditingField}
        onClose={() => setEditingField(null)}
        onStateChange={handleStateChange}
        onSave={handleFieldSave}
      />

      <EditableTextField 
        label="Matière" 
        fieldName="matiere"
        value={matiere}
        isEditing={editingField === 'matiere'}
        saving={false}
        onEdit={setEditingField}
        onClose={() => setEditingField(null)}
        onStateChange={handleStateChange}
        onSave={handleFieldSave}
      />

      <EditableTextField 
        label="Résumé" 
        fieldName="resume"
        value={resume}
        multiline
        isEditing={editingField === 'resume'}
        saving={false}
        onEdit={setEditingField}
        onClose={() => setEditingField(null)}
        onStateChange={handleStateChange}
        onSave={handleFieldSave}
      />

      <EditableTextField 
        label="Objectif" 
        fieldName="objectif"
        value={objectif}
        multiline
        isEditing={editingField === 'objectif'}
        saving={false}
        onEdit={setEditingField}
        onClose={() => setEditingField(null)}
        onStateChange={handleStateChange}
        onSave={handleFieldSave}
      />

      <EditableTextField 
        label="Faits et dates pertinents" 
        fieldName="faits"
        value={faits}
        multiline
        isEditing={editingField === 'faits'}
        saving={false}
        onEdit={setEditingField}
        onClose={() => setEditingField(null)}
        onStateChange={handleStateChange}
        onSave={handleFieldSave}
      />

      <EditableTextField 
        label="Preuves" 
        fieldName="preuves"
        value={preuves}
        multiline
        isEditing={editingField === 'preuves'}
        saving={false}
        onEdit={setEditingField}
        onClose={() => setEditingField(null)}
        onStateChange={handleStateChange}
        onSave={handleFieldSave}
      />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <label className="block text-xs font-semibold text-green-700 uppercase tracking-wider">
              Points Forts
            </label>
          </div>
          <div className="border-2 border-green-500 rounded-lg p-1 bg-green-50">
            <EditableTextField 
              label="" 
              fieldName="pointFort"
              value={pointFort}
              multiline
              isEditing={editingField === 'pointFort'}
              saving={false}
              onEdit={setEditingField}
              onClose={() => setEditingField(null)}
              onStateChange={handleStateChange}
              onSave={handleFieldSave}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <label className="block text-xs font-semibold text-red-700 uppercase tracking-wider">
              Points Faibles
            </label>
          </div>
          <div className="border-2 border-red-500 rounded-lg p-1 bg-red-50">
            <EditableTextField 
              label="" 
              fieldName="pointFaible"
              value={pointFaible}
              multiline
              isEditing={editingField === 'pointFaible'}
              saving={false}
              onEdit={setEditingField}
              onClose={() => setEditingField(null)}
              onStateChange={handleStateChange}
              onSave={handleFieldSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
