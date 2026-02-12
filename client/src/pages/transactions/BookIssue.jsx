import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';

const BookIssue = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const book = location.state?.book;

    const [issueDate, setIssueDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set default issue date to today
        const today = new Date().toISOString().split('T')[0];
        setIssueDate(today);
    }, []);

    useEffect(() => {
        // Auto-calculate return date (15 days from issue date)
        if (issueDate) {
            const issue = new Date(issueDate);
            const returnDt = new Date(issue);
            returnDt.setDate(returnDt.getDate() + 15);
            setReturnDate(returnDt.toISOString().split('T')[0]);
        }
    }, [issueDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate issue date (cannot be less than today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const issueDt = new Date(issueDate);
        issueDt.setHours(0, 0, 0, 0);

        if (issueDt < today) {
            setError('Issue date cannot be before today');
            return;
        }

        // Validate return date (cannot exceed 15 days)
        const returnDt = new Date(returnDate);
        const maxReturn = new Date(issueDt);
        maxReturn.setDate(maxReturn.getDate() + 15);

        if (returnDt > maxReturn) {
            setError('Return date cannot exceed 15 days from issue date');
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post('/issues', {
                bookId: book._id,
                issueDate,
                returnDate,
            });

            alert('Book issued successfully!');
            navigate('/user/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Error issuing book');
        } finally {
            setLoading(false);
        }
    };

    if (!book) {
        return (
            <Layout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                    No book selected. Please search for a book first.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Issue Book</h1>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Selected Book</h3>
                        <p className="text-sm">
                            <strong>Title:</strong> {book.title}
                        </p>
                        <p className="text-sm">
                            <strong>Author:</strong> {book.author}
                        </p>
                        <p className="text-sm">
                            <strong>Serial No:</strong> {book.serialNo}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Issue Date *
                        </label>
                        <input
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Return Date * (Auto-calculated: 15 days from issue)
                        </label>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        />
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Maximum 15 days from issue date
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Remarks (Optional)
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows="3"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            placeholder="Any additional notes..."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 sm:px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? 'Issuing...' : 'Issue Book'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default BookIssue;
