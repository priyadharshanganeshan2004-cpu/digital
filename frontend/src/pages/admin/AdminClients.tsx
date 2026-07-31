import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiUserAdd, HiSearch, HiPencil, HiTrash, HiCheck, HiX, HiBan } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { User } from '@/types';

export default function AdminClients() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);

    // Form inputs state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');

    const { data: response, isLoading } = useQuery({
        queryKey: ['admin-clients', search, statusFilter],
        queryFn: async () => {
            const { data } = await api.get('/admin/clients', {
                params: { search, status: statusFilter },
            });
            return data;
        },
    });

    const clients = response?.data || [];

    const createMutation = useMutation({
        mutationFn: (newClient: any) => api.post('/admin/clients', newClient),
        onSuccess: (res) => {
            alert(`Client account created successfully!\nTemp Password: ${res.data.tempPassword || 'generated'}`);
            queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
            closeModal();
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Error creating client');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/admin/clients/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
            closeModal();
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/admin/clients/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
        },
    });

    const openCreateModal = () => {
        setSelectedClient(null);
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setModalOpen(true);
    };

    const openEditModal = (client: User) => {
        setSelectedClient(client);
        setName(client.name);
        setEmail(client.email);
        setPhone(client.phone || '');
        setCompany(client.company || '');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedClient(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clientData = { name, email, phone, company };
        if (selectedClient) {
            updateMutation.mutate({ id: selectedClient._id, data: clientData });
        } else {
            createMutation.mutate(clientData);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">Client Management</h2>
                    <p className="text-sm text-dark-400 mt-1">Create, edit, and manage accounts</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto"
                >
                    <HiUserAdd className="w-5 h-5" /> Create Client
                </button>
            </div>

            {/* Admin Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400">
                        <HiSearch className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-white border text-dark-500'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusFilter === 'active' ? 'bg-primary-500 text-white' : 'bg-white border text-dark-500'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setStatusFilter('inactive')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusFilter === 'inactive' ? 'bg-primary-500 text-white' : 'bg-white border text-dark-500'}`}
                    >
                        Deactivated
                    </button>
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 text-left bg-gray-50/50">
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Client</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Company</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Projects</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {clients.map((client: any) => (
                                    <tr key={client._id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center font-bold text-xs text-primary-600">
                                                    {client.name?.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-dark-900">{client.name}</p>
                                                    <p className="text-xs text-dark-400">{client.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-600">{client.company || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${client.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {client.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-600 font-semibold">{client.projectCount || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(client)}
                                                    className="p-1 px-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-dark-600 flex items-center gap-1"
                                                >
                                                    <HiPencil className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                {client.isActive && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Deactivate user?')) deactivateMutation.mutate(client._id);
                                                        }}
                                                        className="p-1 px-2.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium text-red-600 flex items-center gap-1"
                                                    >
                                                        <HiBan className="w-3.5 h-3.5" /> Deactivate
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
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-lg">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-heading font-bold text-dark-900">
                                {selectedClient ? 'Edit Client Details' : 'Create Client Account'}
                            </h3>
                            <button onClick={closeModal} className="text-dark-400 hover:text-dark-900">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Company</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="flex items-center gap-2 justify-end pt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-dark-600 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
