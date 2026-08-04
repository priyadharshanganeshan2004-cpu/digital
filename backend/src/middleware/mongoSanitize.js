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
    req.body = sanitizeValue(req.body);
    req.query = sanitizeValue(req.query);
    req.params = sanitizeValue(req.params);
    next();
};

module.exports = mongoSanitize;