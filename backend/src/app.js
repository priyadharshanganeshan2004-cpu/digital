const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('./middleware/mongoSanitize');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// ── Security & Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.set('trust proxy', 1);

// ── CORS Origin Allowlist ────────────────────────────────────
//
// Regex patterns are used instead of hard-coded strings so that
// Vercel preview deployments work without manual env-var updates
// on every new deploy.
//
// Pattern breakdown:
//   • digital-[a-z0-9]+-digital-797b.vercel.app
//       → Matches ONLY this project's Vercel preview URLs
//         (e.g. digital-g5ogqxda4-digital-797b.vercel.app)
//         NOT arbitrary *.vercel.app sites — intentionally scoped.
//   • FRONTEND_URL env var → stable Vercel production alias
//         (set this to your fixed production domain in Render)
//   • ALLOWED_ORIGINS env var → comma-separated extra origins
//         (safety-net fallback, include production URL here too)
//
const allowedOriginPatterns = [
    // This project's Vercel preview deployments (scoped, not *.vercel.app)
    // Covers BOTH hash previews (digital-abc123-digital-797b.vercel.app)
    // AND branch previews  (digital-git-main-digital-797b.vercel.app)
    // The slug between digital- and -digital-797b can contain letters, digits, AND hyphens.
    /^https:\/\/digital-[a-z0-9-]+-digital-797b\.vercel\.app$/i,
    // Stable Render backend self-origin (for health checks etc.)
    /^https:\/\/digital-87kt\.onrender\.com$/i,
    /^https:\/\/digital-87kt\.onrender\.app$/i,
    // Local development
    /^http:\/\/localhost:(5173|3000)$/i,
];

// Exact-match origins from env vars (stable production alias + extras)
const allowedOriginExact = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS || '').split(','),
]
    .map((o) => (o || '').trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) =>
    !origin ||
    allowedOriginExact.includes(origin) ||
    allowedOriginPatterns.some((pattern) => pattern.test(origin));

// FIX: Pass `false` (not an Error) for rejected origins so Express
// returns a 403 instead of an unhandled-error 500 on OPTIONS preflight.
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Handle all OPTIONS preflight requests with the same config.
// This must come BEFORE route definitions.
app.options(/.*/, cors(corsOptions));

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ── Rate Limiting ───────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many login attempts, try again in 15 minutes.' },
});

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { success: false, message: 'Too many submissions, please try again later.' },
});

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);

app.use('/api/leads', contactLimiter, leadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cms', apiLimiter, cmsRoutes);
app.use('/api/email', emailRoutes);

app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/projects', apiLimiter, projectRoutes);
app.use('/api/invoices', apiLimiter, invoiceRoutes);
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/messages', apiLimiter, messageRoutes);
app.use('/api/dashboard', apiLimiter, dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Scalax Labs API is running' });
});

// ── Error Handling ──────────────────────────────────────────

// Defense-in-depth: if any middleware ever throws a CORS error,
// return a clean 403 instead of an Express 500.
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ success: false, message: 'Origin not allowed' });
    }
    next(err);
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

