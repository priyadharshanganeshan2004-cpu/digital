import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiPaperAirplane, HiChat } from 'react-icons/hi';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Conversation, Message } from '@/types';

export default function ClientMessages() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [activeConversation, setActiveConversation] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get conversations
    const { data: conversations, isLoading: loadingConvos } = useQuery<Conversation[]>({
        queryKey: ['conversations'],
        queryFn: async () => {
            const { data } = await api.get('/messages');
            return data.data;
        },
    });

    // Get messages for active conversation
    const { data: messages, isLoading: loadingMessages } = useQuery<Message[]>({
        queryKey: ['messages', activeConversation],
        queryFn: async () => {
            if (!activeConversation) return [];
            const { data } = await api.get(`/messages/${activeConversation}`);
            return data.data;
        },
        enabled: !!activeConversation,
        refetchInterval: 15000, // Poll every 15 seconds
    });

    // Send message
    const sendMutation = useMutation({
        mutationFn: async (content: string) => {
            const { data } = await api.post('/messages', {
                recipient: activeConversation,
                content,
            });
            return data.data;
        },
        onSuccess: () => {
            setNewMessage('');
            queryClient.invalidateQueries({ queryKey: ['messages', activeConversation] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-select first conversation
    useEffect(() => {
        if (conversations?.length && !activeConversation) {
            setActiveConversation(conversations[0].user._id);
        }
    }, [conversations, activeConversation]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;
        sendMutation.mutate(newMessage.trim());
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-heading font-bold text-dark-900">Messages</h2>
                <p className="text-sm text-dark-400 mt-1">Contact the agency team</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
                <div className="flex h-full">
                    {/* Conversations List */}
                    <div className="w-72 border-r border-gray-100 flex flex-col">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-heading font-semibold text-dark-900 text-sm">Conversations</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loadingConvos ? (
                                <LoadingSpinner size="sm" />
                            ) : !conversations?.length ? (
                                <div className="p-6 text-center">
                                    <HiChat className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-xs text-dark-400">No conversations yet</p>
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <button
                                        key={conv.user._id}
                                        onClick={() => setActiveConversation(conv.user._id)}
                                        className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeConversation === conv.user._id ? 'bg-primary-50' : ''
                                            }`}
                                    >
                                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600 flex-shrink-0">
                                            {conv.user.name?.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-dark-900 truncate">{conv.user.name}</p>
                                            <p className="text-xs text-dark-400 truncate">{conv.lastMessage}</p>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center font-bold">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 flex flex-col">
                        {!activeConversation ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <HiChat className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                    <p className="text-dark-400">Select a conversation</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {loadingMessages ? (
                                        <LoadingSpinner size="sm" />
                                    ) : !messages?.length ? (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-dark-400">No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMe = msg.sender._id === user?._id;
                                            return (
                                                <motion.div
                                                    key={msg._id}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                            ? 'bg-primary-500 text-white rounded-br-md'
                                                            : 'bg-gray-100 text-dark-800 rounded-bl-md'
                                                        }`}>
                                                        <p>{msg.content}</p>
                                                        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-dark-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend} className="p-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || sendMutation.isPending}
                                            className="p-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <HiPaperAirplane className="w-5 h-5 rotate-90" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
