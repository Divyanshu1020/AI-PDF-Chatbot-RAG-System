"use client";

import { ChatHistory } from "@/components/global/chat/chat-history";
import { ChatInterface } from "@/components/global/chat/chat-interface";
import { PdfViewer } from "@/components/global/chat/pdf-viewer";
import { MESSAGES_TYPE } from "@/db/schema";
import useChatMessages from "@/hooks/useChatMessages";
import useUserChatHistory from "@/hooks/userChatHistory";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PDFUploadComponent from "./pdf-uploud";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Loader from "../loader";
import { PdfViewerMobile } from "./pdf-viewer-mobile";

export interface ChatSession {
  id: string;
  pdfName: string;
  createdAt: Date;
  messages: MESSAGES_TYPE[];
  file: File | null;

  pdfUrl: string;
  updatedAt?: Date;
  userId: string;
  fileKey: string;
}

export default function Chat() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const {
    data: userChats,
    isPending: userChatsPending,
    error: userChatsError,
  } = useUserChatHistory();
  const {
    data: messages,
    isPending: messagesPending,
    error: messagesError,
  } = useChatMessages(currentSession?.id || "");

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatSessionMessages, setChatSessionMessages] = useState<
    MESSAGES_TYPE[]
  >([]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)")


  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    // Create a new chat session when a file is uploaded
    if (!currentSession) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        pdfName: file.name,
        createdAt: new Date(),
        messages: [],
        pdfUrl: url,
        file,
        userId: "",
        fileKey: uuidv4(),
        updatedAt: new Date(),
      };
      setChatSessions((prev) => [newSession, ...prev]);
      setCurrentSession(newSession);
    }
  };

  const handleNewChat = () => {
    setCurrentSession(null);
    setPdfUrl(null);
  };

  const handleSelectChat = (session: ChatSession) => {
    setPdfUrl(session.pdfUrl);
    setCurrentSession(session);
  };

  const handleSendMessage = async (content: string, chatId: string) => {
    if (!currentSession) return;

    const userMessage: MESSAGES_TYPE = {
      id: uuidv4(),
      content,
      role: "user",
      chatId,
      createdAt: new Date(),
    };

    const assistantMessage: MESSAGES_TYPE = {
      id: uuidv4(),
      content: ``,
      role: "system",
      chatId,
      status: "pending",
      createdAt: new Date(),
    };

    setChatSessionMessages((prev) => [...prev, userMessage, assistantMessage]);

    const response = await fetch(`/api/chat/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();

    setChatSessionMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content: data.data.AIResponse,
        status: "completed",
      };
      return updated;
    });
    console.log(data);
  };

  useEffect(() => {
    if (userChats && !userChatsPending) {
      setChatSessions(userChats);
    }
  }, [userChats, userChatsPending]);

  useEffect(() => {
    if (messages && !messagesPending) {
      setChatSessionMessages(messages);
    }
  }, [messages, messagesPending]);

  const renderDesktopView = () => (
    <div className="flex h-[calc(100vh-64px)] mt-[64px] border-t  ">
      {/* Left Panel - Chat History */}
      <div className="w-80 border-r flex flex-col">
        <ChatHistory
          sessions={chatSessions}
          chatSessionsIsPending={userChatsPending}
          chatSessionsErrorInLoading={userChatsError}
          currentSession={currentSession}
          onNewChat={() => handleNewChat()}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Center Panel - PDF Viewer */}
      <div className="flex-1 border-r flex flex-col">
        {!currentSession ? (
          // <FileUpload onFileUpload={handleFileUpload} />
          <PDFUploadComponent onFileUpload={handleFileUpload} />
        ) : (
          <PdfViewer
            pdfUrl={currentSession?.pdfUrl || ""}
            fileName={currentSession?.pdfName || "document.pdf"}
          />
        )}
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="w-96 flex flex-col">
        <ChatInterface
          currentSession={currentSession}
          onSendMessage={handleSendMessage}
          hasDocument={!!pdfUrl}
          chatSessionMessages={chatSessionMessages}
          messagesPending={messagesPending}
          messagesError={messagesError}
        />
      </div>

      
    </div>
  )

  const renderMobileView = () => (
    <Tabs defaultValue="pdfUploadViewer" className=" h-[calc(100vh-120px)] mt-[64px] border-t rounded-none  ">
        <TabsList className="bg-transparent border-b rounded-none  px-2">
    <TabsTrigger
      value="chatHistory"
      className="data-[state=active]:border-b-2  border-primary   rounded-none px-4 py-2 font-medium transition"
    >
      Chat History
    </TabsTrigger>
    <TabsTrigger
      value="pdfUploadViewer"
      className="data-[state=active]:border-b-2  border-primary   rounded-none px-4 py-2 font-medium transition"
    >
      PDF Upload/Viewer
    </TabsTrigger>
    <TabsTrigger
      value="chat"
      className="data-[state=active]:border-b-2 shadow-none  border-primary   rounded-none px-4 py-2 font-medium transition"
    >
      Chat
    </TabsTrigger>
  </TabsList>
      <TabsContent value="chatHistory" className="h-full">
        <ChatHistory
          sessions={chatSessions}
          chatSessionsIsPending={userChatsPending}
          chatSessionsErrorInLoading={userChatsError}
          currentSession={currentSession}
          onNewChat={() => handleNewChat()}
          onSelectChat={handleSelectChat}
        />
      </TabsContent>
      <TabsContent value="pdfUploadViewer" defaultChecked>
      <div className="h-full flex-1 border-r flex flex-col">
        {!currentSession ? (
          // <FileUpload onFileUpload={handleFileUpload} />
          <PDFUploadComponent onFileUpload={handleFileUpload} />
        ) : (
          <PdfViewerMobile
            pdfUrl={currentSession?.pdfUrl || ""}
            fileName={currentSession?.pdfName || "document.pdf"}
          />
        )}
      </div>
      </TabsContent>
      <TabsContent value="chat" >
        <ChatInterface
          currentSession={currentSession}
          onSendMessage={handleSendMessage}
          hasDocument={!!pdfUrl}
          chatSessionMessages={chatSessionMessages}
          messagesPending={messagesPending}
          messagesError={messagesError}
        />
      </TabsContent>
    </Tabs>
  )

  if (isMobile === null) {
    return   <Loader className="h-screen flex justify-center items-center" state={true}>...Loading</Loader>
  }

  return <>
  {isMobile ? renderMobileView() : renderDesktopView()}

</>
}
