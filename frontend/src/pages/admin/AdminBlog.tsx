import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type BlogPost = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  color: string;
  imageUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
};

const emptyForm: BlogPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Marketing',
  author: 'Scalax Labs Team',
  readTime: 5,
  color: 'from-blue-500 to-indigo-600',
  imageUrl: '',
  isPublished: true,
  isFeatured: false,
};

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BlogPost>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const { data } = await api.get('/admin/blog');
      return data.data as BlogPost[];
    },
  });

  const posts = useMemo(() => data || [], [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: BlogPost) => {
      if (editingId) {
        return (await api.put(`/admin/blog/${editingId}`, payload)).data;
      }
      return (await api.post('/admin/blog', payload)).data;
    },
    onSuccess: () => {
      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      alert('Blog post saved successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to save blog post');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/blog/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      alert('Blog post deleted');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post._id || null);
    setForm(post);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark-900">Blog CMS</h2>
        <p className="text-sm text-dark-400 mt-1">Create, publish, and manage articles shown on the public blog page.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">{editingId ? 'Edit blog post' : 'Add new blog post'}</h3>
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
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Author</span>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Read time (min)</span>
                <input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) || 5 })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Gradient class</span>
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Excerpt</span>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" required />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Content</span>
                <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-dark-500">Image URL</span>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </label>
              <div className="md:col-span-2 flex gap-4">
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-dark-600">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                  Published
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-dark-600">Cancel</button>
              )}
              <button type="submit" disabled={saveMutation.isPending} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update post' : 'Create post'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-heading font-semibold text-dark-900 mb-4">Current posts</h3>
          <div className="space-y-3">
            {isLoading ? <p className="text-sm text-dark-500">Loading blog posts...</p> : posts.map((post) => (
              <div key={post._id || post.slug} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark-900">{post.title}</p>
                    <p className="text-xs text-dark-400">{post.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${post.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-dark-500">{post.excerpt}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => handleEdit(post)} className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600">Edit</button>
                  <button type="button" onClick={() => post._id && deleteMutation.mutate(post._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

