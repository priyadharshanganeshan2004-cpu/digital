import { motion } from 'framer-motion';
import { HiCollection, HiCurrencyDollar, HiChat, HiArrowRight, HiClock, HiCheckCircle, HiBell } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { ClientStats } from '@/types';

export default function ClientDashboard() {
    const { data: stats, isLoading } = useQuery<ClientStats>({
        queryKey: ['client-stats'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/client');
            return data.data;
        },
    });

    if (isLoading) return <LoadingSpinner size="lg" />;

    const quickStats = [
        { label: 'Active Projects', value: String(stats?.activeProjects || 0), icon: HiCollection, color: 'bg-blue-50 text-blue-600' },
        { label: 'Completed', value: String(stats?.completedProjects || 0), icon: HiCheckCircle, color: 'bg-green-50 text-green-600' },
        { label: 'Pending Invoices', value: `$${(stats?.pendingInvoices || 0).toLocaleString()}`, icon: HiCurrencyDollar, color: 'bg-amber-50 text-amber-600' },
        { label: 'Unread Messages', value: String(stats?.unreadMessages || 0), icon: HiChat, color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-5 border border-gray-100">
                        <div className={`w-10 h-10 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
                        </div>
                        <p className="text-2xl font-heading font-bold text-dark-900">{stat.value}</p>
                        <p className="text-sm text-dark-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h3 className="font-heading font-semibold text-dark-900">Your Projects</h3>
                        <Link to="/dashboard/projects" className="text-sm text-primary-600 font-semibold flex items-center gap-1">View All <HiArrowRight className="w-3 h-3" /></Link>
                    </div>
                    <div className="p-6 space-y-5">
                        {stats?.recentProjects && stats.recentProjects.length > 0 ? (
                            stats.recentProjects.map((project) => (
                                <Link to={`/dashboard/projects/${project._id}`} key={project._id} className="block group">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-dark-900 text-sm group-hover:text-primary-600 transition-colors">{project.title}</h4>
                                        <span className={`flex items-center gap-1 text-xs font-medium ${project.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                                            {project.status === 'completed' ? <HiCheckCircle className="w-3.5 h-3.5" /> : <HiClock className="w-3.5 h-3.5" />}
                                            <span className="capitalize">{project.status.replace('-', ' ')}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 rounded-full bg-gray-100">
                                            <div className={`h-full rounded-full transition-all ${project.progress === 100 ? 'bg-green-500' : 'bg-primary-500'}`} style={{ width: `${project.progress}%` }} />
                                        </div>
                                        <span className="text-xs font-medium text-dark-400">{project.progress}%</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-dark-400 text-center py-4">No projects yet. Your projects will appear here.</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Notifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h3 className="font-heading font-semibold text-dark-900">Recent Notifications</h3>
                        <Link to="/dashboard/notifications" className="text-sm text-primary-600 font-semibold flex items-center gap-1">View All <HiArrowRight className="w-3 h-3" /></Link>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats?.recentNotifications && stats.recentNotifications.length > 0 ? (
                                stats.recentNotifications.map((notif) => (
                                    <div key={notif._id} className="flex gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.isRead ? 'bg-gray-50' : 'bg-primary-50'}`}>
                                            <HiBell className={`w-4 h-4 ${notif.isRead ? 'text-gray-400' : 'text-primary-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${notif.isRead ? 'text-dark-500' : 'text-dark-900 font-medium'}`}>{notif.title}</p>
                                            <p className="text-xs text-dark-400 mt-0.5 truncate">{notif.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-dark-400 text-center py-4">No notifications yet.</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
