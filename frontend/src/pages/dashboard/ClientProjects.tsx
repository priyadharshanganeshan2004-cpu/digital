import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiClock, HiCheckCircle, HiFilter, HiEye } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Project } from '@/types';

const STATUS_OPTIONS = ['all', 'pending', 'in-progress', 'review', 'completed'] as const;

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Pending' },
    'in-progress': { bg: 'bg-blue-50', text: 'text-blue-600', label: 'In Progress' },
    review: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Review' },
    completed: { bg: 'bg-green-50', text: 'text-green-600', label: 'Completed' },
};

export default function ClientProjects() {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const { data: projects, isLoading } = useQuery<Project[]>({
        queryKey: ['client-projects', statusFilter],
        queryFn: async () => {
            const { data } = await api.get('/projects', { params: { status: statusFilter } });
            return data.data;
        },
    });

    return (
        <div className="space-y-6">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">My Projects</h2>
                    <p className="text-sm text-dark-400 mt-1">Track progress and view deliverables</p>
                </div>
                <div className="flex items-center gap-2">
                    <HiFilter className="w-4 h-4 text-dark-400" />
                    {STATUS_OPTIONS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-dark-500 hover:bg-gray-200'
                                }`}
                        >
                            {s === 'all' ? 'All' : s.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : !projects?.length ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                        <HiClock className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-dark-900 mb-2">No Projects Found</h3>
                    <p className="text-dark-400 text-sm">Your projects will appear here once assigned.</p>
                </motion.div>
            ) : (
                <div className="grid gap-4">
                    {projects.map((project, i) => {
                        const config = statusConfig[project.status];
                        return (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    to={`/dashboard/projects/${project._id}`}
                                    className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-heading font-semibold text-dark-900 group-hover:text-primary-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-dark-400 mt-0.5">{project.service}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
                                                {config?.label || project.status}
                                            </span>
                                            <HiEye className="w-4 h-4 text-dark-300 group-hover:text-primary-500 transition-colors" />
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex-1 h-2 rounded-full bg-gray-100">
                                            <div
                                                className={`h-full rounded-full transition-all ${project.progress === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-dark-600 w-10 text-right">{project.progress}%</span>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-xs text-dark-400">
                                        {project.startDate && (
                                            <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                                        )}
                                        {project.estimatedEndDate && (
                                            <span>Due: {new Date(project.estimatedEndDate).toLocaleDateString()}</span>
                                        )}
                                        {project.deliverables?.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <HiCheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                {project.deliverables.length} deliverable{project.deliverables.length !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
