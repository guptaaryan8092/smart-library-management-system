# Smart Library Management System

A full-stack web application for managing library operations including book/movie cataloging, member management, issue/return tracking, and fine calculation.

## 🚀 Features

### For Users
- Browse available books and movies
- Issue books (max 3 at a time, 15 days max)
- Return books with automatic fine calculation
- View active issues and history
- Access various reports

### For Admins
- All user features plus:
- Add/update books and movies
- Manage user memberships
- View all system reports
- Complete administrative control

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd smart-library-management-system
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/libraryManagement
FRONTEND_URL=http://localhost:5174
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=24h
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database (Optional)
```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@library.com` / `admin123`
- Test user: `user@library.com` / `user123`
- 5 sample books/movies

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Frontend:**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5174`

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📁 Project Structure

```
smart-library-management-system/
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth, error handling, validation
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   ├── server.js          # Entry point
│   └── .env               # Environment variables
│
└── client/                # Frontend
    ├── src/
    │   ├── api/           # Axios configuration
    │   ├── components/    # Reusable components
    │   ├── context/       # React Context (Auth)
    │   ├── pages/         # Page components
    │   │   ├── transactions/
    │   │   ├── reports/
    │   │   └── maintenance/
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    └── .env               # Environment variables
```

## 🔐 Authentication

The system uses JWT-based authentication with role-based access control:

- **Admin Role:** Full access to all features
- **User Role:** Limited to user-specific operations

Protected routes automatically redirect to login if unauthenticated.

## 📊 Key Business Rules

1. **Book Issue:**
   - Maximum 3 books per user at a time
   - Maximum 15 days issue period
   - Cannot issue same book twice (duplicate prevention)
   - Membership must be active

2. **Fine Calculation:**
   - ₹10 per day for late returns
   - Fine must be paid before completing return
   - Calculated automatically on return

3. **Membership:**
   - Types: 6 months, 1 year, 2 years
   - Auto-generated membership numbers
   - Expiry date calculated automatically

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/available` - Search available books
- `POST /api/books` - Add book (Admin)
- `PUT /api/books/:id` - Update book (Admin)

### Issues
- `POST /api/issues` - Issue book
- `POST /api/issues/return/:id` - Return book
- `POST /api/issues/payfine/:id` - Pay fine
- `GET /api/issues/user/:userId` - Get user issues

### Reports
- `GET /api/reports/books` - All books report
- `GET /api/reports/movies` - All movies report
- `GET /api/reports/active-issues` - Active issues
- `GET /api/reports/overdue` - Overdue returns
- `GET /api/reports/memberships` - All memberships (Admin)

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Links:**
- Backend: Deploy to [Render](https://render.com)
- Frontend: Deploy to [Vercel](https://vercel.com)
- Database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=<your-mongodb-uri>
FRONTEND_URL=<your-vercel-url>
JWT_SECRET=<random-64-char-string>
JWT_EXPIRE=24h
```

### Frontend (.env.production)
```env
VITE_API_URL=<your-render-backend-url>/api
```

## 🧪 Testing

Login with seeded credentials:
- **Admin:** admin@library.com / admin123
- **User:** user@library.com / user123

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Built as a full-stack library management solution.

## 🙏 Acknowledgments

- Express.js for the backend framework
- React for the frontend framework
- MongoDB for the database
- Tailwind CSS for styling
