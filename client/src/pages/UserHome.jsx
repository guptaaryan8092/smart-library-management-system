import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const UserHome = () => {
    const { user } = useAuth();
    const [myIssues, setMyIssues] = useState([]);
    const [overdueCount, setOverdueCount] = useState(0);

    useEffect(() => {
        fetchMyIssues();
    }, []);

    const fetchMyIssues = async () => {
        try {
            const response = await axiosInstance.get(`/issues/user/${user._id}`);
            setMyIssues(response.data.data);

            // Count overdue
            const today = new Date();
            const overdue = response.data.data.filter(
                (issue) =>
                    issue.status === 'Issued' &&
                    new Date(issue.returnDate) < today
            );
            setOverdueCount(overdue.length);
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
    };

    const activeIssues = myIssues.filter((issue) => issue.status === 'Issued');

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Welcome, {user?.name}!
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="text-sm sm:text-base text-gray-600 mb-2">Membership Number</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 break-all">
                        {user?.membershipNumber}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="text-sm sm:text-base text-gray-600 mb-2">Active Issues</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {activeIssues.length} / 3
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="text-sm sm:text-base text-gray-600 mb-2">Overdue Books</div>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">
                        {overdueCount}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Membership Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                    <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-semibold">
                            {user?.membershipType}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600">Expiry:</span>
                        <span className="ml-2 font-semibold">
                            {new Date(user?.membershipExpiry).toLocaleDateString()}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600">Status:</span>
                        <span
                            className={`ml-2 px-2 py-1 rounded text-xs ${user?.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {user?.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Link
                        to="/transactions/book-availability"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
                    >
                        Issue Book
                    </Link>
                    <Link
                        to="/transactions/return"
                        className="bg-green-600 hover:bg-green-700 text-white text-center py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
                    >
                        Return Book
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default UserHome;
