import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HiStar, HiPencil, HiTrash, HiPlus, HiX, HiEye, HiEyeOff } from 'react-icons/hi';
import api from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Testimonial {
    _id?: string;
    name: string;
    role: string;
    company: string;
    message: string;
    rating: number;
    avatar: string;
    isActive: boolean;
    order: number;
}

const emptyForm: Testimonial = {
    name: '',
    role: '',
    company: '',
    message: '',
    rating: 5,
    avatar: '',
    isActive: true,
    order: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared CSS helpers (mirrors AdminSettings style)
// ─────────────────────────────────────────────────────────────────────────────
const inputCls =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100';
const labelCls = 'space-y-1';
const spanCls = 'text-xs font-semibold uppercase tracking-wide text-dark-500';

// ─────────────────────────────────────────────────────────────────────────────
// StarRating picker
// ─────────────────────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState<number | null>(null);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onChange(n)}
                    aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                >
                    <HiStar
                        className={`w-6 h-6 transition-colors ${n <= (hovered ?? value) ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonial card shown in the list
// ─────────────────────────────────────────────────────────────────────────────
function TestimonialCard({
    item,
    onEdit,
    onDelete,
    onToggle,
    isDeleting,
    isToggling,
}: {
    item: Testimonial;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: () => void;
    isDeleting: boolean;
    isToggling: boolean;
}) {
    const initials = item.name
        .split(' ')
        .map((p) => p.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');

    return (
        <div
            className={`rounded-2xl border p-5 transition-all ${item.isActive
                    ? 'border-gray-100 bg-white'
                    : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    {item.avatar ? (
                        <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-11 h-11 rounded-full object-cover shadow"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm shadow">
                            {initials}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-dark-900 leading-tight">{item.name}</p>
                        <p className="text-xs text-dark-500">
                            {item.role}, {item.company}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {/* Active toggle */}
                    <button
                        onClick={onToggle}
                        disabled={isToggling}
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                        className={`p-2 rounded-lg transition-colors text-sm ${item.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                    >
                        {item.isActive ? (
                            <HiEye className="w-4 h-4" />
                        ) : (
                            <HiEyeOff className="w-4 h-4" />
                        )}
                    </button>
                    {/* Edit */}
                    <button
                        onClick={onEdit}
                        title="Edit"
                        className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                        <HiPencil className="w-4 h-4" />
                    </button>
                    {/* Delete */}
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        title="Delete"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                        <HiTrash className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                    <HiStar
                        key={n}
                        className={`w-4 h-4 ${n <= item.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    />
                ))}
            </div>

            {/* Message */}
            <p className="text-sm text-dark-600 leading-relaxed line-clamp-3">"{item.message}"</p>

            {/* Footer meta */}
            <div className="mt-3 flex items-center justify-between text-xs text-dark-400">
                <span>Order: {item.order}</span>
                <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${item.isActive
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    {item.isActive ? 'Active' : 'Hidden'}
                </span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminTestimonials() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<Testimonial>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // ── Fetch all testimonials (admin view) ──────────────────────────────
    const { data, isLoading } = useQuery<Testimonial[]>({
        queryKey: ['admin-testimonials'],
        queryFn: async () => {
            const { data } = await api.get('/admin/testimonials');
            return data.data as Testimonial[];
        },
    });

    const items = useMemo(() => data || [], [data]);

    // ── Invalidate both admin and public caches after mutations ──────────
    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
        queryClient.invalidateQueries({ queryKey: ['cms-testimonials'] });
    };

    // ── Save (create or update) ──────────────────────────────────────────
    const saveMutation = useMutation({
        mutationFn: async (payload: Testimonial) => {
            if (editingId) {
                return (await api.put(`/admin/testimonials/${editingId}`, payload)).data;
            }
            return (await api.post('/admin/testimonials', payload)).data;
        },
        onSuccess: () => {
            invalidateAll();
            resetForm();
        },
        onError: (error: any) => {
            setFormError(
                error.response?.data?.message || 'Failed to save testimonial. Please try again.'
            );
        },
    });

    // ── Delete ───────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            setDeletingId(id);
            return (await api.delete(`/admin/testimonials/${id}`)).data;
        },
        onSuccess: () => {
            invalidateAll();
            setDeletingId(null);
        },
        onError: (error: any) => {
            setDeletingId(null);
            alert(error.response?.data?.message || 'Failed to delete testimonial.');
        },
    });

    // ── Toggle isActive ──────────────────────────────────────────────────
    const toggleMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            setTogglingId(id);
            return (await api.put(`/admin/testimonials/${id}`, { isActive })).data;
        },
        onSuccess: () => {
            invalidateAll();
            setTogglingId(null);
        },
        onError: () => {
            setTogglingId(null);
        },
    });

    // ── Helpers ──────────────────────────────────────────────────────────
    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setFormError('');
    };

    const handleEdit = (item: Testimonial) => {
        setForm({ ...item });
        setEditingId(item._id || null);
        setShowForm(true);
        setFormError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        // Client-side validation
        if (!form.name.trim()) return setFormError('Client name is required.');
        if (!form.role.trim()) return setFormError('Job title / role is required.');
        if (!form.company.trim()) return setFormError('Company name is required.');
        if (!form.message.trim()) return setFormError('Testimonial message is required.');
        if (form.rating < 1 || form.rating > 5) return setFormError('Rating must be between 1 and 5.');

        saveMutation.mutate(form);
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Delete this testimonial? This action cannot be undone.')) return;
        deleteMutation.mutate(id);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">Testimonials</h2>
                    <p className="text-sm text-dark-400 mt-1">
                        Manage client testimonials displayed on the home page carousel.
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/20"
                >
                    <HiPlus className="w-4 h-4" />
                    Add Testimonial
                </button>
            </div>

            {/* ── Form Panel ──────────────────────────────────────────────── */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-primary-100 ring-1 ring-primary-50 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-heading font-semibold text-dark-900">
                            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </h3>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="p-2 rounded-lg text-dark-400 hover:bg-gray-100 transition-colors"
                            aria-label="Close form"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {formError && (
                        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <label className={labelCls}>
                                <span className={spanCls}>Client Name *</span>
                                <input
                                    id="testimonial-name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputCls}
                                    placeholder="e.g. Sarah Chen"
                                    maxLength={100}
                                    required
                                />
                            </label>

                            {/* Role */}
                            <label className={labelCls}>
                                <span className={spanCls}>Job Title / Role *</span>
                                <input
                                    id="testimonial-role"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className={inputCls}
                                    placeholder="e.g. CEO"
                                    maxLength={100}
                                    required
                                />
                            </label>

                            {/* Company */}
                            <label className={labelCls}>
                                <span className={spanCls}>Company *</span>
                                <input
                                    id="testimonial-company"
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    className={inputCls}
                                    placeholder="e.g. TechFlow Inc."
                                    maxLength={100}
                                    required
                                />
                            </label>

                            {/* Avatar URL */}
                            <label className={labelCls}>
                                <span className={spanCls}>Avatar URL (optional)</span>
                                <input
                                    id="testimonial-avatar"
                                    value={form.avatar}
                                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                                    className={inputCls}
                                    placeholder="https://… or leave blank for initials"
                                />
                            </label>

                            {/* Message */}
                            <label className={`${labelCls} md:col-span-2`}>
                                <span className={spanCls}>Testimonial Message *</span>
                                <textarea
                                    id="testimonial-message"
                                    rows={4}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className={inputCls}
                                    placeholder="What did the client say about working with Scalax Labs?"
                                    maxLength={1000}
                                    required
                                />
                                <span className="text-[11px] text-dark-400">
                                    {form.message.length}/1000 characters
                                </span>
                            </label>

                            {/* Rating */}
                            <div className={labelCls}>
                                <span className={spanCls}>Rating *</span>
                                <StarPicker
                                    value={form.rating}
                                    onChange={(v) => setForm({ ...form, rating: v })}
                                />
                                <span className="text-[11px] text-dark-400">{form.rating}/5 stars</span>
                            </div>

                            {/* Display Order */}
                            <label className={labelCls}>
                                <span className={spanCls}>Display Order</span>
                                <input
                                    id="testimonial-order"
                                    type="number"
                                    min={0}
                                    value={form.order}
                                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                                    className={inputCls}
                                    placeholder="0"
                                />
                                <span className="text-[11px] text-dark-400">Lower numbers appear first.</span>
                            </label>

                            {/* Active toggle */}
                            <div className="md:col-span-2 flex items-center gap-3">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={form.isActive}
                                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.isActive ? 'bg-primary-500' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                                <span className="text-sm text-dark-600">
                                    {form.isActive ? 'Active — visible on home page' : 'Hidden — not shown publicly'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-dark-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saveMutation.isPending}
                                className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60 transition-colors"
                            >
                                {saveMutation.isPending
                                    ? 'Saving…'
                                    : editingId
                                        ? 'Update Testimonial'
                                        : 'Create Testimonial'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Testimonials List ────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-heading font-semibold text-dark-900">
                        All Testimonials{' '}
                        <span className="ml-2 text-xs font-normal text-dark-400">
                            ({items.length} total ·{' '}
                            {items.filter((t) => t.isActive).length} active)
                        </span>
                    </h3>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 p-5 animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-full bg-gray-200" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                        <div className="h-3 w-24 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-gray-100 rounded" />
                                    <div className="h-3 w-5/6 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                            <HiStar className="w-8 h-8 text-primary-400" />
                        </div>
                        <h4 className="text-base font-semibold text-dark-800 mb-1">No testimonials yet</h4>
                        <p className="text-sm text-dark-400 mb-5">
                            Add your first testimonial to display it in the home page carousel.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                        >
                            <HiPlus className="w-4 h-4" />
                            Add First Testimonial
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <TestimonialCard
                                key={item._id}
                                item={item}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => item._id && handleDelete(item._id)}
                                onToggle={() =>
                                    item._id &&
                                    toggleMutation.mutate({ id: item._id, isActive: !item.isActive })
                                }
                                isDeleting={deletingId === item._id}
                                isToggling={togglingId === item._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
