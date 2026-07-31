import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
            ))}
        </>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <Skeleton className="w-12 h-12 rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

    return (
        <div className="flex items-center justify-center p-8">
            <motion.div
                className={`${sizeMap[size]} border-3 border-gray-200 border-t-primary-500 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative w-16 h-16">
                    <motion.div
                        className="absolute inset-0 rounded-full border-3 border-primary-200"
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
                <p className="text-dark-400 text-sm font-medium">Loading...</p>
            </motion.div>
        </div>
    );
}
