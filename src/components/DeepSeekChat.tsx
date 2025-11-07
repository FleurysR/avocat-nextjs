"use client"; 
import { useState, useRef, useEffect } from "react";
// Assurez-vous d'avoir les importations de vos composants shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// 🚨 Importation du composant ScrollArea
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { motion, AnimatePresence } from "framer-motion";

// Définit le type pour un message
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function DeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 1. Utilisez la ref sur l'élément racine de la ScrollArea
  const scrollAreaRef = useRef<HTMLDivElement>(null); 

  // 2. Correction de la fonction de défilement pour cibler le viewport interne
  useEffect(() => {
    if (scrollAreaRef.current) {
      // Le viewport Radix/Shadcn a cet attribut data-radix-scroll-area-viewport
      const viewport = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      ) as HTMLDivElement | null;
      
      if (viewport) {
        // Défilement vers le bas du viewport
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    
    // AJOUT du message système pour forcer le Français et le contexte Juridique
    const systemMessage: Message = {
      role: "system", 
      content: "Tu es un assistant juridique expert, spécialisé dans le droit. Réponds toujours en FRANÇAIS, dans un ton professionnel et précis. Concentre-toi sur l'aide à l'analyse de cas, la recherche de lois/décisions et la proposition de stratégies juridiques.",
    };

    const messagesToSend: Message[] = [
        systemMessage, 
        ...messages,
        userMessage
    ];

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend }), 
      });

      if (!res.ok || !res.body) {
        const errorData = res.status !== 500 ? await res.json().catch(() => ({})) : { error: "Erreur serveur" };
        throw new Error(errorData.error || `Erreur lors de la requête (Statut: ${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let currentAssistantResponse = "";
      let buffer = ""; 
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break; 

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || ""; 

        for (const line of lines) {
            if (!line.trim()) continue;

            try {
                const chunk = JSON.parse(line.trim());
                const content = chunk.choices[0]?.delta?.content;

                if (content) {
                    currentAssistantResponse += content;
                }
            } catch (e) {
                // Gestion silencieuse des morceaux JSONL
            }
        }
        
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].content = currentAssistantResponse;
          return updatedMessages;
        });
      }

    } catch (err: any) {
      console.error(err);
      setMessages((prev) => prev.slice(0, prev.length - 1)); 
      setError(err.message || "Impossible de contacter DeepSeek");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-9xl mx-auto bg-gray-900 text-white border-gray-700 mt-9">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">🤖 Assistant Juridique AI (DeepSeek)</h2>

        {/* 3. Utilisation du ref standard sur le composant ScrollArea */}
        <ScrollArea 
          className="h-96 p-4 border border-gray-700 rounded-lg bg-gray-800"
          ref={scrollAreaRef} // 🚨 CORRECTION TS2322 : Utilisation de la prop 'ref' standard
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.3 }}
                className={`my-2 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`} 
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {msg.role === "assistant" && msg.content === "" && loading 
                    ? <span className="animate-pulse">...</span> 
                    : msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].content === "" && loading && (
             <p className="text-gray-400 italic mt-2">DeepSeek réfléchit...</p>
          )}

        </ScrollArea>

        {error && (
          <p className="mt-2 p-2 bg-red-600 text-white rounded">{error}</p>
        )}

        <div className="flex mt-4 space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Posez votre question juridique (Ex: Analyser l'arrêt CASS-2023-14)..."
            className="flex-1 bg-gray-800 border-gray-700 text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
            disabled={loading} 
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Envoyer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}