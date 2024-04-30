"use client"
import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import '../styles/globals.css';
import AuthRoute from './(auth)/AuthRoute';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';

const JobStatus = {
  Processing: 'PROCESSING',
  Pending: 'PENDING',
  Cancelled: 'CANCELLED',
  Completed: 'COMPLETED',
};

const getStatusColor = (status) => {
  switch (status) {
    case JobStatus.Processing:
      return 'bg-yellow-500';
    case JobStatus.Pending:
      return 'bg-blue-500';
    case JobStatus.Cancelled:
      return 'bg-red-500';
    case JobStatus.Completed:
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const OrderCard = ({ profilePic, name, task, dueDate, price, status, image, orderId, orderedDate }) => {
  return (
    <div className="flex flex-col sm:flex-row mt-4 mx-4 sm:mx-20 items-center justify-between p-4 bg-white rounded text-black shadow" style={{ boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)', borderRadius: '5px' }}>
      <img src={profilePic} alt={name} className="rounded-full h-12 w-12 mb-4 sm:mb-0 object-cover" />
      <span>{name}</span>
      <span>Order ID: {orderId}</span>
      <span className="flex items-center">
        <img src={image} alt="Task Icon" className="h-6 w-6 mr-2" />
        {task}
      </span>
      <span>Ordered on: {new Date(orderedDate).toLocaleDateString()}</span>
      <span>Due on {dueDate}</span>
      <span>{price}</span>
      <div className='flex md:mt-0 mt-2'>
        <button className={`${getStatusColor(status)} hover:bg-opacity-80 duration-700 text-white py-1.5 px-4 rounded`}>{status}</button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongoingJobsCount, setOngoingJobsCount] = useState(0);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));
        setOrders(sortedOrders);

        const ongoingCount = sortedOrders.filter(order => order.status === JobStatus.Pending).length;
        setOngoingJobsCount(ongoingCount);

        const completedCount = sortedOrders.filter(order => order.status === JobStatus.Completed).length;
        setCompletedJobsCount(completedCount);

        const earnings = sortedOrders.filter(order => order.status === JobStatus.Completed).reduce((total, order) => total + order.price, 0);
        setTotalEarnings(earnings);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterOrders = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const filteredOrders = orders.filter((order) => {
    const orderedDate = new Date(order.orderedDate);
    const currentDate = new Date();

    if (selectedTimeRange === '30days') {
      const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
      return orderedDate >= thirtyDaysAgo;
    } else if (selectedTimeRange === '60days') {
      const sixtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 60));
      return orderedDate >= sixtyDaysAgo;
    }

    return true;
  });

  return (
    <>
      <AuthRoute>
        <div className="min-h-screen bg-gray-100 py-8">
          <h1 className="text-center text-2xl font-medium md:mb-14 mb-4 text-black">Order Dashboard</h1>
          <div className="flex md:flex-row flex-col justify-center space-x-2  md:space-x-14 mb-0">
            {/* Earnings card */}
            <div className="md:p-8 p-4 md:m-0 m-2 bg-teal-500 rounded text-white shadow" style={{ borderRadius: '10px', boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)' }}>
              <div className="text-center">
                <h2 className="text-lg mb-4">Earnings to date</h2>
                <p className="text-3xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>

            {/* Jobs Completed card */}
            <div className="md:p-8 p-4 md:m-0 m-2 bg-teal-500 rounded text-white shadow" style={{ borderRadius: '10px', boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)' }}>
              <div className="text-center">
                <h2 className="text-lg mb-4">Total Jobs Completed</h2>
                <p className="text-3xl font-bold">{completedJobsCount}</p>
              </div>
            </div>

            {/* Ongoing Jobs card */}
            <div className="md:p-8 p-4 md:m-0 m-2 bg-teal-500 rounded text-white shadow" style={{ borderRadius: '10px', boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)' }}>
              <div className="text-center">
                <h2 className="text-lg mb-4">Ongoing Jobs</h2>
                <p className="text-3xl font-bold">{ongoingJobsCount}</p>
              </div>
            </div>
          </div>

          <div className='mx-4 sm:mx-20 mb-8'>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-black mb-4 md:mt-0 mt-6 sm:mb-0">Ongoing Orders</h2>
              <div className="flex flex-wrap mt-0 md:mt-8">
                <button
                  className={`px-4 py-2 rounded mr-2  ${selectedTimeRange === '30days' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => filterOrders('30days')}
                >
                  Past 30 Days
                </button>
                <button
                  className={`px-4 py-2 rounded mx-0 mr-2  ${selectedTimeRange === '60days' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => filterOrders('60days')}
                >
                  Past 60 Days
                </button>
                <button
                  className={`px-4 py-2  rounded ${selectedTimeRange === 'all' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => filterOrders('all')}
                >
                  All Time
                </button>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center">
                <ThreeDots color="#4FB8B3" height={80} width={80} />
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <OrderCard
                  key={index}
                  profilePic={order.customer.profileImage}
                  name={`${order.customer.firstName} ${order.customer.lastName}`}
                  task={order.service.name}
                  image={order.service.category.iconUrl}
                  dueDate={new Date(order.deliveryDate).toLocaleDateString()}
                  price={`$${order.price}`}
                  status={order.status}
                  orderId={order._id}
                  orderedDate={order.orderedDate}
                />
              ))
            )}
          </div>
        </div>
      </AuthRoute>
    </>
  );
};

export default Dashboard;