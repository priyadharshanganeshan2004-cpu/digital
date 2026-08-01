const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

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

const app = express();
app.set('trust proxy', 1);

// ── Security & Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);

app.use(cors({
    origin: true,
    credentials: true,
}));
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

app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/projects', apiLimiter, projectRoutes);
app.use('/api/invoices', apiLimiter, invoiceRoutes);
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/messages', apiLimiter, messageRoutes);
app.use('/api/dashboard', apiLimiter, dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'NexusDigital API is running' });
});

// ── Error Handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
