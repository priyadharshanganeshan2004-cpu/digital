import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/Skeleton';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    role?: 'admin' | 'client';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        // Redirect to appropriate dashboard based on role
        const redirect = user?.role === 'admin' ? '/admin' : '/dashboard';
        return <Navigate to={redirect} replace />;
    }

    return <>{children}</>;
}
