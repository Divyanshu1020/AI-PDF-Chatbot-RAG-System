import { useQuery } from '@tanstack/react-query'

const useChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${chatId}/previous`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      return res.json() // returns Message[]
    },
    enabled: !!chatId, 
  })
}

export default useChatMessages
