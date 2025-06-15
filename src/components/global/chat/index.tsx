"use client"

import { useEffect, useState } from "react"
import { ChatHistory } from "@/components/global/chat/chat-history"
import { PdfViewer } from "@/components/global/chat/pdf-viewer"
import { ChatInterface } from "@/components/global/chat/chat-interface"
import { Toaster } from "@/components/ui/sonner"
import PDFUploadComponent from "./pdf-uploud"
import { v4 as uuidv4 } from 'uuid';
import useUserChatHistory from "@/hooks/userChatHistory"
import { MESSAGES_TYPE } from "@/db/schema"
import useChatMessages from "@/hooks/useChatMessages"

export interface ChatSession {
  id: string
  pdfName: string
  createdAt: Date
  messages: MESSAGES_TYPE[]
  file: File | null

  pdfUrl: string;
  updatedAt?: Date;
  userId: string;
  fileKey: string;
}



export default  function Chat() {

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const {data: userChats, isPending: userChatsPending, error: userChatsError} = useUserChatHistory()
  const {data: messages, isPending: messagesPending, error: messagesError} = useChatMessages(currentSession?.id || "")



  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [chatSessionMessages, setChatSessionMessages] = useState<MESSAGES_TYPE[]>([])


  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    const url = URL.createObjectURL(file)
    setPdfUrl(url)

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

          }
          setChatSessions((prev) => [newSession, ...prev])
          setCurrentSession(newSession)
    }
  }

  const handleNewChat = () => {
    
    setCurrentSession(null)
    setUploadedFile(null)
    setPdfUrl(null)
  }

  const handleSelectChat = (session: ChatSession) => {
    setPdfUrl(session.pdfUrl)
    setCurrentSession(session)
  }

  const  handleSendMessage = async(content: string, chatId: string) => {
    if (!currentSession) return

    const userMessage: MESSAGES_TYPE = {
      id: uuidv4(),
      content,
      role: "user",
      chatId,
      createdAt: new Date(),
    }

    const assistantMessage: MESSAGES_TYPE = {
      id: uuidv4(),
      content: ``,
      role: "system",
      chatId,
      status: "pending",
      createdAt: new Date(),
    }

    
    setChatSessionMessages((prev) => [...prev, userMessage, assistantMessage])
    
    
    const response = await fetch(`/api/chat/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),


    })

    const data = await response.json()

    setChatSessionMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: data.data.AIResponse,
          status: "completed"
      };
      return updated;
  });
    console.log(data)
    



  }

  useEffect(() => {
    if (userChats && !userChatsPending) {
      setChatSessions(userChats)
    }
  }, [userChats, userChatsPending])

  useEffect(() => {
    if (messages && !messagesPending) {
      setChatSessionMessages(messages)
    }
  }, [messages, messagesPending])

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Panel - Chat History */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
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
      <div className="flex-1 border-r border-gray-700 flex flex-col">
        {!currentSession ? (
          // <FileUpload onFileUpload={handleFileUpload} />
          <PDFUploadComponent onFileUpload={handleFileUpload} />
        ) : (
          <PdfViewer pdfUrl={currentSession?.pdfUrl || ""} fileName={currentSession?.pdfName || "document.pdf"} />
        )}
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="w-96 flex flex-col">
        <ChatInterface currentSession={currentSession} onSendMessage={handleSendMessage} hasDocument={!!pdfUrl} chatSessionMessages={chatSessionMessages} messagesPending={messagesPending} messagesError={messagesError} />
      </div>

      <Toaster />
    </div>
  )
}
