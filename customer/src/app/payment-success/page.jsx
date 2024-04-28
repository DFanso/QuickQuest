"use client";
import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import '../globals.css';
import AuthRoute from '../(auth)/AuthRoute';
import Loader from '@/components/Loader';

const PaymentSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 15000); // 10 seconds delay

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader/>
      </div>
    );
  }

  return (
    <>
      <AuthRoute>
        <div className='flex flex-col items-center justify-center min-h-screen'>
          {/* Apply the same w-96 class for consistent width with the PaymentCancelled card */}
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-xl w-1/3" style={{ boxShadow: '0px 0px 4px 2px rgba(79, 184, 179, 0.25)' }}>
            <IoCheckmarkCircleOutline className="text-teal-500 text-6xl" />
            <h2 className="text-xl font-semibold text-teal-900 mt-4">Payment succeeded</h2>
            <p className="text-gray-600 mt-4 mb-6">Thank you for your purchase</p>
            <Link href="/profile">
              <span className="bg-teal-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                Go to Ongoing Orders
              </span>
            </Link>
          </div>
        </div>
      </AuthRoute>
    </>
  );
};

export default PaymentSuccess;