import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type PortfolioItem = {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  results: string[];
  color: string;
  isFeatured: boolean;
  isActive: boolean;
};

const emptyForm: PortfolioItem = {
  title: '',
  slug: '',
  category: 'Website',
  description: '',
  results: [''],
  color: 'from-blue-500 to-indigo-600',
  isFeatured: false,
  isActive: true,
};

export default function AdminPortfolio() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PortfolioItem>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: async () => {
      const { data } = await api.get('/admin/portfolio');
      return data.data as PortfolioItem[];
    },
  });

  const items = useMemo(() => data || [], [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: PortfolioItem) => {
      if (editingId) {
        return (await api.put(`/admin/portfolio/${editingId}`, payload)).data;
      }
      return (await api.post('/admin/portfolio', payload)).data;
    },
    onSuccess: () => {
      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['cms-portfolio'] });
      alert('Portfolio item saved successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to save portfolio item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/portfolio/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['cms-portfolio'] });
      alert('Portfolio item deleted');
    },
  });

  const handleFeatureChange = (index: number, value: string) => {
    const next = [...(form.results || [])];
    next[index] = value;
    setForm({ ...form, results: next });
  };

  const addResult = () => setForm({ ...form, results: [...(form.results || []), ''] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, results: (form.results || []).filter(Boolean) });
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item._id || null);
    setForm({ ...item, results: item.results?.length ? item.results : [''] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark-900">Portfolio CMS</h2>
        <p className="text-sm text-dark-400 mt-1">Manage projects, categories, and results shown on the portfolio page.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">{editingId ? 'Edit portfolio item' : 'Add new portfolio item'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Title</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" required />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Slug</span>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Category</span>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Description</span>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Gradient class</span>
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="flex items-center gap-2 text-sm text-dark-600">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-dark-600">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Results</span>
                <button type="button" onClick={addResult} className="text-xs font-semibold text-primary-600">+ Add result</button>
              </div>
              {(form.results || []).map((result, index) => (
                <input key={index} value={result} onChange={(e) => handleFeatureChange(index, e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" placeholder="Result label" />
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-dark-600">Cancel</button>
              )}
              <button type="submit" disabled={saveMutation.isPending} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update item' : 'Create item'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">Current portfolio</h3>
          <div className="space-y-3">
            {isLoading ? <p className="text-sm text-dark-500">Loading portfolio items...</p> : items.map((item) => (
              <div key={item._id || item.slug} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark-900">{item.title}</p>
                    <p className="text-xs text-dark-400">{item.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {item.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-dark-500">{item.description}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => handleEdit(item)} className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600">Edit</button>
                  <button type="button" onClick={() => item._id && deleteMutation.mutate(item._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
