import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const books = location.state?.books || [];

    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!selectedBook) {
            setError('Please select a book to issue');
            return;
        }

        navigate('/transactions/issue', { state: { book: selectedBook } });
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Search Results
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            {books.length === 0 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                    No books found matching your criteria
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Select
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Book Name
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Author
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Serial No
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Available
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {books.map((book) => (
                                    <tr key={book._id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-6 py-4">
                                            <input
                                                type="radio"
                                                name="selectedBook"
                                                value={book._id}
                                                checked={selectedBook?._id === book._id}
                                                onChange={() => setSelectedBook(book)}
                                                disabled={!book.isAvailable}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">
                                            {book.title}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">
                                            {book.author}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">
                                            {book.serialNo}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${book.isAvailable
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {book.isAvailable ? 'Available' : 'Issued'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 sm:p-6 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 sm:px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm sm:text-base"
                        >
                            Back to Search
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm sm:text-base"
                        >
                            Confirm Selection
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default SearchResults;
