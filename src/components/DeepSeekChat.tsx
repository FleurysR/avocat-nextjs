"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function DeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err: any) {
      setError(err.message || "Impossible de contacter DeepSeek");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-9xl mx-auto bg-gray-900 text-white border-gray-700 mt-9">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">🤖 Chatbot DeepSeek</h2>

        <ScrollArea className="h-96 p-9 border border-gray-700 rounded-lg bg-gray-800">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
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
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
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
            placeholder="Pose ta question juridique..."
            className="flex-1 bg-gray-800 border-gray-700 text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Envoyer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
