const sanitizeValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object' && value.constructor === Object) {
        const sanitized = {};
        for (const [key, nested] of Object.entries(value)) {
            if (key.startsWith('$') || key.includes('.')) {
                continue;
            }
            sanitized[key] = sanitizeValue(nested);
        }
        return sanitized;
    }

    return value;
};

const mongoSanitize = () => (req, res, next) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) {
        Object.keys(req.query).forEach((key) => {
            req.query[key] = sanitizeValue(req.query[key]);
        });
    }
    if (req.params) {
        Object.keys(req.params).forEach((key) => {
            req.params[key] = sanitizeValue(req.params[key]);
        });
    }
    next();
};

module.exports = mongoSanitize;