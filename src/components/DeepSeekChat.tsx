"use client"; // Indique à Next.js que ce composant est un composant client (utilisant le state, les hooks, etc.)

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

// Définit le type pour un message, avec son rôle et son contenu
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Composant principal de la conversation
export default function DeepSeekChat() {
  // État pour stocker la liste des messages dans la conversation
  const [messages, setMessages] = useState<Message[]>([]);
  // État pour stocker la valeur actuelle de l'input utilisateur
  const [input, setInput] = useState("");
  // État pour indiquer si une requête est en cours (pour désactiver le bouton)
  const [loading, setLoading] = useState(false);
  // État pour stocker un message d'erreur si la requête échoue
  const [error, setError] = useState("");

  // Fonction asynchrone pour envoyer le message à l'API
  const sendMessage = async () => {
    // Ne fait rien si l'input est vide
    if (!input.trim()) return;

    // Crée une nouvelle liste de messages en ajoutant le message de l'utilisateur
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    // Met à jour l'état des messages
    setMessages(newMessages);
    // Vide l'input
    setInput("");
    // Active l'état de chargement
    setLoading(true);
    // Réinitialise l'erreur
    setError("");

    try {
      // Envoie une requête POST à la route /api/deepseek
      const res = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Envoie les messages actuels au format JSON
        body: JSON.stringify({ messages: newMessages }),
      });

      // Analyse la réponse JSON de l'API
      const data = await res.json();

      // Si la réponse n'est pas OK, lance une erreur
      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      // Met à jour l'état en ajoutant le message de l'assistant
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err: any) {
      // Attrape l'erreur et met à jour l'état de l'erreur
      setError(err.message || "Impossible de contacter DeepSeek");
    } finally {
      // Désactive l'état de chargement, que la requête ait réussi ou non
      setLoading(false);
    }
  };

  return (
    // Conteneur principal du chatbot avec des classes Tailwind CSS
    <Card className="w-full max-w-9xl mx-auto bg-gray-900 text-white border-gray-700 mt-9">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">🤖 Chatbot DeepSeek</h2>

        {/* Zone de défilement pour les messages */}
        <ScrollArea className="h-96 p-9 border border-gray-700 rounded-lg bg-gray-800">
          <AnimatePresence>
            {/* Mappe sur la liste des messages pour les afficher */}
            {messages.map((msg, idx) => (
              // Utilise motion.div pour les animations d'entrée/sortie
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }} // Animation d'entrée
                animate={{ opacity: 1, x: 0 }} // Animation pendant le rendu
                exit={{ opacity: 0 }} // Animation de sortie
                transition={{ duration: 0.3 }}
                className={`my-2 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`} // Aligne le message à droite ou à gauche
              >
                {/* Conteneur du message avec style conditionnel */}
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Affiche un message de chargement si 'loading' est vrai */}
          {loading && (
            <p className="text-gray-400 italic mt-2">DeepSeek réfléchit...</p>
          )}
        </ScrollArea>

        {/* Affiche l'erreur si 'error' n'est pas vide */}
        {error && (
          <p className="mt-2 p-2 bg-red-600 text-white rounded">{error}</p>
        )}

        {/* Champ d'entrée et bouton d'envoi */}
        <div className="flex mt-4 space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)} // Met à jour l'état de l'input à chaque frappe
            placeholder="Pose ta question juridique..."
            className="flex-1 bg-gray-800 border-gray-700 text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Envoie le message en appuyant sur Entrée
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Envoyer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
