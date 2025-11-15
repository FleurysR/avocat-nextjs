"use client";

/**
 * =====================================================
 * EDITABLE TEXT FIELD (SANS SAUVEGARDE AUTO)
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/components/editable-fields/EditableTextField.tsx
 * 
 * ✅ NOUVEAU: Prop disableAutoSave
 * ✅ La sauvegarde se fait manuellement depuis StepDetails
 */

import React, { useState } from 'react';
import { Edit2, X } from 'lucide-react';

interface EditableTextFieldProps {
  label: string;
  fieldName: string;
  value: string;
  isEditing: boolean;
  saving: boolean;
  multiline?: boolean;
  onEdit: (fieldName: string) => void;
  onClose: () => void;
  onSave?: (fieldName: string, newValue: string) => void;
  onStateChange: (fieldName: string, newValue: string) => void;
  disableAutoSave?: boolean;
}

export default function EditableTextField({
  label,
  fieldName,
  value,
  isEditing,
  saving,
  multiline = false,
  onEdit,
  onClose,
  onSave,
  onStateChange,
  disableAutoSave = false
}: EditableTextFieldProps) {
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onStateChange(fieldName, tempValue);
    
    // ✅ NOUVEAU: Ne sauvegarder que si disableAutoSave = false
    if (!disableAutoSave && onSave) {
      onSave(fieldName, tempValue);
    }
    onClose();
  };

  const handleCancel = () => {
    setTempValue(value);
    onClose();
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
      </label>

      {isEditing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 disabled:opacity-50 min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 disabled:opacity-50"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
          <span className={`text-sm ${multiline ? 'line-clamp-2' : ''} text-gray-900`}>
            {value || 'Cliquez pour éditer'}
          </span>
          <button
            onClick={() => {
              setTempValue(value);
              onEdit(fieldName);
            }}
            disabled={saving}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
