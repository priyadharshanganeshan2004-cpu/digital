import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type ServiceItem = {
  _id?: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  icon: string;
  color: string;
  featured: boolean;
  isActive: boolean;
};

const emptyForm: ServiceItem = {
  title: '',
  slug: '',
  shortDesc: '',
  description: '',
  icon: 'HiCode',
  color: '#6366f1',
  featured: false,
  isActive: true,
};

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ServiceItem>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data } = await api.get('/admin/services');
      return data.data as ServiceItem[];
    },
  });

  const services = useMemo(() => data || [], [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: ServiceItem) => {
      if (editingId) {
        return (await api.put(`/admin/services/${editingId}`, payload)).data;
      }
      return (await api.post('/admin/services', payload)).data;
    },
    onSuccess: () => {
      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['cms-services'] });
      alert('Service saved successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to save service');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/services/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['cms-services'] });
      alert('Service deleted');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service._id || null);
    setForm(service);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark-900">Services CMS</h2>
        <p className="text-sm text-dark-400 mt-1">Create, edit, and manage the services shown on the public website.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">{editingId ? 'Edit service' : 'Add new service'}</h3>
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
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Icon name</span>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Short description</span>
                <textarea rows={2} value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" required />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Description</span>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Color</span>
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-2" />
              </label>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-dark-600">Cancel</button>
              )}
              <button type="submit" disabled={saveMutation.isPending} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update service' : 'Create service'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">Current services</h3>
          <div className="space-y-3">
            {isLoading ? <p className="text-sm text-dark-500">Loading services...</p> : services.map((service) => (
              <div key={service._id || service.slug} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark-900">{service.title}</p>
                    <p className="text-xs text-dark-400">{service.slug}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${service.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {service.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-dark-500">{service.shortDesc}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => handleEdit(service)} className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600">Edit</button>
                  <button type="button" onClick={() => service._id && deleteMutation.mutate(service._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
