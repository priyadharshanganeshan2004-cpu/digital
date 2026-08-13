import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type PlanItem = {
  _id?: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  isPopular: boolean;
  isActive: boolean;
};

const emptyForm: PlanItem = {
  name: '',
  price: '$999',
  period: '/month',
  description: '',
  features: [''],
  ctaText: 'Get Started',
  isPopular: false,
  isActive: true,
};

export default function AdminPricing() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PlanItem>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pricing'],
    queryFn: async () => {
      const { data } = await api.get('/admin/pricing');
      return data.data as PlanItem[];
    },
  });

  const plans = useMemo(() => data || [], [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: PlanItem) => {
      if (editingId) {
        return (await api.put(`/admin/pricing/${editingId}`, payload)).data;
      }
      return (await api.post('/admin/pricing', payload)).data;
    },
    onSuccess: () => {
      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['cms-pricing'] });
      alert('Pricing plan saved successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to save pricing plan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/pricing/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['cms-pricing'] });
      alert('Pricing plan deleted');
    },
  });

  const handleFeatureChange = (index: number, value: string) => {
    const next = [...(form.features || [])];
    next[index] = value;
    setForm({ ...form, features: next });
  };

  const addFeature = () => setForm({ ...form, features: [...(form.features || []), ''] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedFeatures = (form.features || []).filter(Boolean);
    saveMutation.mutate({ ...form, features: cleanedFeatures });
  };

  const handleEdit = (plan: PlanItem) => {
    setEditingId(plan._id || null);
    setForm({ ...plan, features: plan.features?.length ? plan.features : [''] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark-900">Pricing CMS</h2>
        <p className="text-sm text-dark-400 mt-1">Manage plan pricing, highlights, and CTA labels shown on the public website.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">{editingId ? 'Edit pricing plan' : 'Add new plan'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Plan name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" required />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Price</span>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" required />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Billing period</span>
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Description</span>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">CTA label</span>
                <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <div className="md:col-span-2 flex gap-4">
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} />
                  Most popular
                </label>
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  Active
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Features</span>
                <button type="button" onClick={addFeature} className="text-xs font-semibold text-primary-600">+ Add feature</button>
              </div>
              {(form.features || []).map((feature, index) => (
                <input key={index} value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" placeholder="Feature item" />
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-dark-600">Cancel</button>
              )}
              <button type="submit" disabled={saveMutation.isPending} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update plan' : 'Create plan'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">Current plans</h3>
          <div className="space-y-3">
            {isLoading ? <p className="text-sm text-dark-500">Loading pricing plans...</p> : plans.map((plan) => (
              <div key={plan._id || plan.name} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark-900">{plan.name}</p>
                    <p className="text-xs text-dark-400">{plan.price}{plan.period}</p>
                  </div>
                  {plan.isPopular && <span className="rounded-full bg-primary-50 px-2 py-1 text-[10px] font-semibold text-primary-600">Popular</span>}
                </div>
                <p className="mt-2 text-sm text-dark-500">{plan.description}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => handleEdit(plan)} className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600">Edit</button>
                  <button type="button" onClick={() => plan._id && deleteMutation.mutate(plan._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
