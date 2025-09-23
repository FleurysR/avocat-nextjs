// src/components/DetailItem.tsx
"use client";

interface DetailItemProps {
  label: string;
  value: string | number | null | undefined;
}

export default function DetailItem({ label, value }: DetailItemProps) {
  const displayValue = value === null || value === undefined || value === '' ? '-' : value;

  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <strong className="text-gray-600 dark:text-gray-400 font-medium">{label}:</strong>
      <span className="text-gray-900 dark:text-gray-50 truncate">{displayValue}</span>
    </li>
  );
}