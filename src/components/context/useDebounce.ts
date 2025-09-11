import { useState, useEffect } from 'react';

/**
 * Crée une valeur déBouncée qui ne change que si la valeur source
 * ne change pas pendant un certain délai. Utile pour les recherches en direct.
 *
 * @param value La valeur à déBouncer.
 * @param delay Le délai en millisecondes pour le déBouncing.
 * @returns La valeur déBouncée.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Met à jour la valeur déBouncée après le délai.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Annule le timer si la valeur change ou si le composant est démonté.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
