import React from "react";

export function highlightText(text: string, searchTerm: string) {
  if (!searchTerm || !text) return text;

  // Échapper les caractères spéciaux du regex
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="bg-yellow-200 dark:bg-yellow-600 font-semibold px-1 rounded"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}
