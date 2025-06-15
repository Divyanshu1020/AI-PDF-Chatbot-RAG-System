"use client";

import type React from "react";

import type { ChatSession } from "@/components/global/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MESSAGES_TYPE } from "@/db/schema";
import { format } from 'date-fns';


interface ChatInterfaceProps {
  currentSession: ChatSession | null;
  onSendMessage: (content: string, chatId: string) => void;
  hasDocument: boolean;
  chatSessionMessages: MESSAGES_TYPE[];
  messagesPending: boolean;
  messagesError: Error | null;
}

export function ChatInterface({
  currentSession,
  onSendMessage,
  hasDocument,
  chatSessionMessages
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatSessionMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !hasDocument) return;

    onSendMessage(input.trim(), currentSession?.id.toString() || "");
    setInput("");
  };



  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-white">AI Chat</span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {!hasDocument ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Upload a PDF document to start chatting
              </p>
            </div>
          </div>
        ) : !currentSession ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Select a chat or start a new conversation
              </p>
            </div>
          </div>
        ) : (chatSessionMessages.length) === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Ready to help!</p>
              <p className="text-gray-400 text-sm">
                Ask me anything about your PDF document
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
    {chatSessionMessages.map((message) => (
      <div
        key={message.id}
        className={`flex items-start space-x-3 ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {message.role === "system" && (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}

        <div
          className={`max-w-[80%] rounded-lg p-3 relative ${
            message.role === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white"
          } ${message.status === "pending" ? "animate-pulse" : ""}`}
        >
          <p className="text-sm">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">
            { format(message.createdAt, "dd/MM/yy HH:mm:ss")}
          </p>

          {(message.role === "system" && message.status === "pending") && (
            <span className="absolute top-1 right-2 text-xs text-white/70">
              thinking...
            </span>
          )}
        </div>

        {message.role === "user" && (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    ))}
</div>
        )}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasDocument
                ? "Ask about your document..."
                : "Upload a PDF to start chatting"
            }
            disabled={!hasDocument}
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
          <Button
            type="submit"
            disabled={!input.trim() || !hasDocument}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
