import React from 'react';

type Props = {
    children: React.ReactNode;
    fallback?: React.ReactNode;
};

type State = {
    hasError: boolean;
};

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: unknown) {
        console.error('React error boundary caught an error:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="min-h-[60vh] flex items-center justify-center rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-dark-900">Something went wrong</h2>
                            <p className="mt-2 text-sm text-dark-500">Please refresh the page or return to the dashboard.</p>
                        </div>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}