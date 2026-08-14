import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HiCheckCircle, HiXCircle, HiPlus, HiTrash } from 'react-icons/hi';
import api from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface TrustedBrand {
  name: string;
  logo: string;
}

interface LogoSettings {
  text: string;
  siteName: string;
  colorFrom: string;
  colorTo: string;
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentTextColor: string;
}

interface SettingsForm {
  // General
  siteName: string;
  tagline: string;
  description: string;
  // Contact
  contactEmail: string;
  phone: string;
  address: string;
  // Branding
  primaryColor: string;
  accentColor: string;
  // SEO
  seoTitle: string;
  seoDescription: string;
  // Hero
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroHighlight: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCta: string;
  heroSecondaryCtaLink: string;
  heroTrustedLabel: string;
  heroTrustedBrands: TrustedBrand[];
  // Logo Settings
  logo: LogoSettings;
  // About Page Settings
  aboutHeading: string;
  aboutDescription: string;
  aboutStoryTitle: string;
  aboutStoryText1: string;
  aboutStoryText2: string;
  aboutStoryText3: string;
  aboutStatYears: string;
  aboutStatProjects: string;
  aboutStatClients: string;
  aboutStatSatisfaction: string;
  theme: ThemeSettings;
}

const initialState: SettingsForm = {
  siteName: 'Scalax Labs',
  tagline: 'Growth-driven digital strategy',
  description: '',
  contactEmail: '',
  phone: '',
  address: '',
  primaryColor: '#6366f1',
  accentColor: '#a855f7',
  seoTitle: 'Scalax Labs | Digital Marketing Agency',
  seoDescription: '',
  heroBadge: 'Digital growth partner for ambitious brands',
  heroTitleLine1: 'Growth-driven',
  heroTitleLine2: 'digital',
  heroHighlight: 'strategy',
  heroDescription: '',
  heroPrimaryCta: 'Start your project',
  heroPrimaryCtaLink: '/book-consultation',
  heroSecondaryCta: 'See our work',
  heroSecondaryCtaLink: '/portfolio',
  heroTrustedLabel: 'Trusted by Industry Leaders',
  heroTrustedBrands: [
    { name: 'TechFlow', logo: '' },
    { name: 'CloudBase', logo: '' },
    { name: 'DataSync', logo: '' },
    { name: 'PixelEdge', logo: '' },
    { name: 'VivaNova', logo: '' },
    { name: 'BlueShift', logo: '' },
  ],
  logo: {
    text: 'N',
    siteName: 'NexusDigital',
    colorFrom: '#9333ea',
    colorTo: '#4f46e5',
  },
  aboutHeading: 'We Build Digital Experiences That Matter',
  aboutDescription: 'Founded in 2012, Scalax Labs has grown from a small team of passionate digital enthusiasts to a full-service agency serving 150+ clients worldwide.',
  aboutStoryTitle: 'Our Story',
  aboutStoryText1: "What started as a passion project in a small garage has evolved into one of the most trusted digital marketing agencies in the industry. Our journey has been fueled by curiosity, innovation, and an unwavering commitment to our clients' success.",
  aboutStoryText2: "Over the past 12 years, we've delivered 500+ successful projects across various industries — from ambitious startups to Fortune 500 companies. We've built websites, designed brands, launched campaigns, and most importantly, created lasting partnerships.",
  aboutStoryText3: "Today, our team of 50+ experts continues to push boundaries, embracing new technologies and strategies to help businesses thrive in an ever-evolving digital landscape.",
  aboutStatYears: '12+',
  aboutStatProjects: '500+',
  aboutStatClients: '150+',
  aboutStatSatisfaction: '98%',
  theme: {
    primaryColor: '#9333ea',
    secondaryColor: '#4f46e5',
    accentTextColor: '#9333ea',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared input / textarea classes
// ─────────────────────────────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100';
const labelCls = 'space-y-1';
const spanCls = 'text-xs font-semibold uppercase tracking-wide text-dark-500';

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SettingsForm>(initialState);

  // Inline save state — avoids alert() and shows feedback in-page
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // ── Fetch current settings from the admin endpoint ───────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/settings');
      return data.data as SettingsForm & { heroTrustedBrands?: TrustedBrand[] };
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...initialState,
        ...data,
        logo: data.logo ? { ...initialState.logo, ...data.logo } : initialState.logo,
        theme: data.theme ? { ...initialState.theme, ...data.theme } : initialState.theme,
        // Ensure heroTrustedBrands is always a clean array
        heroTrustedBrands:
          Array.isArray(data.heroTrustedBrands) && data.heroTrustedBrands.length > 0
            ? data.heroTrustedBrands.map((b) => ({ name: b.name || '', logo: b.logo || '' }))
            : initialState.heroTrustedBrands,
      });
    }
  }, [data]);

  // ── Mutation: PUT /api/admin/settings ────────────────────────────────
  const mutation = useMutation({
    mutationFn: async (payload: SettingsForm) => {
      const { data } = await api.put('/admin/settings', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      // Also bust the public CMS cache so the homepage reflects changes
      queryClient.invalidateQueries({ queryKey: ['cms-settings'] });
      setSaveStatus('success');
      setSaveMessage('Hero settings updated successfully.');
      // Auto-clear after 4 s
      setTimeout(() => setSaveStatus('idle'), 4000);
    },
    onError: (error: any) => {
      setSaveStatus('error');
      setSaveMessage(
        error.response?.data?.message ||
        'Failed to save settings. Please try again.'
      );
    },
  });

  // ── Generic field change ─────────────────────────────────────────────
  const handleChange = (key: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoChange = (key: keyof LogoSettings, value: string) => {
    setForm((prev) => ({
      ...prev,
      logo: {
        ...prev.logo,
        [key]: value,
      },
    }));
  };

  const handleThemeChange = (key: keyof ThemeSettings, value: string) => {
    setForm((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value,
      },
    }));
  };

  // ── Trusted brand helpers ────────────────────────────────────────────
  const updateBrand = (idx: number, field: keyof TrustedBrand, value: string) => {
    setForm((prev) => {
      const brands = [...prev.heroTrustedBrands];
      brands[idx] = { ...brands[idx], [field]: value };
      return { ...prev, heroTrustedBrands: brands };
    });
  };

  const addBrand = () => {
    setForm((prev) => ({
      ...prev,
      heroTrustedBrands: [...prev.heroTrustedBrands, { name: '', logo: '' }],
    }));
  };

  const removeBrand = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      heroTrustedBrands: prev.heroTrustedBrands.filter((_, i) => i !== idx),
    }));
  };

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setSaveMessage('');
    mutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark-900">Website Settings</h2>
        <p className="text-sm text-dark-400 mt-1">
          Update your site title, branding, contact info, and homepage Hero content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── General ─────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-base font-heading font-semibold text-dark-900 mb-4">General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className={labelCls}>
              <span className={spanCls}>Site name</span>
              <input id="settings-siteName" value={form.siteName} onChange={(e) => handleChange('siteName', e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Tagline</span>
              <input id="settings-tagline" value={form.tagline} onChange={(e) => handleChange('tagline', e.target.value)} className={inputCls} />
            </label>
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Business description</span>
              <textarea id="settings-description" rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Contact email</span>
              <input id="settings-contactEmail" type="email" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Phone</span>
              <input id="settings-phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputCls} />
            </label>
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Address</span>
              <input id="settings-address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Primary color</span>
              <input id="settings-primaryColor" type="color" value={form.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-2" />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Accent color</span>
              <input id="settings-accentColor" type="color" value={form.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-2" />
            </label>
          </div>
        </section>

        {/* ── Branding & Theme Colors ─────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <div>
            <h3 className="text-base font-heading font-semibold text-dark-900">Branding & Theme Colors</h3>
            <p className="text-sm text-dark-400 mt-1">Configure the global brand gradients and accent text colors used throughout the frontend.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <label className={labelCls}>
              <span className={spanCls}>Primary Theme Color</span>
              <div className="flex gap-2 items-center">
                <input
                  id="theme-primaryColor"
                  type="color"
                  value={form.theme?.primaryColor || '#9333ea'}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="h-12 w-20 rounded-xl border border-gray-200 bg-gray-50 p-1 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.theme?.primaryColor || '#9333ea'}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className={inputCls}
                  placeholder="#9333ea"
                />
              </div>
            </label>

            <label className={labelCls}>
              <span className={spanCls}>Secondary Theme Color</span>
              <div className="flex gap-2 items-center">
                <input
                  id="theme-secondaryColor"
                  type="color"
                  value={form.theme?.secondaryColor || '#4f46e5'}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="h-12 w-20 rounded-xl border border-gray-200 bg-gray-50 p-1 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.theme?.secondaryColor || '#4f46e5'}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className={inputCls}
                  placeholder="#4f46e5"
                />
              </div>
            </label>

            <label className={labelCls}>
              <span className={spanCls}>Accent Text Color</span>
              <div className="flex gap-2 items-center">
                <input
                  id="theme-accentTextColor"
                  type="color"
                  value={form.theme?.accentTextColor || '#9333ea'}
                  onChange={(e) => handleThemeChange('accentTextColor', e.target.value)}
                  className="h-12 w-20 rounded-xl border border-gray-200 bg-gray-50 p-1 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.theme?.accentTextColor || '#9333ea'}
                  onChange={(e) => handleThemeChange('accentTextColor', e.target.value)}
                  className={inputCls}
                  placeholder="#9333ea"
                />
              </div>
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/50 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-500">Live Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center py-4 bg-white/70 backdrop-blur rounded-xl border border-white/50">

              {/* Badge Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Badge</span>
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${form.theme?.primaryColor || '#9333ea'} 10%, white)`,
                    borderColor: `color-mix(in srgb, ${form.theme?.primaryColor || '#9333ea'} 20%, white)`,
                    color: form.theme?.primaryColor || '#9333ea'
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: form.theme?.primaryColor || '#9333ea' }}
                  />
                  Live Badge Preview
                </span>
              </div>

              {/* Gradient Text Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Gradient Text</span>
                <span
                  className="text-2xl font-bold font-heading"
                  style={{
                    background: `linear-gradient(135deg, ${form.theme?.primaryColor || '#9333ea'}, ${form.theme?.secondaryColor || '#4f46e5'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Scalax Labs
                </span>
              </div>

              {/* Button Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Button</span>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${form.theme?.primaryColor || '#9333ea'}, ${form.theme?.secondaryColor || '#4f46e5'})`,
                    boxShadow: `0 4px 12px color-mix(in srgb, ${form.theme?.primaryColor || '#9333ea'} 30%, transparent)`
                  }}
                >
                  Action Button
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ── Logo & Brand Identity ───────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-base font-heading font-semibold text-dark-900 mb-4">Logo & Brand Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <label className={labelCls}>
              <span className={spanCls}>Logo Badge Text / Initials (Max 3 Chars)</span>
              <input
                id="logo-text"
                value={form.logo?.text || ''}
                maxLength={3}
                onChange={(e) => handleLogoChange('text', e.target.value)}
                className={inputCls}
                placeholder="e.g. N"
              />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Logo Brand Name</span>
              <input
                id="logo-siteName"
                value={form.logo?.siteName || ''}
                onChange={(e) => handleLogoChange('siteName', e.target.value)}
                className={inputCls}
                placeholder="e.g. NexusDigital"
              />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Logo Gradient - Start Color</span>
              <input
                id="logo-colorFrom"
                type="color"
                value={form.logo?.colorFrom || '#9333ea'}
                onChange={(e) => handleLogoChange('colorFrom', e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-2"
              />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Logo Gradient - End Color</span>
              <input
                id="logo-colorTo"
                type="color"
                value={form.logo?.colorTo || '#4f46e5'}
                onChange={(e) => handleLogoChange('colorTo', e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-2 py-2"
              />
            </label>
          </div>

          {/* Live Preview */}
          <div className="border border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-500 block mb-3">Live Logo Preview</span>
            <div className="flex items-center gap-2 max-w-fit bg-white/80 backdrop-blur-xl border border-gray-200/50 px-4 py-2.5 rounded-xl shadow-sm">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg font-heading shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${form.logo?.colorFrom || '#9333ea'}, ${form.logo?.colorTo || '#4f46e5'})`
                }}
              >
                {form.logo?.text || 'N'}
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-dark-900">
                {form.logo?.siteName || 'NexusDigital'}
              </span>
            </div>
          </div>
        </section>

        {/* ── SEO ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-base font-heading font-semibold text-dark-900 mb-4">SEO</h3>
          <div className="grid grid-cols-1 gap-5">
            <label className={labelCls}>
              <span className={spanCls}>SEO title</span>
              <input id="settings-seoTitle" value={form.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>SEO description</span>
              <textarea id="settings-seoDescription" rows={3} value={form.seoDescription} onChange={(e) => handleChange('seoDescription', e.target.value)} className={inputCls} />
            </label>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
                    HOMEPAGE HERO
                ═══════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-primary-100 p-6 ring-1 ring-primary-50">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            <div>
              <h3 className="text-base font-heading font-semibold text-dark-900">Homepage Hero</h3>
              <p className="text-xs text-dark-400 mt-0.5">All content below is fetched live from the database — no Vercel rebuild needed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Badge */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Badge / Eyebrow text</span>
              <input
                id="hero-badge"
                value={form.heroBadge}
                onChange={(e) => handleChange('heroBadge', e.target.value)}
                className={inputCls}
                placeholder="e.g. Digital growth partner for ambitious brands"
              />
            </label>

            {/* Title preview hint */}
            <div className="md:col-span-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-3 text-xs text-dark-500">
              <span className="font-semibold text-dark-700">Heading preview: </span>
              <span className="font-bold text-dark-900">{form.heroTitleLine1 || '…'}</span>
              {' / '}
              <span className="text-dark-700">{form.heroTitleLine2 || '…'} </span>
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent font-bold">{form.heroHighlight || '…'}</span>
            </div>

            {/* Title Line 1 */}
            <label className={labelCls}>
              <span className={spanCls}>Heading — Line 1 (plain)</span>
              <input
                id="hero-titleLine1"
                value={form.heroTitleLine1}
                onChange={(e) => handleChange('heroTitleLine1', e.target.value)}
                className={inputCls}
                placeholder="e.g. Growth-driven"
              />
            </label>

            {/* Title Line 2 */}
            <label className={labelCls}>
              <span className={spanCls}>Heading — Line 2 (plain prefix)</span>
              <input
                id="hero-titleLine2"
                value={form.heroTitleLine2}
                onChange={(e) => handleChange('heroTitleLine2', e.target.value)}
                className={inputCls}
                placeholder="e.g. digital"
              />
            </label>

            {/* Highlighted word */}
            <label className={labelCls}>
              <span className={spanCls}>Heading — Highlighted word (gradient)</span>
              <input
                id="hero-highlight"
                value={form.heroHighlight}
                onChange={(e) => handleChange('heroHighlight', e.target.value)}
                className={`${inputCls} font-semibold text-primary-600`}
                placeholder="e.g. strategy"
              />
            </label>

            {/* Description */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Hero description</span>
              <textarea
                id="hero-description"
                rows={3}
                value={form.heroDescription}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                className={inputCls}
                placeholder="Short paragraph shown below the main heading."
              />
            </label>

            {/* Primary CTA */}
            <label className={labelCls}>
              <span className={spanCls}>Primary button label</span>
              <input
                id="hero-primaryCta"
                value={form.heroPrimaryCta}
                onChange={(e) => handleChange('heroPrimaryCta', e.target.value)}
                className={inputCls}
                placeholder="e.g. Start your project"
              />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Primary button link</span>
              <input
                id="hero-primaryCtaLink"
                value={form.heroPrimaryCtaLink}
                onChange={(e) => handleChange('heroPrimaryCtaLink', e.target.value)}
                className={inputCls}
                placeholder="e.g. /book-consultation"
              />
            </label>

            {/* Secondary CTA */}
            <label className={labelCls}>
              <span className={spanCls}>Secondary button label</span>
              <input
                id="hero-secondaryCta"
                value={form.heroSecondaryCta}
                onChange={(e) => handleChange('heroSecondaryCta', e.target.value)}
                className={inputCls}
                placeholder="e.g. See our work"
              />
            </label>
            <label className={labelCls}>
              <span className={spanCls}>Secondary button link</span>
              <input
                id="hero-secondaryCtaLink"
                value={form.heroSecondaryCtaLink}
                onChange={(e) => handleChange('heroSecondaryCtaLink', e.target.value)}
                className={inputCls}
                placeholder="e.g. /portfolio"
              />
            </label>

            {/* Trusted label */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Trusted brands label</span>
              <input
                id="hero-trustedLabel"
                value={form.heroTrustedLabel}
                onChange={(e) => handleChange('heroTrustedLabel', e.target.value)}
                className={inputCls}
                placeholder="e.g. Trusted by Industry Leaders"
              />
            </label>
          </div>

          {/* ── Trusted Brands ─────────────────────────────── */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between mb-4">
              <span className={spanCls}>Trusted brands</span>
              <button
                type="button"
                onClick={addBrand}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition"
              >
                <HiPlus className="w-3.5 h-3.5" /> Add brand
              </button>
            </div>

            <div className="space-y-3">
              {form.heroTrustedBrands.map((brand, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      id={`hero-brand-name-${idx}`}
                      value={brand.name}
                      onChange={(e) => updateBrand(idx, 'name', e.target.value)}
                      className={inputCls}
                      placeholder={`Brand ${idx + 1} name`}
                    />
                    <input
                      id={`hero-brand-logo-${idx}`}
                      value={brand.logo}
                      onChange={(e) => updateBrand(idx, 'logo', e.target.value)}
                      className={inputCls}
                      placeholder="Logo URL (optional)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBrand(idx)}
                    className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                    aria-label={`Remove brand ${idx + 1}`}
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About Page Content ─────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-dark-900">About Page Content</h3>
            <p className="text-sm text-dark-400 mt-1">Manage the narrative and stat elements shown on the /about page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heading */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>About Heading</span>
              <input
                id="about-heading"
                value={form.aboutHeading}
                onChange={(e) => handleChange('aboutHeading', e.target.value)}
                className={inputCls}
                placeholder="e.g. We Build Digital Experiences That Matter"
              />
            </label>

            {/* Description */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>About Description</span>
              <textarea
                id="about-description"
                rows={2}
                value={form.aboutDescription}
                onChange={(e) => handleChange('aboutDescription', e.target.value)}
                className={inputCls}
                placeholder="Brief introduction text displayed below the main heading."
              />
            </label>

            {/* Story Title */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Story Title</span>
              <input
                id="about-storyTitle"
                value={form.aboutStoryTitle}
                onChange={(e) => handleChange('aboutStoryTitle', e.target.value)}
                className={inputCls}
                placeholder="e.g. Our Story"
              />
            </label>

            {/* Story Text 1 */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Story Paragraph 1</span>
              <textarea
                id="about-storyText1"
                rows={3}
                value={form.aboutStoryText1}
                onChange={(e) => handleChange('aboutStoryText1', e.target.value)}
                className={inputCls}
                placeholder="First paragraph of your storytelling component."
              />
            </label>

            {/* Story Text 2 */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Story Paragraph 2</span>
              <textarea
                id="about-storyText2"
                rows={3}
                value={form.aboutStoryText2}
                onChange={(e) => handleChange('aboutStoryText2', e.target.value)}
                className={inputCls}
                placeholder="Second paragraph of your storytelling component."
              />
            </label>

            {/* Story Text 3 */}
            <label className={`${labelCls} md:col-span-2`}>
              <span className={spanCls}>Story Paragraph 3</span>
              <textarea
                id="about-storyText3"
                rows={3}
                value={form.aboutStoryText3}
                onChange={(e) => handleChange('aboutStoryText3', e.target.value)}
                className={inputCls}
                placeholder="Third paragraph of your storytelling component."
              />
            </label>

            {/* Stats */}
            <label className={labelCls}>
              <span className={spanCls}>Years Experience Stat</span>
              <input
                id="about-statYears"
                value={form.aboutStatYears}
                onChange={(e) => handleChange('aboutStatYears', e.target.value)}
                className={inputCls}
                placeholder="e.g. 12+"
              />
            </label>

            <label className={labelCls}>
              <span className={spanCls}>Projects Delivered Stat</span>
              <input
                id="about-statProjects"
                value={form.aboutStatProjects}
                onChange={(e) => handleChange('aboutStatProjects', e.target.value)}
                className={inputCls}
                placeholder="e.g. 500+"
              />
            </label>

            <label className={labelCls}>
              <span className={spanCls}>Happy Clients Stat</span>
              <input
                id="about-statClients"
                value={form.aboutStatClients}
                onChange={(e) => handleChange('aboutStatClients', e.target.value)}
                className={inputCls}
                placeholder="e.g. 150+"
              />
            </label>

            <label className={labelCls}>
              <span className={spanCls}>Client Satisfaction Stat</span>
              <input
                id="about-statSatisfaction"
                value={form.aboutStatSatisfaction}
                onChange={(e) => handleChange('aboutStatSatisfaction', e.target.value)}
                className={inputCls}
                placeholder="e.g. 98%"
              />
            </label>
          </div>
        </section>

        {/* ── Save Button & Status ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 px-6 py-4">
          {/* Inline status banner */}
          <div className="flex-1">
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
                ✓ {saveMessage}
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <HiXCircle className="w-5 h-5 flex-shrink-0" />
                {saveMessage}
              </div>
            )}
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-xl px-4 py-2.5">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </div>
            )}
          </div>

          <button
            id="hero-save-btn"
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {mutation.isPending ? 'Saving…' : 'Save settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
