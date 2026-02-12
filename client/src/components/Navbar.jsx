import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">
                    📚 Library Management System
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm">
                        <span className="font-semibold">{user?.name}</span>
                        <span className="ml-2 px-2 py-1 bg-blue-700 rounded text-xs">
                            {user?.role?.toUpperCase()}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
