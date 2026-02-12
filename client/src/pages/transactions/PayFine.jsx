import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../api/axiosInstance';

const PayFine = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const issue = location.state?.issue;

    const [finePaid, setFinePaid] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayFine = async () => {
        setError('');

        // Validation: If fine > 0, checkbox must be checked
        if (issue.fineAmount > 0 && !finePaid) {
            setError('Please confirm fine payment by checking the box');
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post(`/issues/payfine/${issue._id}`);
            alert('Book return completed successfully!');
            navigate('/user/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Error processing payment');
        } finally {
            setLoading(false);
        }
    };

    if (!issue) {
        return (
            <div>
                <Navbar />
                <div className="flex">
                    <Sidebar />
                    <div className="flex-1 p-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            No issue details found. Please return a book first.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Pay Fine</h1>

                    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold mb-3">Return Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Book:</span>
                                    <p className="font-semibold">{issue.bookId.title}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Author:</span>
                                    <p className="font-semibold">{issue.bookId.author}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Serial No:</span>
                                    <p className="font-semibold">{issue.bookId.serialNo}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">User:</span>
                                    <p className="font-semibold">{issue.userId.name}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Expected Return:</span>
                                    <p className="font-semibold">
                                        {new Date(issue.returnDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Actual Return:</span>
                                    <p className="font-semibold">
                                        {new Date(issue.actualReturnDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-6 rounded-lg mb-6 text-center ${issue.fineAmount > 0
                                    ? 'bg-red-100 border-2 border-red-400'
                                    : 'bg-green-100 border-2 border-green-400'
                                }`}
                        >
                            <div className="text-sm text-gray-700 mb-2">Fine Amount</div>
                            <div
                                className={`text-4xl font-bold ${issue.fineAmount > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}
                            >
                                ₹{issue.fineAmount}
                            </div>
                            {issue.fineAmount === 0 && (
                                <p className="text-sm text-green-700 mt-2">
                                    No fine! Returned on time.
                                </p>
                            )}
                        </div>

                        {issue.fineAmount > 0 && (
                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={finePaid}
                                        onChange={(e) => setFinePaid(e.target.checked)}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-gray-700 font-semibold">
                                        I confirm that the fine of ₹{issue.fineAmount} has been paid
                                    </span>
                                </label>
                            </div>
                        )}

                        <button
                            onClick={handlePayFine}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                        >
                            {loading
                                ? 'Processing...'
                                : issue.fineAmount > 0
                                    ? 'Confirm Payment & Complete Return'
                                    : 'Complete Return'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayFine;
