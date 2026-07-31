import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiPlus, HiEye, HiCurrencyDollar, HiX, HiTrash } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Invoice, User, Project } from '@/types';

export default function AdminInvoices() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);

    // Form fields state
    const [clientId, setClientId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<Array<{ description: string; quantity: number; rate: number }>>([
        { description: '', quantity: 1, rate: 0 }
    ]);

    const { data: invoicesResponse, isLoading: loadingInvoices } = useQuery({
        queryKey: ['admin-invoices'],
        queryFn: async () => {
            const { data } = await api.get('/invoices');
            return data.data;
        },
    });

    const { data: clients } = useQuery<User[]>({
        queryKey: ['admin-clients-active'],
        queryFn: async () => {
            const { data } = await api.get('/admin/clients', { params: { status: 'active' } });
            return data.data;
        },
    });

    const { data: projects } = useQuery<Project[]>({
        queryKey: ['admin-projects-list'],
        queryFn: async () => {
            const { data } = await api.get('/projects');
            return data.data;
        },
    });

    const invoices = invoicesResponse || [];

    const createMutation = useMutation({
        mutationFn: (newInvoice: any) => api.post('/invoices', newInvoice),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
            closeModal();
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Error generating invoice');
        },
    });

    const recordPaymentMutation = useMutation({
        mutationFn: ({ id, method }: { id: string; method: string }) => api.put(`/invoices/${id}/pay`, { paymentMethod: method }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
        },
    });

    const closeModal = () => {
        setModalOpen(false);
        setClientId('');
        setProjectId('');
        setDueDate('');
        setNotes('');
        setItems([{ description: '', quantity: 1, rate: 0 }]);
    };

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            client: clientId,
            project: projectId || undefined,
            items,
            dueDate,
            notes,
        });
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, rate: 0 }]);
    };

    const removeItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, val: any) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: val };
        setItems(newItems);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">Billing & Invoices</h2>
                    <p className="text-sm text-dark-400 mt-1">Manage quotations, invoices, and payments</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto"
                >
                    <HiPlus className="w-5 h-5" /> Generate Invoice
                </button>
            </div>

            {loadingInvoices ? (
                <LoadingSpinner />
            ) : !invoices.length ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <HiCurrencyDollar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-heading font-semibold text-dark-900 mb-1">No Invoices</h3>
                    <p className="text-sm text-dark-400">Generate an invoice to begin tracking payments.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 text-left bg-gray-50/50">
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Invoice</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Client</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Due Date</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoices.map((inv: Invoice) => (
                                    <tr key={inv._id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-dark-900">{inv.invoiceNumber}</td>
                                        <td className="px-6 py-4 text-sm text-dark-600">
                                            {typeof inv.client === 'object' ? inv.client.name : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-dark-900">${inv.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${inv.status === 'paid' ? 'bg-green-50 text-green-600'
                                                    : inv.status === 'overdue' ? 'bg-red-50 text-red-600'
                                                        : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-dark-400">
                                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {inv.status !== 'paid' && (
                                                    <button
                                                        onClick={() => {
                                                            const method = prompt('Specify payment method (e.g. Stripe, Bank Transfer):', 'Bank Transfer');
                                                            if (method) recordPaymentMutation.mutate({ id: inv._id, method });
                                                        }}
                                                        className="p-1 px-2.5 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-medium text-green-600"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-lg">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-heading font-bold text-dark-900">Generate Client Invoice</h3>
                            <button onClick={closeModal} className="text-dark-400 hover:text-dark-900">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateInvoice} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Client</label>
                                    <select
                                        required
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2"
                                    >
                                        <option value="">Select client...</option>
                                        {clients?.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Project (Optional)</label>
                                    <select
                                        value={projectId}
                                        onChange={(e) => setProjectId(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2"
                                    >
                                        <option value="">Not linked to project</option>
                                        {projects?.filter(p => typeof p.client === 'object' ? p.client._id === clientId : p.client === clientId).map((p) => (
                                            <option key={p._id} value={p._id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-dark-500 uppercase">Invoice Line Items</label>
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Description (e.g. Website Wireframe)"
                                            required
                                            value={item.description}
                                            onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            min={1}
                                            required
                                            value={item.quantity}
                                            onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                            className="w-16 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Rate"
                                            min={0}
                                            required
                                            value={item.rate}
                                            onChange={(e) => updateItem(idx, 'rate', Number(e.target.value))}
                                            className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                        />
                                        {items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                                                <HiTrash className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addItem} className="text-xs text-primary-600 font-semibold hover:underline">
                                    + Add Item
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Notes / Terms</label>
                                    <input
                                        type="text"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Optional payment instructions..."
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-end pt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-dark-600 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors">
                                    Create Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
