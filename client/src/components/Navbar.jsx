import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {/* Hamburger menu for mobile */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden text-white focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="text-lg sm:text-xl font-bold">
                        <span className="hidden sm:inline">📚 Library Management System</span>
                        <span className="sm:hidden">📚 Library</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="text-xs sm:text-sm">
                        <span className="font-semibold hidden sm:inline">{user?.name}</span>
                        <span className="px-2 py-1 bg-blue-700 rounded text-xs">
                            {user?.role?.toUpperCase()}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-2 sm:px-4 py-1 sm:py-2 rounded transition text-xs sm:text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
