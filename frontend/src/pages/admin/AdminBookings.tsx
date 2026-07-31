import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiCalendar, HiCheck, HiX, HiClock } from 'react-icons/hi';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import type { Booking } from '@/types';

export default function AdminBookings() {
    const queryClient = useQueryClient();

    const { data: bookingsResponse, isLoading } = useQuery({
        queryKey: ['admin-bookings'],
        queryFn: async () => {
            const { data } = await api.get('/bookings');
            return data.data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/bookings/${id}`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
        },
    });

    const bookings = bookingsResponse || [];

    const handleStatus = (id: string, status: string) => {
        updateStatusMutation.mutate({ id, status });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-heading font-bold text-dark-900">Consultation Bookings</h2>
                <p className="text-sm text-dark-400 mt-1">Manage consultation requests and status</p>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : !bookings.length ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <HiCalendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-heading font-semibold text-dark-900 mb-1">No Bookings</h3>
                    <p className="text-sm text-dark-400">Consultations will appear here when requested.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 text-left bg-gray-50/50">
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Contact</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Service</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Date & Time</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Message</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-dark-400 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((booking: Booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-dark-900">{booking.name}</p>
                                            <p className="text-xs text-dark-400">{booking.email}</p>
                                            {booking.phone && <p className="text-[10px] text-dark-400">{booking.phone}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-600 font-semibold">{booking.service}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-dark-900 font-medium">{booking.date}</p>
                                            <p className="text-xs text-dark-400">{booking.time}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-dark-500 max-w-[200px] truncate">{booking.message || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600'
                                                    : booking.status === 'cancelled' ? 'bg-red-50 text-red-600'
                                                        : booking.status === 'completed' ? 'bg-blue-50 text-blue-600'
                                                            : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatus(booking._id, 'confirmed')}
                                                            className="p-1 px-2 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-semibold text-green-600 flex items-center gap-0.5"
                                                        >
                                                            <HiCheck className="w-3.5 h-3.5" /> Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(booking._id, 'cancelled')}
                                                            className="p-1 px-2 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold text-red-600 flex items-center gap-0.5"
                                                        >
                                                            <HiX className="w-3.5 h-3.5" /> Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatus(booking._id, 'completed')}
                                                        className="p-1 px-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-semibold text-blue-600 flex items-center gap-0.5"
                                                    >
                                                        <HiCheck className="w-3.5 h-3.5" /> Complete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
