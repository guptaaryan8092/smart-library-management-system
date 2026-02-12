import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome';

// Transactions
import BookAvailability from './pages/transactions/BookAvailability';
import SearchResults from './pages/transactions/SearchResults';
import BookIssue from './pages/transactions/BookIssue';
import ReturnBook from './pages/transactions/ReturnBook';
import PayFine from './pages/transactions/PayFine';

// Reports
import MasterBooks from './pages/reports/MasterBooks';
import MasterMovies from './pages/reports/MasterMovies';
import Memberships from './pages/reports/Memberships';
import ActiveIssues from './pages/reports/ActiveIssues';
import Overdue from './pages/reports/Overdue';

// Maintenance
import AddBook from './pages/maintenance/AddBook';
import UpdateBook from './pages/maintenance/UpdateBook';
import AddMembership from './pages/maintenance/AddMembership';
import UserManagement from './pages/maintenance/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminHome />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/home"
            element={
              <ProtectedRoute requiredRole="user">
                <UserHome />
              </ProtectedRoute>
            }
          />

          {/* Transactions (All Users) */}
          <Route
            path="/transactions/book-availability"
            element={
              <ProtectedRoute>
                <BookAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/search-results"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/issue"
            element={
              <ProtectedRoute>
                <BookIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/return"
            element={
              <ProtectedRoute>
                <ReturnBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/pay-fine"
            element={
              <ProtectedRoute>
                <PayFine />
              </ProtectedRoute>
            }
          />

          {/* Reports (All Users) */}
          <Route
            path="/reports/books"
            element={
              <ProtectedRoute>
                <MasterBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/movies"
            element={
              <ProtectedRoute>
                <MasterMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/memberships"
            element={
              <ProtectedRoute requiredRole="admin">
                <Memberships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/active"
            element={
              <ProtectedRoute>
                <ActiveIssues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/overdue"
            element={
              <ProtectedRoute>
                <Overdue />
              </ProtectedRoute>
            }
          />

          {/* Maintenance (Admin Only) */}
          <Route
            path="/maintenance/add-book"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/update-book"
            element={
              <ProtectedRoute requiredRole="admin">
                <UpdateBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/add-membership"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddMembership />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
