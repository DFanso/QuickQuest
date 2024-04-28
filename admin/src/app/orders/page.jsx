"use client"
import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Service:</strong></p>
                <ul className="ml-4">
                    <li>Name: {order.service.name}</li>
                    <li>Description: {order.service.description}</li>
                    <li>Category: {order.service.category.name}</li>
                    <li>Starting Price: ${order.service.startingPrice}</li>
                </ul>
                <p><strong>Customer:</strong></p>
                <ul className="ml-4">
                    <li>Name: {order.customer.firstName} {order.customer.lastName}</li>
                    <li>Email: {order.customer.email}</li>
                    <li>Location: {order.customer.location.coordinates.join(', ')}</li>
                </ul>
                <p><strong>Worker:</strong></p>
                <ul className="ml-4">
                    <li>Name: {order.worker.firstName} {order.worker.lastName}</li>
                    <li>Email: {order.worker.email}</li>
                    <li>Location: {order.worker.location.coordinates.join(', ')}</li>
                </ul>
                <p><strong>Order Date:</strong> {new Date(order.orderedDate).toLocaleDateString()}</p>
                <p><strong>Completion Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                <p><strong>Price:</strong> ${order.price}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment URL:</strong> <a href={order.paymentUrl} target="_blank" rel="noopener noreferrer">{order.paymentUrl}</a></p>
                <p><strong>PayPal Order ID:</strong> {order.paypalOrderId}</p>
                <p><strong>Description:</strong> {order.description}</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const OrdersPage = () => {
    const [ordersData, setOrdersData] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/jobs/admin`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrdersData(response.data);
                setFilteredOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [selectedStatus, searchTerm]);

    const filterOrders = () => {
        let filtered = ordersData;

        if (selectedStatus !== 'all') {
            filtered = filtered.filter((order) => order.status === selectedStatus.toUpperCase());
        }

        if (searchTerm) {
            filtered = filtered.filter((order) =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.worker.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    };

    const renderStatusButton = (status) => {
        const baseStyle = "px-4 py-1 text-xs rounded-full text-white w-24 text-center";
        let statusStyle = baseStyle;
        if (status === 'COMPLETED') {
            statusStyle += ' bg-green-500';
        } else if (status === 'PENDING') {
            statusStyle += ' bg-yellow-500';
        } else if (status === 'PROCESSING') {
            statusStyle += ' bg-blue-500';
        } else {
            statusStyle += ' bg-red-500';
        }
        return <button className={statusStyle}>{status}</button>;
    };

    const handleMoreInfoClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleDeleteOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/jobs/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        accept: '*/*'
                    }
                });
                setOrdersData(ordersData.filter((order) => order._id !== orderId));
                setFilteredOrders(filteredOrders.filter((order) => order._id !== orderId));
                Swal.fire('Deleted!', 'The order has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting order:', error);
                Swal.fire('Error!', 'An error occurred while deleting the order.', 'error');
            }
        }
    };

    return (
        <div className="p-4 text-black mt-16">
            <h1 className="text-2xl font-medium text-center mb-4">Orders</h1>
            <div className="flex justify-center mb-4">
                <div className="flex border-2 border-gray-400 rounded-lg overflow-hidden">
                    <input
                        type="text"
                        placeholder="Search orders"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-1 px-4 w-64"
                    />
                    <button className="p-2 bg-teal-500 text-white">
                        <FaSearch />
                    </button>
                </div>
            </div>

            <div className="flex justify-center mb-6 space-x-2">
                <button className={`px-4 py-2 text-center ${selectedStatus === 'all' ? 'text-blue-500 font-bold' : 'text-gray-500'}`} onClick={() => setSelectedStatus('all')}>Orders</button>
                <button className={`px-4 py-2 text-center ${selectedStatus === 'completed' ? 'text-green-500 font-bold' : 'text-gray-500'}`} onClick={() => setSelectedStatus('completed')}>Completed</button>
                <button className={`px-4 py-2 text-center ${selectedStatus === 'pending' ? 'text-yellow-500 font-bold' : 'text-gray-500'}`} onClick={() => setSelectedStatus('pending')}>Pending</button>
                <button className={`px-4 py-2 text-center ${selectedStatus === 'processing' ? 'text-blue-500 font-bold' : 'text-gray-500'}`} onClick={() => setSelectedStatus('processing')}>Processing</button>
                <button className={`px-4 py-2 text-center ${selectedStatus === 'cancelled' ? 'text-red-500 font-bold' : 'text-gray-500'}`} onClick={() => setSelectedStatus('cancelled')}>Cancelled</button>
            </div>

            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-x-4 text-xs font-bold mb-2 px-4 py-2 bg-gray-100 rounded-t-lg">
                <span className="text-center">Order ID</span>
                <span className="text-center">Service</span>
                <span className="text-center">Customer</span>
                <span className="text-center">Worker</span>
                <span className="text-center">Order Date</span>
                <span className="text-center">Completion Date</span>
                <span className="text-center">Price</span>
                <span className="text-center">Status</span>
                <span className="text-center">More Info</span>
                <span className="text-center">Delete</span>
            </div>

            {filteredOrders.map((order, index) => (
                <div key={index} className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-x-4 items-center mb-2 py-2 px-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <span className="text-center">{order._id}</span>
                    <span className="text-center">{order.service.name}</span>
                    <span className="text-center">{order.customer.firstName} {order.customer.lastName}</span>
                    <span className="text-center">{order.worker.firstName} {order.worker.lastName}</span>
                    <span className="text-center">{new Date(order.orderedDate).toLocaleDateString()}</span>
                    <span className="text-center">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                    <span className="text-center">${order.price}</span>
                    <div className="text-center">{renderStatusButton(order.status)}</div>
                    <div className="text-center">
                        <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs" onClick={() => handleMoreInfoClick(order)}>More Info</button>
                    </div>
                    <div className="text-center">
                        <button className="px-2 py-1 bg-red-500 text-white rounded text-xs" onClick={() => handleDeleteOrder(order._id)}>
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}

            <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
        </div>
    );
};

export default OrdersPage;