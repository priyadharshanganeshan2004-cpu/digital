import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HiChartBar, HiMail, HiPaperAirplane, HiRefresh, HiUsers, HiTemplate, HiCheck, HiX } from 'react-icons/hi';
import api from '@/lib/api';
import emailApi from '@/services/emailApi';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import { ToastStack, type ToastMessage } from '@/components/ui/Toast';
import type { EmailLog, EmailStats, EmailTemplate, NewsletterSubscriber } from '@/types';

type EmailStatsResponse = {
    sent: number;
    failed: number;
    subscribers: number;
    templates: number;
    deliveryRate: number;
    recentLogs?: EmailLog[];
    newsletter?: { subscribed: number; unsubscribed: number; total: number; recent: NewsletterSubscriber[] };
    recent?: EmailLog[];
    templatesList?: EmailTemplate[];
};

const statCards = [
    { key: 'sent', label: 'Sent Emails', icon: HiMail, color: 'from-emerald-500 to-emerald-600' },
    { key: 'failed', label: 'Failed Emails', icon: HiX, color: 'from-rose-500 to-rose-600' },
    { key: 'subscribers', label: 'Subscribers', icon: HiUsers, color: 'from-sky-500 to-sky-600' },
    { key: 'deliveryRate', label: 'Delivery Rate', icon: HiChartBar, color: 'from-violet-500 to-violet-600' },
];

const toastId = () => Math.random().toString(36).slice(2, 10);

export default function AdminEmailManagement() {
    const queryClient = useQueryClient();
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [campaignSubject, setCampaignSubject] = useState('');
    const [campaignMessage, setCampaignMessage] = useState('');
    const [campaignCtaText, setCampaignCtaText] = useState('Read the update');
    const [campaignCtaUrl, setCampaignCtaUrl] = useState('https://');
    const [customRecipient, setCustomRecipient] = useState('');
    const [customSubject, setCustomSubject] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
        const id = toastId();
        setToasts((current) => [...current, { id, ...toast }]);
        window.setTimeout(() => {
            setToasts((current) => current.filter((item) => item.id !== id));
        }, 4000);
    };

    const dismissToast = (id: string) => {
        setToasts((current) => current.filter((item) => item.id !== id));
    };

    const { data: statsResponse, isLoading: loadingStats } = useQuery<{ data: EmailStats }>({
        queryKey: ['email-stats'],
        queryFn: async () => {
            const { data } = await emailApi.getStats();
            return data;
        },
    });

    const { data: logsResponse, isLoading: loadingLogs } = useQuery<{ data: EmailLog[] }>({
        queryKey: ['email-logs'],
        queryFn: async () => {
            const { data } = await emailApi.getLogs();
            return data;
        },
    });

    const { data: subscribersResponse, isLoading: loadingSubscribers } = useQuery<{ data: NewsletterSubscriber[] }>({
        queryKey: ['newsletter-subscribers'],
        queryFn: async () => {
            const { data } = await emailApi.getSubscribers();
            return data;
        },
    });

    const { data: templatesResponse, isLoading: loadingTemplates } = useQuery<{ data: EmailTemplate[] }>({
        queryKey: ['email-templates'],
        queryFn: async () => {
            const { data } = await emailApi.getTemplates();
            return data;
        },
    });

    const sendCampaignMutation = useMutation({
        mutationFn: () => emailApi.sendCampaign({
            subject: campaignSubject,
            message: campaignMessage,
            ctaText: campaignCtaText,
            ctaUrl: campaignCtaUrl,
        }),
        onSuccess: (response: any) => {
            pushToast({ tone: 'success', title: 'Campaign sent', description: response.data?.message || 'Newsletter campaign delivered.' });
            setCampaignSubject('');
            setCampaignMessage('');
            queryClient.invalidateQueries({ queryKey: ['email-logs'] });
            queryClient.invalidateQueries({ queryKey: ['email-stats'] });
        },
        onError: (error: any) => {
            pushToast({ tone: 'error', title: 'Campaign failed', description: error.response?.data?.message || 'Unable to send campaign.' });
        },
    });

    const sendCustomMutation = useMutation({
        mutationFn: () => emailApi.sendCustomEmail({
            recipient: customRecipient,
            subject: customSubject,
            message: customMessage,
        }),
        onSuccess: (response: any) => {
            pushToast({ tone: 'success', title: 'Email sent', description: response.data?.message || 'Custom email delivered.' });
            setCustomRecipient('');
            setCustomSubject('');
            setCustomMessage('');
            queryClient.invalidateQueries({ queryKey: ['email-logs'] });
            queryClient.invalidateQueries({ queryKey: ['email-stats'] });
        },
        onError: (error: any) => {
            pushToast({ tone: 'error', title: 'Send failed', description: error.response?.data?.message || 'Unable to send email.' });
        },
    });

    const resendMutation = useMutation({
        mutationFn: (id: string) => emailApi.resendEmail(id),
        onSuccess: () => {
            pushToast({ tone: 'success', title: 'Resent', description: 'Email was resent successfully.' });
            queryClient.invalidateQueries({ queryKey: ['email-logs'] });
            queryClient.invalidateQueries({ queryKey: ['email-stats'] });
        },
        onError: (error: any) => {
            pushToast({ tone: 'error', title: 'Resend failed', description: error.response?.data?.message || 'Unable to resend email.' });
        },
    });

    const stats = statsResponse?.data || { sent: 0, failed: 0, subscribers: 0, templates: 0, deliveryRate: 0 };
    const logs = logsResponse?.data || [];
    const subscribers = subscribersResponse?.data || [];
    const templates = templatesResponse?.data || [];

    const recentFailed = useMemo(() => logs.filter((log) => log.status === 'failed').slice(0, 5), [logs]);

    useEffect(() => {
        if (!campaignCtaUrl) {
            setCampaignCtaUrl('https://');
        }
    }, [campaignCtaUrl]);

    return (
        <div className="space-y-6">
            <ToastStack toasts={toasts} onDismiss={dismissToast} />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-xl font-heading font-bold text-dark-900">Email Management</h2>
                    <p className="text-sm text-dark-400 mt-1">Monitor deliverability, subscribers, and promotional sends.</p>
                </div>
                <button
                    onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ['email-stats'] });
                        queryClient.invalidateQueries({ queryKey: ['email-logs'] });
                        queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
                        queryClient.invalidateQueries({ queryKey: ['email-templates'] });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-dark-700 hover:bg-gray-50 transition-colors"
                >
                    <HiRefresh className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    const value = card.key === 'deliveryRate' ? `${stats.deliveryRate || 0}%` : (stats as any)[card.key] ?? 0;
                    return (
                        <motion.div
                            key={card.key}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-dark-400">{card.label}</p>
                                    <p className="mt-2 text-2xl font-heading font-bold text-dark-900">{loadingStats ? '...' : value}</p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-heading text-lg font-semibold text-dark-900">Promotional Email</h3>
                            <p className="text-sm text-dark-400">Send a newsletter campaign to all active subscribers.</p>
                        </div>
                        <HiPaperAirplane className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="grid gap-4">
                        <input value={campaignSubject} onChange={(e) => setCampaignSubject(e.target.value)} placeholder="Campaign subject" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
                        <textarea value={campaignMessage} onChange={(e) => setCampaignMessage(e.target.value)} placeholder="Campaign message" rows={5} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
                        <div className="grid gap-4 md:grid-cols-2">
                            <input value={campaignCtaText} onChange={(e) => setCampaignCtaText(e.target.value)} placeholder="CTA text" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
                            <input value={campaignCtaUrl} onChange={(e) => setCampaignCtaUrl(e.target.value)} placeholder="CTA URL" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
                        </div>
                        <div className="flex justify-end">
                            <button
                                disabled={sendCampaignMutation.isPending || !campaignSubject.trim() || !campaignMessage.trim()}
                                onClick={() => sendCampaignMutation.mutate()}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {sendCampaignMutation.isPending ? <HiRefresh className="h-4 w-4 animate-spin" /> : <HiPaperAirplane className="h-4 w-4" />}
                                Send Campaign
                            </button>
                        </div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-heading text-lg font-semibold text-dark-900">Quick Send</h3>
                            <p className="text-sm text-dark-400">Send a one-off email.</p>
                        </div>
                        <HiMail className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="space-y-3">
                        <input value={customRecipient} onChange={(e) => setCustomRecipient(e.target.value)} placeholder="Recipient email" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
                        <input value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} placeholder="Subject" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
                        <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} placeholder="Message" rows={5} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
                        <button
                            disabled={sendCustomMutation.isPending || !customRecipient.trim() || !customSubject.trim() || !customMessage.trim()}
                            onClick={() => sendCustomMutation.mutate()}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {sendCustomMutation.isPending ? <HiRefresh className="h-4 w-4 animate-spin" /> : <HiCheck className="h-4 w-4 text-emerald-500" />}
                            Send Email
                        </button>
                    </div>
                </motion.section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h3 className="font-heading text-lg font-semibold text-dark-900">Sent & Failed Emails</h3>
                            <p className="text-sm text-dark-400">Recent delivery log entries.</p>
                        </div>
                    </div>
                    {loadingLogs ? (
                        <div className="p-8"><LoadingSpinner /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-dark-400">
                                        <th className="px-6 py-3">Recipient</th>
                                        <th className="px-6 py-3">Subject</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {logs.slice(0, 10).map((log) => (
                                        <tr key={log._id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-sm text-dark-700">{log.recipient}</td>
                                            <td className="px-6 py-4 text-sm text-dark-700">{log.subject}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${log.status === 'sent' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-dark-400">{new Date(log.sentAt || log.createdAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => resendMutation.mutate(log._id)}
                                                    disabled={resendMutation.isPending}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <HiRefresh className="h-3.5 w-3.5" />
                                                    Resend
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!logs.length && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-dark-400">No email logs yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h3 className="font-heading text-lg font-semibold text-dark-900">Recent Failures</h3>
                            <p className="text-sm text-dark-400">Messages that need attention.</p>
                        </div>
                    </div>
                    <div className="space-y-4 p-6">
                        {recentFailed.length ? recentFailed.map((log) => (
                            <div key={log._id} className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
                                <p className="text-sm font-semibold text-dark-900">{log.subject}</p>
                                <p className="mt-1 text-xs text-dark-500">{log.recipient}</p>
                                <p className="mt-2 text-xs text-rose-600">{log.error}</p>
                            </div>
                        )) : (
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center text-sm text-dark-400">No failed emails found.</div>
                        )}
                    </div>
                </motion.section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h3 className="font-heading text-lg font-semibold text-dark-900">Newsletter Subscribers</h3>
                            <p className="text-sm text-dark-400">People who opted into updates.</p>
                        </div>
                        <HiUsers className="h-5 w-5 text-primary-600" />
                    </div>
                    {loadingSubscribers ? (
                        <div className="p-8"><LoadingSpinner /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-dark-400">
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Subscribed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {subscribers.slice(0, 10).map((subscriber) => (
                                        <tr key={subscriber._id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-sm text-dark-700">{subscriber.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${subscriber.status === 'subscribed' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {subscriber.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-dark-400">{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {!subscribers.length && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-sm text-dark-400">No subscribers yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h3 className="font-heading text-lg font-semibold text-dark-900">Email Templates</h3>
                            <p className="text-sm text-dark-400">Active template records in MongoDB.</p>
                        </div>
                        <HiTemplate className="h-5 w-5 text-primary-600" />
                    </div>
                    {loadingTemplates ? (
                        <div className="p-8"><LoadingSpinner /></div>
                    ) : (
                        <div className="space-y-4 p-6">
                            {templates.map((template) => (
                                <div key={template._id} className="rounded-2xl border border-gray-100 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-dark-900">{template.name}</p>
                                            <p className="text-xs text-dark-400">{template.subject}</p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${template.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {template.isActive ? 'active' : 'inactive'}
                                        </span>
                                    </div>
                                    {template.description && <p className="mt-3 text-xs text-dark-500">{template.description}</p>}
                                    {template.variables?.length ? <p className="mt-2 text-[11px] text-dark-400">Variables: {template.variables.join(', ')}</p> : null}
                                </div>
                            ))}
                            {!templates.length && <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center text-sm text-dark-400">No templates found.</div>}
                        </div>
                    )}
                </motion.section>
            </div>
        </div>
    );
}