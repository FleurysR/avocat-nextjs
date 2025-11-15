"use client";

/**
 * =====================================================
 * ÉTAPE 1 - DÉTAILS (FIX JWT + REDUX + LOCALSTORAGE)
 * + MISE EN ÉVIDENCE POINTS FORTS/FAIBLES
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DossierDetails } from '@/types';
import { fetchJuridictions, fetchChambresJuridiques, fetchDossierStrategies } from '@/services/client-api';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, Save, TrendingUp, TrendingDown } from 'lucide-react';
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

  const [selectedJuridiction, setSelectedJuridiction] = useState(dossier.juridiction?.code || '');
  const [selectedChambre, setSelectedChambre] = useState(dossier.chambreJuridique?.code || '');
  const [selectedSolution, setSelectedSolution] = useState(dossier.solutionJuridique?.code || '');
  const [selectedStyle, setSelectedStyle] = useState(dossier.stylePlaidoirie?.code || '');
  const [selectedStrategy, setSelectedStrategy] = useState(dossier.strategy?.code || '');

  const [objet, setObjet] = useState(dossier.objet || '');
  const [matiere, setMatiere] = useState(dossier.matiere || '');
  const [resume, setResume] = useState(dossier.resume || '');
  const [objectif, setObjectif] = useState(dossier.objectif || '');
  const [faits, setFaits] = useState(dossier.faits || '');
  const [preuves, setPreuves] = useState(dossier.preuves || '');
  const [pointFort, setPointFort] = useState(dossier.pointFort || '');
  const [pointFaible, setPointFaible] = useState(dossier.pointFaible || '');

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
    fetchAllOptions();
  }, []);

  const fetchAllOptions = async () => {
    try {
      setLoading(true);
      setError(null);

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
        setJuridictions([]);
      }

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
        setChambres([]);
      }

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
        setStrategies([]);
      }

      setSolutions([
        { code: 'rejet', designation: 'Rejet' },
        { code: 'acceptation', designation: 'Acceptation' },
        { code: 'resolution', designation: 'Résolution' },
        { code: 'annulation', designation: 'Annulation' },
        { code: 'modification', designation: 'Modification' },
      ]);

      setStyles([
        { code: 'contradictoire', designation: 'Contradictoire' },
        { code: 'technique', designation: 'Technique' },
        { code: 'offensive', designation: 'Offensive directe' },
        { code: 'defense', designation: 'Défense classique' },
        { code: 'replique', designation: 'Réplique' },
      ]);

    } catch (err: any) {
      setError('Impossible de charger certaines options.');
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = (): string | null => {
    if (reduxToken) {
      console.log('✅ Token trouvé depuis Redux');
      return reduxToken;
    }
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem('jwt_token');
      if (localToken) {
        console.log('✅ Token trouvé depuis localStorage');
        return localToken;
      }
    }
    return null;
  };

  const saveAllChanges = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const dossierCode = (dossier as any).code;
      const payload: any = {};
      
      if (selectedJuridiction !== (dossier.juridiction?.code || '')) {
        payload.juridictionCode = selectedJuridiction;
      }
      if (selectedChambre !== (dossier.chambreJuridique?.code || '')) {
        payload.chambreJuridiqueCode = selectedChambre;
      }
      if (selectedSolution !== (dossier.solutionJuridique?.code || '')) {
        payload.solutionJuridiqueCode = selectedSolution;
      }
      if (selectedStyle !== (dossier.stylePlaidoirie?.code || '')) {
        payload.stylePlaidoirieCode = selectedStyle;
      }
      if (selectedStrategy !== (dossier.strategy?.code || '')) {
        payload.strategyCode = selectedStrategy;
      }
      if (objet !== (dossier.objet || '')) payload.objet = objet;
      if (matiere !== (dossier.matiere || '')) payload.matiere = matiere;
      if (resume !== (dossier.resume || '')) payload.resume = resume;
      if (objectif !== (dossier.objectif || '')) payload.objectif = objectif;
      if (faits !== (dossier.faits || '')) payload.faits = faits;
      if (preuves !== (dossier.preuves || '')) payload.preuves = preuves;
      if (pointFort !== (dossier.pointFort || '')) payload.pointFort = pointFort;
      if (pointFaible !== (dossier.pointFaible || '')) payload.pointFaible = pointFaible;

      if (Object.keys(payload).length === 0) {
        setSuccessMessage('✅ Aucune modification à sauvegarder');
        return;
      }

      const token = getAuthToken();
      if (!token) {
        setError('❌ Token d\'authentification manquant. Veuillez vous reconnecter.');
        setSaving(false);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://127.0.0.1:8000'}/api/dossiers/${dossierCode}/update-fields`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = `Erreur ${response.status}`;
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            errorMessage = responseText;
          }
        }
        throw new Error(errorMessage);
      }

      setSuccessMessage('✅ Tous les changements ont été sauvegardés avec succès !');
      setEditingField(null);
      
    } catch (err: any) {
      console.error('Erreur sauvegarde:', err);
      setError(`Erreur lors de la sauvegarde : ${err.message}`);
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
            disableAutoSave
          />
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Juridiction
            </label>
            <div className="p-3 bg-red-50 rounded-lg border border-red-300">
              <p className="text-sm text-red-700">❌ Aucune juridiction chargée</p>
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
            disableAutoSave
          />
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Chambre juridique
            </label>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-300">
              <p className="text-sm text-yellow-700">⚠️ Aucune chambre disponible</p>
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
          disableAutoSave
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
          disableAutoSave
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
          disableAutoSave
        />
      ) : (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Stratégie proposée
          </label>
          <div className="p-3 bg-red-50 rounded-lg border border-red-300">
            <p className="text-sm text-red-700">❌ Aucune stratégie chargée</p>
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
        disableAutoSave
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
        disableAutoSave
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
        disableAutoSave
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
        disableAutoSave
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
        disableAutoSave
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
        disableAutoSave
      />

      {/* ✅ POINTS FORTS ET FAIBLES AVEC MISE EN ÉVIDENCE */}
      <div className="grid grid-cols-2 gap-6">
        {/* POINTS FORTS - VERT */}
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
              disableAutoSave
            />
          </div>
        </div>

        {/* POINTS FAIBLES - ROUGE */}
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
              disableAutoSave
            />
          </div>
        </div>
      </div>
    </div>
  );
}