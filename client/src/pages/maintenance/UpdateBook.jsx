import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';

const UpdateBook = () => {
    const [searchId, setSearchId] = useState('');
    const [book, setBook] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchId) {
            setError('Please enter Book ID');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.get(`/books`);
            const foundBook = response.data.data.find((b) => b._id === searchId);

            if (!foundBook) {
                setError('Book not found');
                setBook(null);
            } else {
                setBook(foundBook);
                setFormData(foundBook);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching book');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axiosInstance.put(`/books/${book._id}`, formData);
            alert('Book updated successfully!');
            navigate('/admin/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Update Book</h1>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Enter Book ID"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {book && (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                                Author *
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author || ''}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                                Category *
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category || ''}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                                Cost *
                            </label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost || ''}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                min="0"
                                required
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
                                {loading ? 'Updating...' : 'Update Book'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Layout>
    );
};

export default UpdateBook;
