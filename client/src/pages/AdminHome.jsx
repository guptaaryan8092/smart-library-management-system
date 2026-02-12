import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import axiosInstance from '../api/axiosInstance';

const AdminHome = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalMovies: 0,
        activeIssues: 0,
        overdueIssues: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [booksRes, moviesRes, activeRes, overdueRes] = await Promise.all([
                axiosInstance.get('/reports/books'),
                axiosInstance.get('/reports/movies'),
                axiosInstance.get('/reports/active-issues'),
                axiosInstance.get('/reports/overdue'),
            ]);

            setStats({
                totalBooks: booksRes.data.count,
                totalMovies: moviesRes.data.count,
                activeIssues: activeRes.data.count,
                overdueIssues: overdueRes.data.count,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 sm:p-6">
                    <div className="text-3xl sm:text-4xl font-bold">{stats.totalBooks}</div>
                    <div className="text-base sm:text-lg mt-2">Total Books</div>
                </div>

                <div className="bg-purple-500 text-white rounded-lg shadow-lg p-4 sm:p-6">
                    <div className="text-3xl sm:text-4xl font-bold">{stats.totalMovies}</div>
                    <div className="text-base sm:text-lg mt-2">Total Movies</div>
                </div>

                <div className="bg-green-500 text-white rounded-lg shadow-lg p-4 sm:p-6">
                    <div className="text-3xl sm:text-4xl font-bold">{stats.activeIssues}</div>
                    <div className="text-base sm:text-lg mt-2">Active Issues</div>
                </div>

                <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 sm:p-6">
                    <div className="text-3xl sm:text-4xl font-bold">{stats.overdueIssues}</div>
                    <div className="text-base sm:text-lg mt-2">Overdue Returns</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <Link
                        to="/maintenance/add-book"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
                    >
                        Add New Book
                    </Link>
                    <Link
                        to="/maintenance/add-membership"
                        className="bg-green-600 hover:bg-green-700 text-white text-center py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
                    >
                        Add Membership
                    </Link>
                    <Link
                        to="/reports/overdue"
                        className="bg-red-600 hover:bg-red-700 text-white text-center py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
                    >
                        View Overdue
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default AdminHome;
