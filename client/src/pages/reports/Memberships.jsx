import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosInstance';

const Memberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async () => {
        try {
            const response = await axiosInstance.get('/reports/memberships');
            setMemberships(response.data.data);
        } catch (error) {
            console.error('Error fetching memberships:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Memberships Report
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
                                        Name
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Email
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Membership No
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Type
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Expiry
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {memberships.map((member) => (
                                    <tr key={member._id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-6 py-4 text-sm">{member.name}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{member.email}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{member.membershipNumber}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm">{member.membershipType}</td>
                                        <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
                                            {new Date(member.membershipExpiry).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${member.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 text-sm text-gray-600">
                        Total Memberships: {memberships.length}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Memberships;
