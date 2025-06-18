"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, MessageSquare, AlertCircle } from "lucide-react"
import type { ChatSession } from "@/components/global/chat"
import { format } from 'date-fns';

interface ChatHistoryProps {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  onNewChat: () => void
  onSelectChat: (session: ChatSession) => void
  chatSessionsIsPending: boolean
  chatSessionsErrorInLoading: Error | null
}

export function ChatHistory({ 
  sessions, 
  currentSession, 
  onNewChat, 
  onSelectChat,
  chatSessionsIsPending,
  chatSessionsErrorInLoading 
}: ChatHistoryProps) {



  return (
    <div className="flex flex-col h-full  ">
      <div className="p-4 border-b  ">
        <Button onClick={onNewChat} className="w-full     border  ">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {chatSessionsErrorInLoading ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Failed to load chat history. {chatSessionsErrorInLoading.message}
            </AlertDescription>
          </Alert>
        ) : chatSessionsIsPending ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
            <button
            key={i}
            className={`w-full text-left p-3 rounded-lg border transition-colors
              
                 
                  hover:bg-gray-750"
            `}
          >
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-4 h-4 mt-1  flex-shrink-0" />
              <div className="flex-1 min-w-0">
              <div  className="space-y-1 ">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
              </div>
              </div>
            </div>
          </button>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <MessageSquare className="h-8 w-8  mb-2" />
            <p className="text-sm ">No chat history yet</p>
            <p className="text-xs mt-1">Start a new chat to see it here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectChat(session)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  currentSession?.id === session.id
                    ? " bg-accent  hover:bg-accent/90"
                    : "bg-accent/30  hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground  flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium  text-primary truncate">{session.pdfName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(session.createdAt), 'PPpp')}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
