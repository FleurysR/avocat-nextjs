// api/deepseek/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Format invalide : messages attendu" },
        { status: 400 }
      );
    }

    // ⭐ La clé du streaming est ici
    const stream = await client.chat.completions.create({
      model: "deepseek-chat",
      messages,
      stream: true, // IMPORTANT : active le mode streaming
    });

    // Retourne le flux de données directement
    return new NextResponse(stream.toReadableStream());
  } catch (error: any) {
    console.error("Erreur DeepSeek API :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue avec DeepSeek API" },
      { status: 500 }
    );
  }
}