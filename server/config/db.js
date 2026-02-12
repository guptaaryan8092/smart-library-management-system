const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection URI:', process.env.MONGO_URI?.substring(0, 50) + '...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log('Database Name:', conn.connection.name);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        if (error.message.includes('querySrv ECONNREFUSED')) {
            console.error('TIP: This is usually a DNS lookup issue. Try changing your DNS to 8.8.8.8 or use a non-SRV connection string.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
