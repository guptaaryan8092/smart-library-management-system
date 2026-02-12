import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';

const AddMembership = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        membershipType: '6 months',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axiosInstance.post('/auth/register', {
                ...formData,
                role: 'user',
            });
            alert('Membership added successfully!');
            navigate('/admin/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding membership');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Add New Membership
            </h1>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            minLength="6"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
                            Membership Type *
                        </label>
                        <select
                            name="membershipType"
                            value={formData.membershipType}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        >
                            <option value="6 months">6 Months</option>
                            <option value="1 year">1 Year</option>
                            <option value="2 years">2 Years</option>
                        </select>
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
                            {loading ? 'Adding...' : 'Add Membership'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddMembership;
