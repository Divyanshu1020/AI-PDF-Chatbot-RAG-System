


import { useQuery } from "@tanstack/react-query"

const useUserChatHistory = () => {
    const {data, isPending, error} = useQuery({
        queryKey: ['chat-history'],
        queryFn: async () => {
            const response = await fetch('/api/user-previous-chat');
            if (!response.ok) {
                throw new Error('Failed to fetch chat history');
            }
            return response.json();
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
    
    
    return {
        data: data || [],
        isPending,
        error
    };
}
export default useUserChatHistory