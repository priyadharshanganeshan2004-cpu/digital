import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '@/lib/api';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (name: string, email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            if (!getAccessToken()) {
                try {
                    const refreshResponse = await api.post('/auth/refresh', {}, { withCredentials: true });
                    setAccessToken(refreshResponse.data.accessToken);
                } catch {
                    setIsLoading(false);
                    return;
                }
            }
            const { data } = await api.get('/auth/me');
            setUser(data.data);
        } catch {
            clearAccessToken();
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data.user;
    };

    const register = async (name: string, email: string, password: string) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
        }
        clearAccessToken();
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
