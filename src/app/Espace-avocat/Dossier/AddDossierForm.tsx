// // src/app/Espace-avocat/Dossier/AddDossierForm.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { 
//     createDossier, 
//     fetchJuridictions, 
//     fetchChambresJuridiques 
// } from "@/services/client-api";
// import { 
//     NewDossierData, 
//     Juridiction, 
//     ChambreJuridique 
// } from "@/types";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Spinner } from "@/components/ui/shadcn-io/spinner";

// export default function AddDossierForm() {
//     // États pour les listes déroulantes
//     const [juridictions, setJuridictions] = useState<Juridiction[]>([]);
//     const [chambresJuridiques, setChambresJuridiques] = useState<ChambreJuridique[]>([]);
//     const [loadingData, setLoadingData] = useState(true);

//     // État du formulaire
//     const [formData, setFormData] = useState<NewDossierData>({
//         objet: "",
//         matiere: "",
//         juridiction: "",
//         chambreJuridique: "",
//         description: "",
//         objectif: "",
//         faits: "",
//         resume: "",
//         preuves: "",
//         pointFort: "",
//         pointFaible: "",
//         strategy: "",
//         stylePlaidoirie: "",
//         solutionJuridique: "",
//     });
//     const [loading, setLoading] = useState(false);

//     // Effet pour charger les données des listes déroulantes au montage du composant
//     useEffect(() => {
//         const loadFormData = async () => {
//             try {
//                 // Noms de fonctions corrigés
//                 const juridictionsResponse = await fetchJuridictions();
//                 const chambresResponse = await fetchChambresJuridiques();

//                 // L'API renvoie un objet avec une propriété 'member', il faut extraire les données
//                 setJuridictions(juridictionsResponse.member);
//                 // Note: La fonction `fetchChambresJuridiques` peut renvoyer soit un tableau, soit un objet avec `member`.
//                 // Assurez-vous que le type de réponse est correct, si c'est un tableau, enlevez `.member`.
//                 setChambresJuridiques(chambresResponse.member || chambresResponse);
//             } catch (error) {
//                 toast.error("Impossible de charger les données du formulaire.");
//             } finally {
//                 setLoadingData(false);
//             }
//         };

//         loadFormData();
//     }, []);

//     // Gestionnaire pour les champs de texte
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };
    
//     // Gestionnaire pour les listes déroulantes (Select)
//     const handleSelectChange = (name: keyof NewDossierData, value: string) => {
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     // Gestionnaire de soumission du formulaire
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             await createDossier(formData);
//             toast.success(`Le dossier "${formData.objet}" a été créé avec succès !`);
//             // Réinitialiser le formulaire
//             setFormData({
//                 objet: "", matiere: "", juridiction: "", chambreJuridique: "", description: "",
//                 objectif: "", faits: "", resume: "", preuves: "", pointFort: "", pointFaible: "",
//                 strategy: "", stylePlaidoirie: "", solutionJuridique: ""
//             });
//         } catch (err) {
//             toast.error("Échec de la création du dossier.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Afficher un spinner pendant le chargement initial des données
//     if (loadingData) {
//         return (
//             <div className="flex items-center justify-center h-[50vh]">
//                 <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
//                 <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des options...</span>
//             </div>
//         );
//     }

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow-xl">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">Ajouter un nouveau dossier</h2>

//             <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="objet">Objet du dossier</Label>
//                         <Input id="objet" name="objet" value={formData.objet} onChange={handleChange} required />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="matiere">Matière juridique</Label>
//                         <Input id="matiere" name="matiere" value={formData.matiere} onChange={handleChange} required />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="juridiction">Juridiction</Label>
//                         <Select onValueChange={(value) => handleSelectChange('juridiction', value)} value={formData.juridiction}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Sélectionner une juridiction" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {juridictions.map((jur) => (
//                                     <SelectItem key={jur.code} value={jur.code}>{jur.designation}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="chambreJuridique">Chambre Juridique</Label>
//                         <Select onValueChange={(value) => handleSelectChange('chambreJuridique', value)} value={formData.chambreJuridique}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Sélectionner une chambre" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {chambresJuridiques.map((chambre) => (
//                                     <SelectItem key={chambre.code} value={chambre.code}>{chambre.designation}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>
//             </div>

//             <div className="space-y-4">
//                 <div className="space-y-2">
//                     <Label htmlFor="faits">Faits</Label>
//                     <Textarea id="faits" name="faits" value={formData.faits} onChange={handleChange} />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="resume">Résumé</Label>
//                     <Textarea id="resume" name="resume" value={formData.resume} onChange={handleChange} />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="objectif">Objectif</Label>
//                     <Textarea id="objectif" name="objectif" value={formData.objectif} onChange={handleChange} />
//                 </div>
//             </div>

//             <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={loading}>
//                 {loading ? 'Création en cours...' : 'Créer le dossier'}
//             </Button>
//         </form>
//     );
// }