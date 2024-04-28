import React from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import '../styles/globals.css';

const PaymentSuccess = () => {
    return (
        <>
            <Navbar />
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-lg" style={{ boxShadow: '0px 0px 4px 2px rgba(79, 184, 179, 0.25)', width: 'fit-content' }}>
                    <IoCheckmarkCircleOutline className="text-teal-500 text-6xl" />
                    <h2 className="text-xl font-semibold text-teal-900 mt-4">Payment succeeded</h2>
                    <p className="text-gray-600 mt-4 mb-6">Thank you for your purchase</p>
                    <Link href="/ongoing-orders">
                        <span className="bg-teal-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                            Go to Ongoing Orders
                        </span>
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentSuccess;
