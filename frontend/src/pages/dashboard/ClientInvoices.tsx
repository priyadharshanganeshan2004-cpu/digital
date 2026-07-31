import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { HiCurrencyDollar, HiDownload, HiEye } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Invoice } from '@/types';

const statusConfig: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'bg-gray-50', text: 'text-gray-600' },
    sent: { bg: 'bg-blue-50', text: 'text-blue-600' },
    paid: { bg: 'bg-green-50', text: 'text-green-600' },
    overdue: { bg: 'bg-red-50', text: 'text-red-600' },
    cancelled: { bg: 'bg-gray-50', text: 'text-gray-400' },
};

export default function ClientInvoices() {
    const { data: invoices, isLoading } = useQuery<Invoice[]>({
        queryKey: ['client-invoices'],
        queryFn: async () => {
            const { data } = await api.get('/invoices');
            return data.data;
        },
    });

    if (isLoading) return <LoadingSpinner size="lg" />;

    const totalPaid = invoices?.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0) || 0;
    const totalPending = invoices?.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + i.total, 0) || 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-heading font-bold text-dark-900">Invoices</h2>
                <p className="text-sm text-dark-400 mt-1">View and download your invoices</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-sm text-dark-400 mb-1">Total Invoices</p>
                    <p className="text-2xl font-heading font-bold text-dark-900">{invoices?.length || 0}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-sm text-dark-400 mb-1">Total Paid</p>
                    <p className="text-2xl font-heading font-bold text-green-600">${totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-sm text-dark-400 mb-1">Pending</p>
                    <p className="text-2xl font-heading font-bold text-amber-600">${totalPending.toLocaleString()}</p>
                </div>
            </div>

            {/* Invoices Table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {!invoices?.length ? (
                    <div className="p-12 text-center">
                        <HiCurrencyDollar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <h3 className="font-heading font-semibold text-dark-900 mb-1">No Invoices</h3>
                        <p className="text-sm text-dark-400">Your invoices will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Invoice</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoices.map((inv) => {
                                    const sc = statusConfig[inv.status];
                                    return (
                                        <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-dark-900">{inv.invoiceNumber}</td>
                                            <td className="px-6 py-4 text-sm text-dark-600">
                                                {typeof inv.project === 'object' && inv.project ? inv.project.title : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-dark-900">${inv.total.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${sc?.bg} ${sc?.text}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-dark-400">
                                                {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                                    <HiEye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
