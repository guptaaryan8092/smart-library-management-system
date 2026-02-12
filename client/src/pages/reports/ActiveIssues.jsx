import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';

const ActiveIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await axiosInstance.get('/reports/active-issues');
            setIssues(response.data.data);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Active Issues Report
            </h1>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Book
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        User
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Serial No
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Issue Date
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Return Date
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {issues.map((issue) => (
                                    <tr key={issue._id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-6 py-4 text-sm">{issue.bookId.title}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{issue.userId.name}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{issue.bookId.serialNo}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
                                            {new Date(issue.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
                                            {new Date(issue.returnDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                                                {issue.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 text-sm text-gray-600">
                        Total Active Issues: {issues.length}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ActiveIssues;
