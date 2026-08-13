import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type TeamMemberItem = {
    _id?: string;
    name: string;
    role: string;
    initials: string;
    sortOrder: number;
};

const emptyForm: TeamMemberItem = {
    name: '',
    role: '',
    initials: '',
    sortOrder: 0,
};

export default function AdminTeam() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<TeamMemberItem>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-team'],
        queryFn: async () => {
            const { data } = await api.get('/admin/team');
            return data.data as TeamMemberItem[];
        },
    });

    const team = useMemo(() => data || [], [data]);

    const saveMutation = useMutation({
        mutationFn: async (payload: TeamMemberItem) => {
            if (editingId) {
                return (await api.put(`/admin/team/${editingId}`, payload)).data;
            }
            return (await api.post('/admin/team', payload)).data;
        },
        onSuccess: () => {
            setForm(emptyForm);
            setEditingId(null);
            queryClient.invalidateQueries({ queryKey: ['admin-team'] });
            queryClient.invalidateQueries({ queryKey: ['cms-team'] });
            alert('Team member saved successfully');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to save team member');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => (await api.delete(`/admin/team/${id}`)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-team'] });
            queryClient.invalidateQueries({ queryKey: ['cms-team'] });
            alert('Team member deleted');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(form);
    };

    const handleEdit = (member: TeamMemberItem) => {
        setEditingId(member._id || null);
        setForm(member);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-heading font-bold text-dark-900">Team Members CMS</h2>
                <p className="text-sm text-dark-400 mt-1">Create, edit, and manage the team members shown on the /about page.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">
                        {editingId ? 'Edit team member' : 'Add new team member'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="space-y-1 md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500 font-heading">Name</span>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400"
                                    required
                                    placeholder="e.g. Alex Morgan"
                                />
                            </label>

                            <label className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500 font-heading">Role</span>
                                <input
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400"
                                    required
                                    placeholder="e.g. CEO & Founder"
                                />
                            </label>

                            <label className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500 font-heading">Initials (max 3 chars)</span>
                                <input
                                    value={form.initials}
                                    maxLength={3}
                                    onChange={(e) => setForm({ ...form, initials: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400"
                                    required
                                    placeholder="e.g. AM"
                                />
                            </label>

                            <label className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500 font-heading">Sort Order</span>
                                <input
                                    type="number"
                                    value={form.sortOrder}
                                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400"
                                />
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm(emptyForm);
                                    }}
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-dark-600"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saveMutation.isPending}
                                className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Team Member' : 'Create Team Member'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">Current team members</h3>
                    <div className="space-y-3">
                        {isLoading ? (
                            <p className="text-sm text-dark-500">Loading team members...</p>
                        ) : (
                            team.map((member) => (
                                <div key={member._id} className="rounded-xl border border-gray-100 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm">
                                                {member.initials}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-dark-900">{member.name}</p>
                                                <p className="text-xs text-dark-400">{member.role}</p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-primary-50 px-2 py-1 text-[10px] font-semibold text-primary-600">
                                            Sort: {member.sortOrder}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(member)}
                                            className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => member._id && deleteMutation.mutate(member._id)}
                                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
