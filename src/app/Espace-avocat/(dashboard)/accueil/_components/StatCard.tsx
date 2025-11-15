import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
    <div className={`p-3 bg-opacity-10 rounded-lg ${color.replace('text-', 'bg-')}`}>
        <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);
