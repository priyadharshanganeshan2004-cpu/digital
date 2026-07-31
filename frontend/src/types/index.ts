// ============================================
// Core Application Types
// ============================================

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    avatar?: string;
    role: 'admin' | 'client';
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    user: User;
    accessToken: string;
    refreshToken: string;
}

// ── Projects ────────────────────────────────────────────────

export interface Milestone {
    _id?: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    dueDate?: string;
    completedDate?: string;
}

export interface Deliverable {
    _id: string;
    name: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
    cloudinaryId?: string;
    uploadedAt: string;
}

export interface ProjectNote {
    _id: string;
    content: string;
    createdBy: { _id: string; name: string; avatar?: string };
    createdAt: string;
}

export interface Quotation {
    amount?: number;
    description?: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    sentAt?: string;
    respondedAt?: string;
}

export interface Project {
    _id: string;
    title: string;
    description?: string;
    client: User | string;
    service: string;
    status: 'pending' | 'in-progress' | 'review' | 'completed';
    progress: number;
    startDate?: string;
    estimatedEndDate?: string;
    completedDate?: string;
    milestones: Milestone[];
    deliverables: Deliverable[];
    quotation?: Quotation;
    notes: ProjectNote[];
    createdAt: string;
    updatedAt: string;
}

// ── Invoices ────────────────────────────────────────────────

export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    client: User | string;
    project?: Project | string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    dueDate?: string;
    paidAt?: string;
    paymentMethod?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// ── Notifications ───────────────────────────────────────────

export interface Notification {
    _id: string;
    recipient: string;
    title: string;
    message: string;
    type: 'project_update' | 'invoice' | 'message' | 'general';
    link?: string;
    isRead: boolean;
    createdAt: string;
}

// ── Messages ────────────────────────────────────────────────

export interface Message {
    _id: string;
    sender: { _id: string; name: string; avatar?: string; role: string };
    recipient: { _id: string; name: string; avatar?: string; role: string };
    project?: { _id: string; title: string };
    subject?: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export interface Conversation {
    user: { _id: string; name: string; email: string; company?: string; avatar?: string };
    lastMessage: string;
    lastMessageDate: string;
    unreadCount: number;
}

// ── Bookings ────────────────────────────────────────────────

export interface Booking {
    _id: string;
    client?: string;
    name: string;
    email: string;
    phone?: string;
    service: string;
    date: string;
    time: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
}

// ── Leads ───────────────────────────────────────────────────

export interface Lead {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service: string;
    budget?: string;
    message: string;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
    createdAt: string;
}

// ── Dashboard Stats ─────────────────────────────────────────

export interface AdminStats {
    totalClients: number;
    activeClients: number;
    totalProjects: number;
    activeProjects: number;
    totalLeads: number;
    newLeads: number;
    totalRevenue: number;
    pendingRevenue: number;
    recentLeads: Lead[];
    recentProjects: Project[];
}

export interface ClientStats {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    pendingInvoices: number;
    totalPaid: number;
    unreadMessages: number;
    unreadNotifications: number;
    recentProjects: Project[];
    recentNotifications: Notification[];
}

// ── Services (static) ───────────────────────────────────────

export interface ServiceData {
    id: string;
    title: string;
    shortDesc: string;
    icon: string;
    color: string;
}

// ── Common ──────────────────────────────────────────────────

export interface NavLink {
    label: string;
    href: string;
    children?: NavLink[];
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
}

export interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    isPopular: boolean;
    ctaText: string;
}
