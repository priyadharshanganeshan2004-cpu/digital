import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiCollection, HiPlus, HiSearch, HiFilter, HiX, HiEye } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Project, User } from '@/types';

export default function AdminProjects() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);

    // Form inputs state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clientId, setClientId] = useState('');
    const [service, setService] = useState('Website Development');
    const [startDate, setStartDate] = useState('');
    const [estimatedEndDate, setEstimatedEndDate] = useState('');

    const { data: projectsResponse, isLoading: loadingProjects } = useQuery({
        queryKey: ['admin-projects', search, statusFilter],
        queryFn: async () => {
            const { data } = await api.get('/projects', { params: { search, status: statusFilter } });
            return data.data;
        },
    });

    const { data: clientsResponse } = useQuery({
        queryKey: ['admin-clients-list'],
        queryFn: async () => {
            const { data } = await api.get('/admin/clients', { params: { status: 'active' } });
            return data.data;
        },
    });

    const projects = projectsResponse || [];
    const clients = clientsResponse || [];

    const createMutation = useMutation({
        mutationFn: (newProject: any) => api.post('/projects', newProject),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            closeModal();
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Error creating project');
        },
    });

    const closeModal = () => {
        setModalOpen(false);
        setTitle('');
        setDescription('');
        setClientId('');
        setStartDate('');
        setEstimatedEndDate('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            title,
            description,
            client: clientId,
            service,
            startDate,
            estimatedEndDate,
        });
    };

    const services = [
        'Website Development',
        'Mobile App Development',
        'E-Commerce Development',
        'Brand Identity & Logo Design',
        'Social Media Management (SMM)',
        'Pay-Per-Click Advertising (PPC)',
        'Content Marketing & Copywriting',
        'Email Marketing Campaigns',
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">Project Workspace</h2>
                    <p className="text-sm text-dark-400 mt-1">Track workflows, milestones, and deliverables</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto"
                >
                    <HiPlus className="w-5 h-5" /> Start New Project
                </button>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400">
                        <HiSearch className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex items-center gap-2 justify-end">
                    {['all', 'pending', 'in-progress', 'review', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${statusFilter === status ? 'bg-primary-500 text-white' : 'bg-white border text-dark-500'}`}
                        >
                            {status.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {loadingProjects ? (
                <LoadingSpinner />
            ) : !projects.length ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <HiCollection className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-heading font-semibold text-dark-900 mb-1">No Projects Found</h3>
                    <p className="text-sm text-dark-400">Add a project to get started.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {projects.map((project: Project) => (
                        <Link
                            to={`/admin/projects/${project._id}`}
                            key={project._id}
                            className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-heading font-semibold text-dark-900 group-hover:text-primary-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-xs text-dark-400 mt-1">
                                        Client: <span className="font-medium text-dark-700">{typeof project.client === 'object' ? project.client.name : 'Unknown'}</span> ({project.service})
                                    </p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${project.status === 'completed' ? 'bg-green-50 text-green-600'
                                        : project.status === 'review' ? 'bg-purple-50 text-purple-600'
                                            : project.status === 'in-progress' ? 'bg-blue-50 text-blue-600'
                                                : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {project.status.replace('-', ' ')}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1 h-2 rounded-full bg-gray-100">
                                    <div
                                        className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-dark-600">{project.progress}%</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-dark-400 pt-2 border-t border-gray-50 mt-1">
                                <div>
                                    {project.estimatedEndDate && `Due: ${new Date(project.estimatedEndDate).toLocaleDateString()}`}
                                </div>
                                <div className="flex items-center gap-1 text-primary-500 font-semibold">
                                    Manage <HiEye className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative shadow-lg">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-heading font-bold text-dark-900">Start New Project</h3>
                            <button onClick={closeModal} className="text-dark-400 hover:text-dark-900">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Select Client</label>
                                <select
                                    required
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Choose a client...</option>
                                    {clients.map((c: User) => (
                                        <option key={c._id} value={c._id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    placeholder="e.g. Scalax Labs Redesign"
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Service Type</label>
                                <select
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    {services.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Description</label>
                                <textarea
                                    value={description}
                                    rows={3}
                                    placeholder="Goals, boundaries, and scope outline..."
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-dark-500 uppercase mb-1">Est. End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={estimatedEndDate}
                                        onChange={(e) => setEstimatedEndDate(e.target.value)}
                                        className="w-full px-3.8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end pt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-dark-600 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors">
                                    Launch Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

