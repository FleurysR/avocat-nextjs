"use client";

/**
 * =====================================================
 * EDITABLE FIELD SELECT (MODAL CLAIR - COMME LA PAGE)
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/components/editable-fields/EditableFieldSelect.tsx
 * 
 * ✅ Modal CLAIR et blanc (pas sombre)
 * ✅ Fond semi-transparent léger
 * ✅ Radio buttons en couleurs claires
 * ✅ Harmonisé avec votre page
 */

import React from 'react';
import { Edit2, X } from 'lucide-react';

interface SelectOption {
  code: string;
  designation: string;
}

interface EditableFieldSelectProps {
  label: string;
  fieldName: string;
  value: string;
  options: SelectOption[];
  isEditing: boolean;
  saving: boolean;
  onEdit: (fieldName: string) => void;
  onClose: () => void;
  onSave?: (fieldName: string, newValue: string) => void;
  onStateChange: (fieldName: string, newValue: string) => void;
  disableAutoSave?: boolean;
}

export default function EditableFieldSelect({
  label,
  fieldName,
  value,
  options,
  isEditing,
  saving,
  onEdit,
  onClose,
  onSave,
  onStateChange,
  disableAutoSave = false
}: EditableFieldSelectProps) {
  const selectedOption = options.find(opt => opt.code === value);
  const displayValue = selectedOption?.designation || 'Non sélectionné';

  const handleChange = (newValue: string) => {
    console.log(`✅ Changement IMMÉDIAT: ${fieldName} = ${newValue}`);
    
    // 1. Mettre à jour l'état
    onStateChange(fieldName, newValue);
    
    // 2. Sauvegarder si autoSave activé
    if (!disableAutoSave && onSave) {
      onSave(fieldName, newValue);
    }
    
    // 3. Fermer le modal
    onClose();
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
      </label>

      {/* Affichage normal (non édition) */}
      {!isEditing && (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 hover:border-blue-400 transition-all hover:shadow-sm cursor-pointer">
          <span className="text-sm font-medium text-gray-900">{displayValue}</span>
          <button
            onClick={() => onEdit(fieldName)}
            disabled={saving}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal - CLAIR ET BLANC */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[75vh] flex flex-col border border-gray-200">
            {/* Header Modal - CLAIR */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white via-blue-50 to-white">
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                Sélectionner {label.toLowerCase()}
              </h2>
              <p className="text-xs text-gray-500 mt-2">Cliquez sur une option pour la sélectionner</p>
            </div>

            {/* Contenu - Radio Buttons CLAIRS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {options.map((option) => {
                const isSelected = value === option.code;
                return (
                  <button
                    key={option.code}
                    onClick={() => handleChange(option.code)}
                    disabled={saving}
                    className={`
                      w-full flex items-center p-4 rounded-lg border-2 cursor-pointer
                      transition-all duration-150 text-left
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-white'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {/* Radio Button */}
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        flex-shrink-0 transition-colors
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-400 bg-white'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Texte */}
                    <span className={`
                      ml-3 text-sm font-medium transition-colors
                      ${isSelected ? 'text-blue-900' : 'text-gray-800'}
                    `}>
                      {option.designation}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Modal - CLAIR */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={onClose}
                disabled={saving}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
