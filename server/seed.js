const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');

// Load env vars
dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Book.deleteMany({});
        console.log('✅ Data cleared');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@library.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('✅ Admin user created:', admin.email);

        // Create regular user
        const membershipExpiry = new Date();
        membershipExpiry.setFullYear(membershipExpiry.getFullYear() + 1); // 1 year from now

        const user = await User.create({
            name: 'Test User',
            email: 'user@library.com',
            password: 'user123',
            role: 'user',
            membershipType: '1year',
            membershipExpiry: membershipExpiry,
        });
        console.log('✅ Regular user created:', user.email);
        console.log('   Membership Number:', user.membershipNumber);
        console.log('   Membership Expiry:', user.membershipExpiry.toLocaleDateString());

        // Create sample books
        const books = await Book.insertMany([
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                category: 'Fiction',
                type: 'Book',
                serialNo: 'BK001',
                cost: 299,
                isAvailable: true,
            },
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                category: 'Fiction',
                type: 'Book',
                serialNo: 'BK002',
                cost: 349,
                isAvailable: true,
            },
            {
                title: '1984',
                author: 'George Orwell',
                category: 'Science Fiction',
                type: 'Book',
                serialNo: 'BK003',
                cost: 399,
                isAvailable: true,
            },
            {
                title: 'The Matrix',
                author: 'Wachowski Brothers',
                category: 'Sci-Fi',
                type: 'Movie',
                serialNo: 'MV001',
                cost: 599,
                isAvailable: true,
            },
            {
                title: 'Inception',
                author: 'Christopher Nolan',
                category: 'Thriller',
                type: 'Movie',
                serialNo: 'MV002',
                cost: 699,
                isAvailable: true,
            },
        ]);
        console.log(`✅ ${books.length} books/movies created`);

        console.log('\n📋 Summary:');
        console.log('='.repeat(50));
        console.log('Admin Login:');
        console.log('  Email: admin@library.com');
        console.log('  Password: admin123');
        console.log('\nUser Login:');
        console.log('  Email: user@library.com');
        console.log('  Password: user123');
        console.log('  Membership: ' + user.membershipNumber);
        console.log('='.repeat(50));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
