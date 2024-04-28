'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import '../../globals.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const PaymentMethodPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to access PayPal Auth.',
        icon: 'warning',
        confirmButtonText: 'Login',
        confirmButtonColor: '#FFC43A',
      }).then(() => {
        router.push('/login');
      });
    }
  }, []);

  const handlePayPalAuth = async () => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/paypal/auth`, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });

        const redirectUrl = response.data;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Error during PayPal authentication:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred during PayPal authentication. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FFC43A',
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-black">
        <div className="text-2xl font-bold mb-6">Payment Method</div>
        <div className="text-lg font-semibold mb-4">Connect with Paypal</div>
        <button
          className="flex items-center justify-center bg-[#FFC43A] text-black font-bold py-2 px-4 rounded-md shadow-lg mb-6"
          onClick={handlePayPalAuth}
        >
          <FontAwesomeIcon icon={faPaypal} size="lg" className="mr-2" />
          PayPal
        </button>
        <div className="text-center text-sm">
          Connect Your PayPal Account to receive Payouts from your Jobs.
        </div>
      </div>
    </>
  );
};

export default PaymentMethodPage;