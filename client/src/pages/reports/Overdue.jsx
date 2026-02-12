import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../api/axiosInstance';

const Overdue = () => {
    const [overdueIssues, setOverdueIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverdue();
    }, []);

    const fetchOverdue = async () => {
        try {
            const response = await axiosInstance.get('/reports/overdue');
            setOverdueIssues(response.data.data);
        } catch (error) {
            console.error('Error fetching overdue:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">
                        Overdue Returns Report
                    </h1>

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {overdueIssues.length === 0 ? (
                                <div className="p-8 text-center text-gray-600">
                                    No overdue returns found
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        Book
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        User
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        Serial No
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        Expected Return
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        Days Overdue
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        Estimated Fine
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {overdueIssues.map((issue) => (
                                                    <tr key={issue._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">{issue.bookId.title}</td>
                                                        <td className="px-6 py-4">{issue.userId.name}</td>
                                                        <td className="px-6 py-4">{issue.bookId.serialNo}</td>
                                                        <td className="px-6 py-4">
                                                            {new Date(issue.returnDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                {issue.daysOverdue} days
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-red-600 font-semibold">
                                                            ₹{issue.estimatedFine}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 bg-gray-50 text-sm text-gray-600">
                                        Total Overdue: {overdueIssues.length}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overdue;
