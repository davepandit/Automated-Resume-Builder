import { Gem } from "lucide-react";
import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = GEMENI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// FIX: Changed model from "gemini-1.5-flash" to the currently supported and stable "gemini-2.5-flash"
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const AIChatSession = model.startChat({
  generationConfig, // safetySettings: Adjust safety settings // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [],
});
