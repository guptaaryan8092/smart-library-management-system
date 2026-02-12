# Library Management System - Frontend

React frontend for the Smart Library Management System with role-based authentication and complete transaction management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on `http://localhost:5000`

### Installation

```bash
cd client
npm install
```

### Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## 🔐 Demo Credentials

### Admin Account
- Email: `admin@library.com`
- Password: `admin123`

### User Account
- Email: `user@library.com`
- Password: `user123`

## 📱 Features

### For All Users
- **Authentication**: Login with role-based redirection
- **Search Books**: Search available books by title, author, or category
- **Issue Books**: Issue books with date validations (max 15 days)
- **Return Books**: Return books and pay fines
- **View Reports**: Access to books, movies, active issues, and overdue reports

### Admin Only
- **Add Books/Movies**: Add new items to the library
- **Update Books**: Modify existing book details
- **User Management**: View all users and memberships
- **Add Memberships**: Register new users
- **Full Access**: All reports including membership data

## 🎨 Tech Stack

- **React 18** with Vite
- **React Router DOM** for routing
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Context API** for state management

## 📂 Project Structure

```
src/
├── api/
│   └── axiosInstance.js       # Axios configuration
├── context/
│   └── AuthContext.jsx        # Authentication state
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Login.jsx
│   ├── AdminHome.jsx
│   ├── UserHome.jsx
│   ├── transactions/          # 5 pages
│   ├── reports/               # 5 pages
│   └── maintenance/           # 4 pages
├── App.jsx                    # Main routing
└── main.jsx                   # Entry point
```

## 🛠️ Configuration

Update the backend URL in `src/api/axiosInstance.js` if your backend runs on a different port:

```javascript
baseURL: 'http://localhost:5000/api',
```

## 📝 Available Routes

### Public
- `/login` - Login page

### Admin
- `/admin/home` - Admin dashboard
- `/maintenance/*` - Add/update books, memberships, users

### User
- `/user/home` - User dashboard

### Common (Protected)
- `/transactions/*` - Book operations
- `/reports/*` - All reports

## ✨ Key Features

### Smart Validations
- Issue date cannot be before today
- Return date limited to 15 days from issue
- Fine payment required for overdue returns
- At least one search criteria required

### Role-Based Access
- Automatic redirection based on user role
- Protected routes with authentication check
- Admin-only pages for maintenance

### Professional UI
- Clean, modern design with Tailwind CSS
- Responsive layout
- Status badges (Available, Issued, Overdue)
- Interactive tables and forms

## 🐛 Troubleshooting

### Backend Connection Error
- Ensure backend server is running on `http://localhost:5000`
- Check CORS settings in backend

### Login Issues
- Verify credentials match backend users
- Check browser console for errors
- Clear localStorage if needed

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 🎯 Next Steps

1. Start the backend server first
2. Run `npm run dev` in the client folder
3. Navigate to `http://localhost:5173`
4. Login with demo credentials
5. Explore the features!

---

**Built with** ⚛️ React + ⚡ Vite + 🎨 Tailwind CSS
