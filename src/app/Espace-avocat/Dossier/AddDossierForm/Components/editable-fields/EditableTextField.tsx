"use client";

/**
 * =====================================================
 * EDITABLE TEXT FIELD (AVEC SAUVEGARDE AUTO ✅)
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

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

  // ✅ Réinitialiser tempValue quand value change
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    // Si la valeur n'a pas changé, juste fermer
    if (tempValue === value) {
      onClose();
      return;
    }

    console.log(`💾 Sauvegarde: ${fieldName} = ${tempValue}`);
    
    // Mettre à jour l'état
    onStateChange(fieldName, tempValue);
    
    // Sauvegarder automatiquement si activé
    if (!disableAutoSave && onSave) {
      onSave(fieldName, tempValue);
    }
    
    onClose();
  };

  const handleCancel = () => {
    setTempValue(value);
    onClose();
  };

  // ✅ Sauvegarder quand on appuie sur Enter (pour input simple)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {label}
        </label>
      )}

      {isEditing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={saving}
              autoFocus
              className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 disabled:opacity-50 min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={saving}
              autoFocus
              className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 disabled:opacity-50"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Sauvegarder
            </button>
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
