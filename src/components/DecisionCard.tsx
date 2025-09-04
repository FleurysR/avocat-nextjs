// import { Decision } from "@/types";

// export function DecisionCard({ decision }: { decision: Decision }) {
//   return (
//     <li className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border hover:border-indigo-500 transition-all transform hover:scale-105">
//       <h2 className="font-semibold text-lg text-indigo-700 dark:text-indigo-400 mb-2">
//         {decision.numeroDossier} - {decision.objet}
//       </h2>

//       <p className="text-gray-600 dark:text-gray-300 mb-1">
//         Président : {decision.presidentChambre}
//       </p>

//       <p className="text-gray-600 dark:text-gray-300 mb-1">
//         Date : {new Date(decision.decisionAt).toLocaleDateString()}
//       </p>

//       {/* 👉 Ajout Avocat Demandeur si dispo */}
//       {decision.avocatDemandeur && (
//         <p className="text-gray-600 dark:text-gray-300 mb-1">
//           Avocat demandeur : {decision.avocatDemandeur}
//         </p>
//       )}

//       {/* 👉 Ajout Avocat Défenseur si dispo */}
//       {decision.avocatDefenseur && (
//         <p className="text-gray-600 dark:text-gray-300 mb-1">
//           Avocat défenseur : {decision.avocatDefenseur}
//         </p>
//       )}
//     </li>
//   );
// }
