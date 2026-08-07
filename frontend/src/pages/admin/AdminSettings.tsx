import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const initialState = {
  siteName: 'NexusDigital',
  tagline: 'Growth-driven digital strategy',
  description: '',
  contactEmail: 'priyadharshanganeshan2004@gmail.com',
  phone: '+91 9080399984',
  address: '123 Business Avenue, New York, NY',
  primaryColor: '#6366f1',
  accentColor: '#a855f7',
  seoTitle: 'NexusDigital | Digital Marketing Agency',
  seoDescription: '',
  heroBadge: 'Digital growth partner for ambitious brands',
  heroTitle: 'Growth-driven digital strategy',
  heroDescription: '',
  heroPrimaryCta: 'Start your project',
  heroSecondaryCta: 'See our work',
};

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialState);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/settings');
      return data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({ ...initialState, ...data });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload: typeof initialState) => {
      const { data } = await api.put('/admin/settings', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      alert('Website settings updated successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update settings');
    },
  });

  const handleChange = (key: keyof typeof initialState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) return <div className="rounded-xl bg-white p-8 text-sm text-dark-500">Loading website settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark-900">Website Settings</h2>
        <p className="text-sm text-dark-400 mt-1">Update your site title, branding, contact info, and home page hero content.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Site name</span>
            <input value={form.siteName} onChange={(e) => handleChange('siteName', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Tagline</span>
            <input value={form.tagline} onChange={(e) => handleChange('tagline', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Business description</span>
            <textarea rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Contact email</span>
            <input value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Phone</span>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Address</span>
            <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Primary color</span>
            <input type="color" value={form.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-2" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Accent color</span>
            <input type="color" value={form.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-2" />
          </label>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">SEO & hero section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">SEO title</span>
              <input value={form.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">SEO description</span>
              <textarea rows={3} value={form.seoDescription} onChange={(e) => handleChange('seoDescription', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Hero badge</span>
              <input value={form.heroBadge} onChange={(e) => handleChange('heroBadge', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Hero title</span>
              <input value={form.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Hero description</span>
              <textarea rows={3} value={form.heroDescription} onChange={(e) => handleChange('heroDescription', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Primary button label</span>
              <input value={form.heroPrimaryCta} onChange={(e) => handleChange('heroPrimaryCta', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Secondary button label</span>
              <input value={form.heroSecondaryCta} onChange={(e) => handleChange('heroSecondaryCta', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary-400" />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={mutation.isPending} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
