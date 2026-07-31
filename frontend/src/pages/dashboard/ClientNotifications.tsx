import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiBell, HiCheck, HiTrash } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Notification } from '@/types';

export default function ClientNotifications() {
    const queryClient = useQueryClient();

    const { data: notificationsData, isLoading } = useQuery<{ data: Notification[]; unreadCount: number }>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get('/notifications');
            return data;
        },
    });

    const markRead = useMutation({
        mutationFn: (id: string) => api.put(`/notifications/${id}/read`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const markAllRead = useMutation({
        mutationFn: () => api.put('/notifications/read-all'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const deleteNotif = useMutation({
        mutationFn: (id: string) => api.delete(`/notifications/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    if (isLoading) return <LoadingSpinner size="lg" />;

    const notifications = notificationsData?.data || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    const typeColors: Record<string, string> = {
        project_update: 'bg-blue-50 text-blue-500',
        invoice: 'bg-green-50 text-green-500',
        message: 'bg-purple-50 text-purple-500',
        general: 'bg-gray-50 text-gray-500',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">Notifications</h2>
                    <p className="text-sm text-dark-400 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllRead.mutate()}
                        className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
                    >
                        <HiCheck className="w-4 h-4" /> Mark all as read
                    </button>
                )}
            </div>

            {!notifications.length ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <HiBell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-heading font-semibold text-dark-900 mb-1">No Notifications</h3>
                    <p className="text-sm text-dark-400">You're all caught up!</p>
                </motion.div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notif, i) => (
                        <motion.div
                            key={notif._id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`bg-white rounded-xl border p-4 flex items-start gap-3 group transition-colors ${notif.isRead ? 'border-gray-100' : 'border-primary-200 bg-primary-50/30'
                                }`}
                        >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[notif.type] || typeColors.general}`}>
                                <HiBell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm ${notif.isRead ? 'text-dark-600' : 'text-dark-900 font-medium'}`}>{notif.title}</p>
                                <p className="text-xs text-dark-400 mt-0.5">{notif.message}</p>
                                <p className="text-xs text-dark-300 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notif.isRead && (
                                    <button onClick={() => markRead.mutate(notif._id)} className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50">
                                        <HiCheck className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={() => deleteNotif.mutate(notif._id)} className="p-1.5 rounded-lg text-dark-400 hover:text-red-500 hover:bg-red-50">
                                    <HiTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
