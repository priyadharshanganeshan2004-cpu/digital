import { AnimatePresence, motion } from 'framer-motion';
import { HiCheckCircle, HiExclamationCircle, HiX } from 'react-icons/hi';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    title: string;
    description?: string;
    tone?: ToastTone;
}

export function ToastStack({ toasts, onDismiss }: {
    toasts: ToastMessage[];
    onDismiss: (id: string) => void;
}) {
    return (
        <div className="fixed top-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const tone = toast.tone || 'success';
                    const toneClasses = tone === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : tone === 'error'
                            ? 'border-red-200 bg-red-50 text-red-900'
                            : 'border-blue-200 bg-blue-50 text-blue-900';
                    const Icon = tone === 'success'
                        ? HiCheckCircle
                        : tone === 'error'
                            ? HiExclamationCircle
                            : HiCheckCircle;

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 12 }}
                            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl shadow-black/5 backdrop-blur ${toneClasses}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">{toast.title}</p>
                                    {toast.description && <p className="mt-1 text-xs opacity-80 leading-5">{toast.description}</p>}
                                </div>
                                <button
                                    onClick={() => onDismiss(toast.id)}
                                    className="rounded-full p-1 text-current/70 hover:bg-black/5 hover:text-current transition-colors"
                                    aria-label="Dismiss toast"
                                >
                                    <HiX className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}