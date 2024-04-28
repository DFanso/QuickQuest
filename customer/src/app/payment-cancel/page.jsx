"use client"
import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import Link from 'next/link';
import '../globals.css';
import AuthRoute from '../(auth)/AuthRoute';
import Loader from '@/components/Loader';

const PaymentCancelled = () => {


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
  
      return () => clearTimeout(timer);
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
                {/* w-96 is an example, you can use a different width class as needed */}
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-xl w-1/3" style={{ boxShadow: '0px 0px 4px 2px rgba(79, 184, 179, 0.25)' }}>
                    <MdClose className="text-red-500 text-6xl" />
                    <h2 className="text-xl font-semibold text-red-900 mt-4">Payment cancelled</h2>
                    <p className="text-gray-600 mt-4 mb-6">Your payment was not successful <br />No charges have been made.</p>
                    <Link href="/chat">
                        <span className="bg-red-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                            Retry Payment
                        </span>
                    </Link>
                </div>
            </div>
            </AuthRoute>
        </>
    );
};

export default PaymentCancelled;
