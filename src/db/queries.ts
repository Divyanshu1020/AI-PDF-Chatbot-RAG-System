// src/db/queries.ts
import { db } from ".";
import { chats, messages as messagesTable, CHATS_TYPE } from "./schema";
import { v4 as uuidv4 } from "uuid";

export async function saveMessages(
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

export async function createChat(chatData: CHATS_TYPE) {
  const [chat] = await db.insert(chats).values(chatData).returning();
  return chat;
}
