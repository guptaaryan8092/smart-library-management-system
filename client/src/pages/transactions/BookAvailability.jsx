import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';

const BookAvailability = () => {
    const [bookName, setBookName] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');

        // Validation: At least one field required
        if (!bookName && !author && !category) {
            setError('Please provide at least one search criteria');
            return;
        }

        setLoading(true);

        try {
            const params = {};
            if (bookName) params.title = bookName;
            if (author) params.author = author;
            if (category) params.category = category;

            const response = await axiosInstance.get('/books/available', { params });

            // Navigate to search results with data
            navigate('/transactions/search-results', {
                state: { books: response.data.data },
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching books');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Search Available Books
            </h1>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl">
                <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Book Name
                        </label>
                        <input
                            type="text"
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            placeholder="Enter book name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            placeholder="Enter author name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        >
                            <option value="">Select category</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Non-Fiction">Non-Fiction</option>
                            <option value="Science">Science</option>
                            <option value="Technology">Technology</option>
                            <option value="History">History</option>
                            <option value="Biography">Biography</option>
                            <option value="Drama">Drama</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Action">Action</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setBookName('');
                                setAuthor('');
                                setCategory('');
                                setError('');
                            }}
                            className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default BookAvailability;
