// src/components/menuPages/loi/loisCategoriesCard.jsx

"use client";

import React from 'react';
import { useLoiCategories } from '@/hooks/Lois/useLoisCategories';

const LoisCategoriesList = () => {
  const { categories, loading, error } = useLoiCategories();

  if (loading) {
    return <p>Chargement des catégories...</p>;
  }

  if (error) {
    return <p>Erreur lors du chargement des catégories.</p>;
  }
  return (
    <div style={{ padding: '20px' }}>
      <h2>Catégories de Lois</h2>
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
      }}>
        {categories.map((category) => (
          <div key={category.code} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '16px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h3>{category.designation}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LoisCategoriesList;