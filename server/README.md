# Smart Library Management System - Backend (Phase 1)

A comprehensive REST API backend for a Library Management System with role-based authentication, book management, membership tracking, and automated fine calculation.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin and User roles with different permissions
- **Book Management** - CRUD operations for books and movies
- **Issue System** - Book issuing with strict validations
- **Fine Calculation** - Automatic fine calculation at ₹10/day for late returns
- **Membership Management** - Multiple membership types (6 months, 1 year, 2 years)
- **Comprehensive Reports** - Books, movies, memberships, active issues, and overdue items

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection URI)
- npm or yarn

## 🛠️ Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/library-management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=24h
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

5. Run the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📂 Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── bookController.js     # Book management
│   ├── issueController.js    # Issue/return/fine logic
│   └── reportController.js   # Reports generation
├── models/
│   ├── User.js              # User schema
│   ├── Book.js              # Book schema
│   └── Issue.js             # Issue schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── bookRoutes.js        # Book endpoints
│   ├── issueRoutes.js       # Issue endpoints
│   └── reportRoutes.js      # Report endpoints
├── middleware/
│   ├── auth.js              # JWT & role verification
│   └── errorHandler.js      # Global error handler
├── utils/
│   ├── generateToken.js     # JWT token generation
│   └── fineCalculator.js    # Fine calculation logic
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
└── server.js               # Main server file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user/admin
- `POST /api/auth/login` - Login user/admin

### Books (Protected)
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `GET /api/books` - Get all books
- `GET /api/books/available` - Get available books

### Issues (Protected)
- `POST /api/issues` - Issue a book
- `POST /api/issues/return/:id` - Return a book
- `POST /api/issues/payfine/:id` - Pay fine and complete return
- `GET /api/issues/user/:userId` - Get user's issues

### Reports (Protected)
- `GET /api/reports/books` - All books report
- `GET /api/reports/movies` - All movies report
- `GET /api/reports/memberships` - All memberships (Admin only)
- `GET /api/reports/active-issues` - Currently issued items
- `GET /api/reports/overdue` - Overdue items with fine calculation

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 API Usage Examples

### Register a User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "membershipType": "1year"
}
```

### Register an Admin
```json
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create a Book (Admin)
```json
POST /api/books
Authorization: Bearer <admin_token>
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "type": "Book",
  "serialNo": "BK001",
  "cost": 500
}
```

### Issue a Book
```json
POST /api/issues
Authorization: Bearer <user_token>
{
  "bookId": "book_id_here",
  "issueDate": "2026-02-11",
  "returnDate": "2026-02-20"
}
```

### Return a Book
```json
POST /api/issues/return/:issueId
Authorization: Bearer <user_token>
{
  "actualReturnDate": "2026-02-22"
}
```

### Pay Fine
```json
POST /api/issues/payfine/:issueId
Authorization: Bearer <user_token>
```

## ⚡ Business Rules

### Issue Validations
- ✅ Book must be available
- ✅ User membership must be active
- ✅ Issue date must be >= today
- ✅ Return date must be <= issueDate + 15 days
- ✅ User can have maximum 3 active issues

### Fine Calculation
- ₹10 per day for late returns
- Fine is calculated when actualReturnDate > returnDate
- Book becomes available only after fine payment

### Membership Types
- `6months` - 6 months validity
- `1year` - 1 year validity
- `2years` - 2 years validity

### Roles
- `admin` - Full access to all operations
- `user` - Limited access, can view own issues only

## 🧪 Testing

You can test the API using:
- **Postman** - Import endpoints and test
- **Thunder Client** (VS Code extension)
- **cURL** - Command line testing

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Role-based access control
- Input validation on all endpoints
- Protected routes with middleware
- Users can only access their own data (except admins)

## 📊 Database Models

### User
- Stores user details, credentials, and membership info
- Auto-generates membership number for users
- Auto-calculates membership expiry based on type

### Book
- Stores book/movie details
- Tracks availability status
- Unique serial numbers

### Issue
- Links users and books
- Tracks issue/return dates
- Calculates and stores fine amounts
- Status tracking (Issued/Returned)

## 🎯 Next Steps (Frontend - Phase 2)

This backend is ready to be connected with a frontend application that includes:
- Login/Registration UI
- Book browsing and search
- Issue management dashboard
- Fine payment interface
- Admin panel for book management
- Reports and analytics

## 📄 License

ISC

## 👨‍💻 Author

Smart Library Management System - Backend Phase 1
