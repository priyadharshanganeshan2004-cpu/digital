const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'undefined');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
    .then(() => {
        console.log('✅ Connected successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ FULL ERROR DETAILS:');
        console.error(err);
        process.exit(1);
    });
