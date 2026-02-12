import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    const linkClass = (path) =>
        `block px-4 py-2 rounded transition ${isActive(path)
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-200'
        }`;

    const handleLinkClick = () => {
        // Close sidebar on mobile when link is clicked
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 bg-gray-100 min-h-screen p-4
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    overflow-y-auto
                `}
            >
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    aria-label="Close menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-6 mt-8 lg:mt-0">
                    <Link
                        to={user?.role === 'admin' ? '/admin/home' : '/user/home'}
                        className={linkClass(
                            user?.role === 'admin' ? '/admin/home' : '/user/home'
                        )}
                        onClick={handleLinkClick}
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
                        onClick={handleLinkClick}
                    >
                        Search Books
                    </Link>
                    <Link
                        to="/transactions/return"
                        className={linkClass('/transactions/return')}
                        onClick={handleLinkClick}
                    >
                        Return Book
                    </Link>
                </div>

                <div className="mb-6">
                    <div className="text-sm font-bold text-gray-600 mb-2 px-4">
                        REPORTS
                    </div>
                    <Link to="/reports/books" className={linkClass('/reports/books')} onClick={handleLinkClick}>
                        Master Books
                    </Link>
                    <Link to="/reports/movies" className={linkClass('/reports/movies')} onClick={handleLinkClick}>
                        Master Movies
                    </Link>
                    {user?.role === 'admin' && (
                        <Link
                            to="/reports/memberships"
                            className={linkClass('/reports/memberships')}
                            onClick={handleLinkClick}
                        >
                            Memberships
                        </Link>
                    )}
                    <Link to="/reports/active" className={linkClass('/reports/active')} onClick={handleLinkClick}>
                        Active Issues
                    </Link>
                    <Link to="/reports/overdue" className={linkClass('/reports/overdue')} onClick={handleLinkClick}>
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
                            onClick={handleLinkClick}
                        >
                            Add Book
                        </Link>
                        <Link
                            to="/maintenance/update-book"
                            className={linkClass('/maintenance/update-book')}
                            onClick={handleLinkClick}
                        >
                            Update Book
                        </Link>
                        <Link
                            to="/maintenance/add-membership"
                            className={linkClass('/maintenance/add-membership')}
                            onClick={handleLinkClick}
                        >
                            Add Membership
                        </Link>
                        <Link
                            to="/maintenance/users"
                            className={linkClass('/maintenance/users')}
                            onClick={handleLinkClick}
                        >
                            User Management
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;
