import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // misy validation simple sy  error handling   dia ilaina ilay izy 
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Format invalide : messages attendu" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages,
    });

    return NextResponse.json({
      reply: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Erreur DeepSeek API :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue avec DeepSeek API" },
      { status: 500 }
    );
  }
}
