import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
 const{data:session}=useSession()
  // Fetch data from the API
  useEffect(() => {

    const jwt=session?.user?.accessToken
    const fetchDashboardData = async () => {
      try {
      
        const productsResponse = await fetch('/api/admin/products');
        const productsData = await productsResponse.json();
        setTotalProducts(productsData.length);

        const usersResponse = await fetch('/api/auth/register',{
          headers:{
            "Authorization":`Bearer ${jwt}`
          }
        });
        const usersData = await usersResponse.json();
        setTotalUsers(usersData.length);

  
        const ordersResponse = await fetch('/api/admin/my-orders',{
          headers:{
            "Authorization":`Bearer ${jwt}`
          }
        });
        const ordersData = await ordersResponse.json();
        setTotalOrders(ordersData.length);
      } catch (error) {
        setError('Error fetching dashboard data.');
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container p-8 text-gray-500">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-white p-4 shadow rounded">
          <h2 className="text-xl">Total Products</h2>
          <p className="text-3xl">{totalProducts}</p>
        </div>
        <div className="card bg-white p-4 shadow rounded">
          <h2 className="text-xl">Total Users</h2>
          <p className="text-3xl">{totalUsers}</p>
        </div>
        <div className="card bg-white p-4 shadow rounded">
          <h2 className="text-xl">Total Orders</h2>
          <p className="text-3xl">{totalOrders}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
