const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        if (error.message.includes('querySrv ECONNREFUSED')) {
            console.error('TIP: Check your DNS settings or use a non-SRV connection string');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
