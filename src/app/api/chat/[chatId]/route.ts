import { saveMessages } from "@/db/queries";
import { embeddings, model } from "@/lib/AI";
import { pineconeIndex } from "@/lib/pinecone";
import { rateLimitForChatMessages } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest, NextResponse } from "next/server";

const systemPrompt = `
You are a helpful assistant that answers questions using only the content from a PDF document.

- The context is provided as a list of passages with page numbers.
- Only use the given context to answer.
- If the information is not available, respond with: "This information is not available in the document."
- Be concise and factual.
- Reference the page number in your answer when relevant.
`;

async function getContext(chatId: string, content: string) {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  const retriever = vectorStore.asRetriever({
    filter: {
      chatId: {
        $eq: chatId,
      },
    },
    k: 3,
  });

  const retrievedDocs = await retriever.invoke(content);
  const contextString = retrievedDocs
    .map((doc) => `Page ${doc.metadata.pageNumber}:\n${doc.pageContent}`)
    .join("\n\n");

  return { retrievedDocs, contextString };
}

async function generateAssistantResponse(
  contextString: string,
  content: string
) {
  const userMessage = `Context:\n${contextString}\n\n Question: ${content}`;
  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userMessage),
  ];

  const response = await model.invoke(messages);
  return response.content as string;
}

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

    const key = `ratelimit:chat-messages:${userId}`;
    const { success } = await rateLimitForChatMessages.limit(key);

    if (!success) {
      const assistantResponse =
        "Rate limit exceeded. You can send a maximum of 5 messages per day.";
      const { userMessageResponse, assistantMessageResponse } =
        await saveMessages(chatId, content, assistantResponse);

      return NextResponse.json({
        status: 200,
        data: {
          userMessageResponse,
          assistantMessageResponse,
          AIResponse: assistantResponse,
        },
      });
    }

    const { retrievedDocs, contextString } = await getContext(chatId, content);
    const assistantResponse = await generateAssistantResponse(
      contextString,
      content
    );

    const { userMessageResponse, assistantMessageResponse } =
      await saveMessages(chatId, content, assistantResponse);

    return NextResponse.json({
      status: 200,
      data: {
        retrievedDocs,
        userMessageResponse,
        assistantMessageResponse,
        AIResponse: assistantResponse,
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
