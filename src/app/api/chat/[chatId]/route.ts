import { db } from "@/db";

import { messages as messagesTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { CohereEmbeddings } from "@langchain/cohere";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const systemPrompt = `
You are a helpful assistant that answers questions using only the content from a PDF document.

- The context is provided as a list of passages with page numbers.
- Only use the given context to answer.
- If the information is not available, respond with: "This information is not available in the document."
- Be concise and factual.
- Reference the page number in your answer when relevant.
`;

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { chatId } = params;
    const { content } = await req.json();

    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

    const embeddings = new CohereEmbeddings({ model: "embed-english-v3.0" });

    // Load existing Pinecone vector store
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    // Perform semantic search
    const retriever = vectorStore.asRetriever({
      filter: {
        chatId: {
          $eq: chatId,
        },
      },
      k: 3,
    });

    const retrievedDocs = await retriever.invoke(content);

    const contextString = retrievedDocs.map((doc) => `Page ${doc.metadata.pageNumber}:\n${doc.pageContent}`).join("\n\n");

    const userMessage = `Context:\n${contextString}\n\n Question: ${content}`;




    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0,
    });

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userMessage),
    ];

    const response = await model.invoke(messages);

    const { userMessageResponse, assistantMessageResponse } =
      await saveUserMessage(chatId, content, response.content as string);

    console.log(response.content); // Matching documents

    return NextResponse.json({
      status: 200,
      data: {
        retrievedDocs,
        userMessageResponse,
        assistantMessageResponse,
        AIResponse: response.content,
      },
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

async function saveUserMessage(
  chatId: string,
  userMessage: string,
  assistantMessage: string
) {
  const userMessageResponse = await db.insert(messagesTable).values({
    id: uuidv4(),
    chatId,
    content: userMessage,
    role: "user",
    createdAt: new Date(),
  });

  const assistantMessageResponse = await db.insert(messagesTable).values({
    id: uuidv4(),
    chatId,
    content: assistantMessage,
    role: "system",
    createdAt: new Date(),
  });

  return { userMessageResponse, assistantMessageResponse };
}
