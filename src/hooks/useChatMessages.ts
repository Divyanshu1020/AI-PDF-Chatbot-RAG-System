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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

    // ✅ Consider fresh for 5 minutes (prevents refetch)
    staleTime: 1000 * 60 * 5,

    // 🧠 Keep in cache for 10 minutes after unused
    gcTime: 1000 * 60 * 10,
  })
}

export default useChatMessages
