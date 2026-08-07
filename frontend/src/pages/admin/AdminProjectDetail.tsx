import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    HiArrowLeft, HiCalendar, HiClock, HiCheckCircle, HiPlus,
    HiTrash, HiDownload, HiClipboardList, HiExternalLink,
} from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Project, Milestone } from '@/types';

export default function AdminProjectDetail() {
    const { id } = useParams();
    const queryClient = useQueryClient();

    // Local state
    const [progress, setProgress] = useState<number>(0);
    const [status, setStatus] = useState<string>('pending');

    // Deliverable state
    const [delivName, setDelivName] = useState('');
    const [delivUrl, setDelivUrl] = useState('');

    // Note state
    const [noteContent, setNoteContent] = useState('');

    // Milestone state
    const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
    const [newMilestoneDue, setNewMilestoneDue] = useState('');

    const { data: project, isLoading } = useQuery<Project>({
        queryKey: ['admin-project-detail', id],
        queryFn: async () => {
            const { data } = await api.get(`/projects/${id}`);
            return data.data;
        },
    });

    useEffect(() => {
        if (project) {
            setProgress(project.progress);
            setStatus(project.status);
        }
    }, [project]);

    const updateProjectMutation = useMutation({
        mutationFn: (updatedFields: Partial<Project>) => api.put(`/projects/${id}`, updatedFields),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
            alert('Project updated successfully!');
        },
    });

    const addDeliverableMutation = useMutation({
        mutationFn: (newDeliv: { name: string; fileUrl: string }) => api.post(`/projects/${id}/deliverables`, newDeliv),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
            setDelivName('');
            setDelivUrl('');
        },
    });

    const removeDeliverableMutation = useMutation({
        mutationFn: (delivId: string) => api.delete(`/projects/${id}/deliverables/${delivId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
        },
    });

    const updateMilestonesMutation = useMutation({
        mutationFn: (milestones: Milestone[]) => api.put(`/projects/${id}/milestones`, { milestones }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
            setNewMilestoneTitle('');
            setNewMilestoneDue('');
        },
    });

    const addNoteMutation = useMutation({
        mutationFn: (content: string) => api.post(`/projects/${id}/notes`, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
            setNoteContent('');
        },
    });

    if (isLoading) return <LoadingSpinner size="lg" />;
    if (!project) return <div className="text-center py-12">Project not found</div>;

    const handleMetaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProjectMutation.mutate({ progress, status: status as any });
    };

    const handleAddDeliverable = (e: React.FormEvent) => {
        e.preventDefault();
        if (!delivName || !delivUrl) return;
        addDeliverableMutation.mutate({ name: delivName, fileUrl: delivUrl });
    };

    const handleAddMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMilestoneTitle) return;
        const currentMilestones: any[] = project.milestones.map(m => ({
            title: m.title,
            description: m.description,
            status: m.status,
            dueDate: m.dueDate,
        }));
        currentMilestones.push({
            title: newMilestoneTitle,
            description: '',
            status: 'pending',
            dueDate: newMilestoneDue || undefined,
        });
        updateMilestonesMutation.mutate(currentMilestones);
    };

    const toggleMilestone = (index: number) => {
        const currentMilestones = project.milestones.map((m, idx) => ({
            title: m.title,
            description: m.description,
            status: idx === index ? (m.status === 'completed' ? 'pending' : 'completed') : m.status,
            dueDate: m.dueDate,
        }));
        updateMilestonesMutation.mutate(currentMilestones as Milestone[]);
    };

    const deleteMilestone = (index: number) => {
        if (!confirm('Remove milestone?')) return;
        const currentMilestones = project.milestones.filter((_, idx) => idx !== index).map(m => ({
            title: m.title,
            description: m.description,
            status: m.status,
            dueDate: m.dueDate,
        }));
        updateMilestonesMutation.mutate(currentMilestones as Milestone[]);
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteContent.trim()) return;
        addNoteMutation.mutate(noteContent.trim());
    };

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-3">
                <Link to="/admin/projects" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <HiArrowLeft className="w-5 h-5 text-dark-500" />
                </Link>
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">{project.title}</h2>
                    <p className="text-sm text-dark-400">
                        Client: {typeof project.client === 'object' ? project.client.name : 'Unknown'}
                    </p>
                </div>
            </div>

            {/* Project Status/Progress Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 lg:col-span-1">
                    <h3 className="font-heading font-semibold text-dark-900 border-b border-gray-100 pb-2">Status & Progress</h3>
                    <form onSubmit={handleMetaSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Progress ({progress}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) => setProgress(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={updateProjectMutation.isPending}
                            className="w-full py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 text-sm font-semibold transition-colors"
                        >
                            Save Settings
                        </button>
                    </form>
                </div>

                {/* Milestones Panel */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 lg:col-span-2">
                    <h3 className="font-heading font-semibold text-dark-900 border-b border-gray-100 pb-2">Milestone Checklist</h3>

                    <form onSubmit={handleAddMilestone} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Milestone Title"
                                required
                                value={newMilestoneTitle}
                                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <input
                                type="date"
                                value={newMilestoneDue}
                                onChange={(e) => setNewMilestoneDue(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                        </div>
                        <button type="submit" className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl">
                            <HiPlus className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="space-y-2">
                        {project.milestones.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => toggleMilestone(idx)} className="text-dark-400 hover:text-green-500">
                                        {m.status === 'completed' ? (
                                            <HiCheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                        )}
                                    </button>
                                    <div>
                                        <p className={`text-sm font-medium ${m.status === 'completed' ? 'line-through text-dark-400' : 'text-dark-900'}`}>{m.title}</p>
                                        {m.dueDate && <p className="text-[10px] text-dark-400">Due: {new Date(m.dueDate).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                                <button onClick={() => deleteMilestone(idx)} className="text-dark-400 hover:text-red-500">
                                    <HiTrash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deliverables Panel */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-heading font-semibold text-dark-900 border-b border-gray-100 pb-2">Client Deliverables</h3>

                    <form onSubmit={handleAddDeliverable} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="File Name (e.g. Design Proposal)"
                                required
                                value={delivName}
                                onChange={(e) => setDelivName(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                            />
                            <input
                                type="url"
                                placeholder="File URL (Google Drive, Cloudinary, etc.)"
                                required
                                value={delivUrl}
                                onChange={(e) => setDelivUrl(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-primary-500 text-white rounded-xl text-xs font-semibold hover:bg-primary-600">
                            Upload Assets Link
                        </button>
                    </form>

                    <div className="space-y-2">
                        {project.deliverables.map((deliv) => (
                            <div key={deliv._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-dark-900">{deliv.name}</p>
                                    <a href={deliv.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 flex items-center gap-1.5 mt-0.5">
                                        Open Link <HiExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                                <button onClick={() => removeDeliverableMutation.mutate(deliv._id)} className="text-dark-400 hover:text-red-500">
                                    <HiTrash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Notes Panel */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-heading font-semibold text-dark-900 border-b border-gray-100 pb-2">Internal Audit Notes</h3>

                    <form onSubmit={handleAddNote} className="space-y-2">
                        <textarea
                            rows={3}
                            placeholder="Add internal notes visible to both admin and clients..."
                            required
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                        />
                        <button type="submit" className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold">
                            Add Note
                        </button>
                    </form>

                    <div className="space-y-3">
                        {project.notes.map((note) => (
                            <div key={note._id} className="p-3 rounded-lg bg-gray-50 space-y-1">
                                <p className="text-sm text-dark-700">{note.content}</p>
                                <p className="text-[10px] text-dark-400">
                                    {typeof note.createdBy === 'object' ? note.createdBy.name : 'Admin'} • {new Date(note.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
