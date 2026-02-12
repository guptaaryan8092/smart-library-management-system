import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../api/axiosInstance';

const ReturnBook = () => {
    const [serialNo, setSerialNo] = useState('');
    const [issueDetails, setIssueDetails] = useState(null);
    const [actualReturnDate, setActualReturnDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!serialNo) {
            setError('Please enter serial number');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // First get all active issues, then filter by serial number
            const response = await axiosInstance.get('/reports/active-issues');
            const issue = response.data.data.find(
                (iss) => iss.bookId.serialNo === serialNo && iss.status === 'Issued'
            );

            if (!issue) {
                setError('No active issue found for this serial number');
                setIssueDetails(null);
            } else {
                setIssueDetails(issue);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching issue details');
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post(
                `/issues/return/${issueDetails._id}`,
                {
                    actualReturnDate,
                }
            );

            // Navigate to pay fine page
            navigate('/transactions/pay-fine', {
                state: { issue: response.data.data },
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error returning book');
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Return Book</h1>

                    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                value={serialNo}
                                onChange={(e) => setSerialNo(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Serial Number *"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>

                        {issueDetails && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-3">Issue Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Book:</span>
                                            <p className="font-semibold">{issueDetails.bookId.title}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Author:</span>
                                            <p className="font-semibold">{issueDetails.bookId.author}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Serial No:</span>
                                            <p className="font-semibold">{issueDetails.bookId.serialNo}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">User:</span>
                                            <p className="font-semibold">{issueDetails.userId.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Issue Date:</span>
                                            <p className="font-semibold">
                                                {new Date(issueDetails.issueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Expected Return:</span>
                                            <p className="font-semibold">
                                                {new Date(issueDetails.returnDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Actual Return Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={actualReturnDate}
                                        onChange={(e) => setActualReturnDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <button
                                    onClick={handleReturn}
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Submit Return'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnBook;
