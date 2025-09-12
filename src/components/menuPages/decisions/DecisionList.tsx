import { Decision } from "@/types";
import { DecisionCard } from "./DecisionCard";
import { DecisionTable } from "./DecisionTable";

interface DecisionListProps {
  decisions: Decision[];
  viewMode: "card" | "table";
  onSelect: (code: string) => void;
  searchTerm: string;
}

export function DecisionList({ decisions, viewMode, onSelect, searchTerm }: DecisionListProps) {
  if (viewMode === "card") {
    return (
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {decisions.map((decision) => (
          <DecisionCard
            key={decision.code}
            decision={decision}
            onSelect={() => onSelect(decision.code)}
            searchTerm={searchTerm}
          />
        ))}
      </ul>
    );
  }

  return (
    <DecisionTable
      decisions={decisions}
      onSelect={onSelect}
      searchTerm={searchTerm}
    />
  );
}