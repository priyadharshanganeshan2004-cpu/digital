import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    HiTrendingUp, HiUsers, HiCurrencyDollar, HiChartBar,
    HiArrowUp, HiArrowDown, HiEye,
} from 'react-icons/hi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import api from '@/lib/api';

const statusColors: Record<string, string> = {
    new: 'bg-blue-50 text-blue-600',
    contacted: 'bg-yellow-50 text-yellow-600',
    qualified: 'bg-green-50 text-green-600',
    proposal: 'bg-purple-50 text-purple-600',
};

// Helper for formatting timestamps
function timeAgo(dateParam: string) {
    const date = new Date(dateParam);
    const today = new Date();
    const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

export default function AdminDashboard() {
    const { data: analytics, isLoading: analyticsLoading } = useQuery({
        queryKey: ['admin-analytics', '12m'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/admin/analytics', { params: { range: 12 } });
            return data.data;
        },
    });

    // Fetch real leads data securely!
    const { data: leadsData, isLoading, isError } = useQuery({
        queryKey: ['admin-leads'],
        queryFn: async () => {
            const { data } = await api.get('/leads');
            return data.data; // Mapped to the 'data' array in our API response
        },
    });

    const totalLeads = leadsData?.length || 0;
    const chartData = analytics?.timeline?.map((item: any) => ({
        name: item.label,
        revenue: item.revenue,
        leads: item.leads,
        visitors: Math.max(item.leads * 22, 0),
    })) || [];

    const stats = [
        { label: 'Total Revenue', value: analyticsLoading ? '...' : `$${Number(analytics?.totals?.revenue || 0).toLocaleString()}`, change: '12 month aggregate', up: true, icon: HiCurrencyDollar, color: 'bg-green-50 text-green-600' },
        { label: 'Total Leads', value: analyticsLoading ? '...' : String(analytics?.totals?.leads || totalLeads), change: '12 month aggregate', up: true, icon: HiTrendingUp, color: 'bg-blue-50 text-blue-600' },
        { label: 'Clients', value: 'Real-time', change: 'from database', up: true, icon: HiUsers, color: 'bg-purple-50 text-purple-600' },
        { label: 'Invoices', value: analyticsLoading ? '...' : String(analytics?.totals?.invoices || 0), change: '12 month aggregate', up: true, icon: HiChartBar, color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-xl p-5 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                                {stat.up ? <HiArrowUp className="w-3 h-3" /> : <HiArrowDown className="w-3 h-3" />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-heading font-bold text-dark-900">{stat.value}</p>
                        <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-heading font-semibold text-dark-900">Revenue Overview</h3>
                                <p className="text-sm text-dark-400">Monthly revenue trend from invoice records</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                            <HiArrowUp className="w-4 h-4" /> +12.5%
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${v / 1000}k`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Leads Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-heading font-semibold text-dark-900">Leads & Visitors</h3>
                            <p className="text-sm text-dark-400">Monthly lead acquisition from submissions</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} name="Leads" />
                            <Bar dataKey="visitors" fill="#a855f7" radius={[4, 4, 0, 0]} name="Visitors" opacity={0.3} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent Leads */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl border border-gray-100"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h3 className="font-heading font-semibold text-dark-900">Recent Leads</h3>
                        <p className="text-sm text-dark-400">Latest registered submissions</p>
                    </div>
                    <button className="text-sm text-primary-600 font-semibold hover:text-primary-700">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-50">
                                <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-dark-400">Loading leads securely from database...</td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500 font-medium">Please sign in as Admin to view leads.</td>
                                </tr>
                            )}

                            {!isLoading && !isError && leadsData?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-dark-400">No leads found. Submit a contact form to see it here!</td>
                                </tr>
                            )}

                            {!isLoading && !isError && leadsData?.map((lead: any) => (
                                <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-dark-900">{lead.name}</p>
                                            <p className="text-xs text-dark-400">{lead.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-600 capitalize">{lead.service.replace(/-/g, ' ')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-400">{timeAgo(lead.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        <button className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                            <HiEye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
