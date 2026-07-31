import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    HiArrowLeft, HiCheckCircle, HiClock, HiDownload, HiDocumentText,
    HiCalendar, HiClipboardList,
} from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Project } from '@/types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
    'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
    review: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
    completed: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
};

export default function ClientProjectDetail() {
    const { id } = useParams();

    const { data: project, isLoading } = useQuery<Project>({
        queryKey: ['project', id],
        queryFn: async () => {
            const { data } = await api.get(`/projects/${id}`);
            return data.data;
        },
    });

    if (isLoading) return <LoadingSpinner size="lg" />;
    if (!project) return <div className="text-center py-12 text-dark-400">Project not found</div>;

    const config = statusConfig[project.status];

    return (
        <div className="space-y-6">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
                <Link to="/dashboard/projects" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <HiArrowLeft className="w-5 h-5 text-dark-500" />
                </Link>
                <div className="flex-1">
                    <h2 className="text-xl font-heading font-bold text-dark-900">{project.title}</h2>
                    <p className="text-sm text-dark-400">{project.service}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config?.bg} ${config?.text} capitalize`}>
                    {project.status.replace('-', ' ')}
                </span>
            </div>

            {/* Progress */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-semibold text-dark-900">Progress</h3>
                    <span className="text-lg font-bold text-primary-600">{project.progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100">
                    <motion.div
                        className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-purple-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm text-dark-400">
                    {project.startDate && (
                        <span className="flex items-center gap-1.5">
                            <HiCalendar className="w-4 h-4" />
                            Started: {new Date(project.startDate).toLocaleDateString()}
                        </span>
                    )}
                    {project.estimatedEndDate && (
                        <span className="flex items-center gap-1.5">
                            <HiClock className="w-4 h-4" />
                            Due: {new Date(project.estimatedEndDate).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Milestones */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <HiClipboardList className="w-5 h-5 text-primary-500" />
                        <h3 className="font-heading font-semibold text-dark-900">Milestones</h3>
                    </div>
                    {project.milestones.length > 0 ? (
                        <div className="space-y-3">
                            {project.milestones.map((milestone, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${milestone.status === 'completed' ? 'bg-green-100' : 'bg-gray-200'
                                        }`}>
                                        {milestone.status === 'completed' ? (
                                            <HiCheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <HiClock className="w-3 h-3 text-dark-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${milestone.status === 'completed' ? 'text-dark-400 line-through' : 'text-dark-900'}`}>
                                            {milestone.title}
                                        </p>
                                        {milestone.description && <p className="text-xs text-dark-400 mt-0.5">{milestone.description}</p>}
                                        {milestone.dueDate && (
                                            <p className="text-xs text-dark-400 mt-1">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-dark-400 text-center py-4">No milestones yet.</p>
                    )}
                </motion.div>

                {/* Deliverables */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <HiDownload className="w-5 h-5 text-primary-500" />
                        <h3 className="font-heading font-semibold text-dark-900">Deliverables</h3>
                    </div>
                    {project.deliverables.length > 0 ? (
                        <div className="space-y-3">
                            {project.deliverables.map((file) => (
                                <div key={file._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <HiDocumentText className="w-5 h-5 text-primary-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-dark-900 truncate">{file.name}</p>
                                        <p className="text-xs text-dark-400">
                                            {file.fileType && `${file.fileType.toUpperCase()} • `}
                                            {file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                                            {file.uploadedAt && ` • ${new Date(file.uploadedAt).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <a
                                        href={file.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                                    >
                                        <HiDownload className="w-4 h-4" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-dark-400 text-center py-4">No deliverables uploaded yet.</p>
                    )}
                </motion.div>
            </div>

            {/* Quotation */}
            {project.quotation && project.quotation.amount && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-heading font-semibold text-dark-900 mb-3">Quotation</h3>
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-sm text-dark-400">Amount</p>
                            <p className="text-2xl font-bold text-dark-900">${project.quotation.amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">Status</p>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${project.quotation.status === 'approved' ? 'bg-green-50 text-green-600'
                                    : project.quotation.status === 'rejected' ? 'bg-red-50 text-red-600'
                                        : 'bg-amber-50 text-amber-600'
                                }`}>
                                {project.quotation.status}
                            </span>
                        </div>
                    </div>
                    {project.quotation.description && (
                        <p className="text-sm text-dark-500 mt-3">{project.quotation.description}</p>
                    )}
                </motion.div>
            )}

            {/* Notes */}
            {project.notes.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-heading font-semibold text-dark-900 mb-4">Project Updates</h3>
                    <div className="space-y-4">
                        {project.notes.map((note) => (
                            <div key={note._id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-600">
                                    {typeof note.createdBy === 'object' ? note.createdBy.name?.slice(0, 2).toUpperCase() : '??'}
                                </div>
                                <div>
                                    <p className="text-sm text-dark-700">{note.content}</p>
                                    <p className="text-xs text-dark-400 mt-1">
                                        {typeof note.createdBy === 'object' ? note.createdBy.name : 'Admin'} • {new Date(note.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
