require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

(async () => {
    const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD env vars first');
    }

    await mongoose.connect(process.env.MONGO_URI);
    const exists = await User.findOne({ email });
    if (exists) {
        console.log('Admin already exists for that email');
        return;
    }

    await User.create({
        name: 'Admin',
        email,
        password,
        role: 'admin',
        isVerified: true,
        isActive: true,
    });
    console.log('Admin account created:', email);
})()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
