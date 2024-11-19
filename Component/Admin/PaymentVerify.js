import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      const jwt = session?.user?.accessToken;
      if (!jwt) {
        setError("No access token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/my-orders', {
          headers: {
            "Authorization": `Bearer ${jwt}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter orders based on the query
    const filtered = orders.filter((order) => {
      return (
        order.title.toLowerCase().includes(query.toLowerCase()) ||
        order.userId.toLowerCase().includes(query.toLowerCase()) ||
        order.payment_method.toLowerCase().includes(query.toLowerCase())
      );
    });

    setOrders(filtered);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 text-gray-500">
      <h1 className="text-2xl font-semibold mb-4">Admin - My Orders</h1>

      {/* Search Input */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Title, User ID, or Payment Method"
          className="px-4 py-2 w-full border rounded-lg shadow-md"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
            <th className="px-4 py-2">razorpay_order_id</th>
         <th className="px-4 py-2">razorpay_payment_id</th>
        <th className="px-4 py-2">amount</th>
           <th className="px-4 py-2">currency</th>
         <th className="px-4 py-2">order_status</th>
          <th className="px-4 py-2">payment_method</th>
        <th className="px-4 py-2">order_data</th>

            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-2">{order._id}</td>
                 
                  <td className="px-4 py-2">{order.razorpay_order_id}</td>
                <td className="px-4 py-2">{order.razorpay_payment_id}</td>
                <td className="px-4 py-2">₹{order.amount / 100}</td>
                <td className="px-4 py-2">{order.currency}</td>
                <td className="px-4 py-2">{order.order_status}</td>
                <td className="px-4 py-2">{order.payment_method}</td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-2 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrder;
