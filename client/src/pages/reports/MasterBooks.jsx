import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';

const MasterBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axiosInstance.get('/reports/books');
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Master Books Report
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
                                        Title
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Author
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Category
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Serial No
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Cost
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {books.map((book) => (
                                    <tr key={book._id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-6 py-4 text-sm">{book.title}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{book.author}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{book.category}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{book.serialNo}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">₹{book.cost}</td>
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
                    <div className="p-3 sm:p-4 bg-gray-50 text-sm text-gray-600">
                        Total Books: {books.length}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default MasterBooks;
