import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_KEY!; 
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    const generatedText = await result.response.text();

    // Return the generated text as a response
    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json({ error: "An error occurred while generating the response" }, { status: 500 });
  }
}
