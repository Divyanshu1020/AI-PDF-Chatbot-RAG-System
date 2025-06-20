import { CohereEmbeddings } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const embeddings = new CohereEmbeddings({ model: "embed-english-v3.0" });

export const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
});