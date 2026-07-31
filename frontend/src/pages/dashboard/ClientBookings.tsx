import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { HiCalendar, HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Booking } from '@/types';

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: HiClock },
    confirmed: { bg: 'bg-green-50', text: 'text-green-600', icon: HiCheckCircle },
    cancelled: { bg: 'bg-red-50', text: 'text-red-600', icon: HiXCircle },
    completed: { bg: 'bg-blue-50', text: 'text-blue-600', icon: HiCheckCircle },
};

export default function ClientBookings() {
    const { data: bookings, isLoading } = useQuery<Booking[]>({
        queryKey: ['client-bookings'],
        queryFn: async () => {
            const { data } = await api.get('/bookings');
            return data.data;
        },
    });

    if (isLoading) return <LoadingSpinner size="lg" />;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-heading font-bold text-dark-900">Meetings & Consultations</h2>
                <p className="text-sm text-dark-400 mt-1">View your scheduled consultations</p>
            </div>

            {!bookings?.length ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <HiCalendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-heading font-semibold text-dark-900 mb-1">No Bookings</h3>
                    <p className="text-sm text-dark-400">Your consultations and meetings will appear here.</p>
                </motion.div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking, i) => {
                        const sc = statusConfig[booking.status];
                        const StatusIcon = sc?.icon || HiClock;
                        return (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-gray-100 p-5"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                            <HiCalendar className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-dark-900">{booking.service}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-dark-400">
                                                <span>{booking.date}</span>
                                                <span>•</span>
                                                <span>{booking.time}</span>
                                            </div>
                                            {booking.message && (
                                                <p className="text-sm text-dark-500 mt-2">{booking.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc?.bg} ${sc?.text}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        <span className="capitalize">{booking.status}</span>
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
