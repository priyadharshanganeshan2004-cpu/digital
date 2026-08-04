import api from '@/lib/api';

export interface NewsletterSubscribeInput {
    email: string;
    name?: string;
    source?: string;
}

export interface PasswordResetInput {
    email: string;
    otp: string;
    password: string;
}

export interface CustomEmailInput {
    recipient: string;
    subject: string;
    message: string;
    html?: string;
    text?: string;
    replyTo?: string;
}

export interface CampaignInput {
    subject: string;
    message: string;
    ctaText?: string;
    ctaUrl?: string;
}

export const emailApi = {
    sendContact: (payload: Record<string, unknown>) => api.post('/email/contact', payload),
    sendBooking: (payload: Record<string, unknown>) => api.post('/email/booking', payload),
    subscribeNewsletter: (payload: NewsletterSubscribeInput) => api.post('/email/newsletter', payload),
    requestOtp: (email: string) => api.post('/email/otp', { email }),
    resetPassword: (payload: PasswordResetInput) => api.post('/email/reset-password', payload),
    sendCustomEmail: (payload: CustomEmailInput) => api.post('/email/send', payload),
    sendCampaign: (payload: CampaignInput) => api.post('/email/campaign', payload),
    getStats: () => api.get('/email/stats'),
    getLogs: () => api.get('/email/logs'),
    getSubscribers: () => api.get('/email/subscribers'),
    getTemplates: () => api.get('/email/templates'),
    resendEmail: (id: string) => api.post(`/email/${id}/resend`),
};

export default emailApi;