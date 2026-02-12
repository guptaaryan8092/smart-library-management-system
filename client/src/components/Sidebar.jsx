import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    const linkClass = (path) =>
        `block px-4 py-2 rounded transition ${isActive(path)
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-200'
        }`;

    return (
        <div className="w-64 bg-gray-100 min-h-screen p-4">
            <div className="mb-6">
                <Link
                    to={user?.role === 'admin' ? '/admin/home' : '/user/home'}
                    className={linkClass(
                        user?.role === 'admin' ? '/admin/home' : '/user/home'
                    )}
                >
                    🏠 Home
                </Link>
            </div>

            <div className="mb-6">
                <div className="text-sm font-bold text-gray-600 mb-2 px-4">
                    TRANSACTIONS
                </div>
                <Link
                    to="/transactions/book-availability"
                    className={linkClass('/transactions/book-availability')}
                >
                    Search Books
                </Link>
                <Link
                    to="/transactions/return"
                    className={linkClass('/transactions/return')}
                >
                    Return Book
                </Link>
            </div>

            <div className="mb-6">
                <div className="text-sm font-bold text-gray-600 mb-2 px-4">
                    REPORTS
                </div>
                <Link to="/reports/books" className={linkClass('/reports/books')}>
                    Master Books
                </Link>
                <Link to="/reports/movies" className={linkClass('/reports/movies')}>
                    Master Movies
                </Link>
                {user?.role === 'admin' && (
                    <Link
                        to="/reports/memberships"
                        className={linkClass('/reports/memberships')}
                    >
                        Memberships
                    </Link>
                )}
                <Link to="/reports/active" className={linkClass('/reports/active')}>
                    Active Issues
                </Link>
                <Link to="/reports/overdue" className={linkClass('/reports/overdue')}>
                    Overdue Returns
                </Link>
            </div>

            {user?.role === 'admin' && (
                <div className="mb-6">
                    <div className="text-sm font-bold text-gray-600 mb-2 px-4">
                        MAINTENANCE
                    </div>
                    <Link
                        to="/maintenance/add-book"
                        className={linkClass('/maintenance/add-book')}
                    >
                        Add Book
                    </Link>
                    <Link
                        to="/maintenance/update-book"
                        className={linkClass('/maintenance/update-book')}
                    >
                        Update Book
                    </Link>
                    <Link
                        to="/maintenance/add-membership"
                        className={linkClass('/maintenance/add-membership')}
                    >
                        Add Membership
                    </Link>
                    <Link
                        to="/maintenance/users"
                        className={linkClass('/maintenance/users')}
                    >
                        User Management
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
