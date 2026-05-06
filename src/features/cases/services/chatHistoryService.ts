import api from "@/utils/api";

export const startConversation = async (): Promise<string> => {
    const response = await api.post('/Chat/start');
    return response.data?.data?.conversationId || response.data?.conversationId;
};

export const saveMessage = async (conversationId: string, content: string, isAiMessage: boolean): Promise<void> => {
    await api.post('/Chat/message', {
        conversationId,
        content,
        isAiMessage
    });
};

export const getConversations = async (): Promise<any> => {
    const response = await api.get('/Chat/conversations');
    return response.data;
};

export const getConversationDetails = async (conversationId: string): Promise<any> => {
    const response = await api.get(`/Chat/conversation/${conversationId}`);
    return response.data;
};
