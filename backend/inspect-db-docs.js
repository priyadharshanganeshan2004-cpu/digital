const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in Database:', collections.map(c => c.name));
    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        mongoose.connection.close();
    }
}
main();
