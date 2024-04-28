"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaPaypal } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Link from 'next/link';
import '../globals.css';
import { MdAccessTime } from "react-icons/md";
import AuthRoute from '../(auth)/AuthRoute';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import Swal from 'sweetalert2';

const PaymentPage = () => {
  const [offer, setOffer] = useState(null);
  const [offerId, setOfferId] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams) {
      const queryOfferId = searchParams.get('offerId');
      setOfferId(queryOfferId || '');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOffer = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/offers/${offerId}`);
        setOffer(response.data);
      } catch (error) {
        console.error('Error fetching offer:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (offerId) {
      fetchOffer();
    }
  }, [offerId, router]);

  const handlePaymentClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/offers/${offerId}/accept`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
        window.open(response.data.paymentUrl, '_blank');
        router.push('/');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while processing the payment. Please try again later.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ThreeDots color="#4FB8B3" height={80} width={80} />
      </div>
    );
  }

  if (!offer) {
    return <div className="flex items-center justify-center h-screen">
    <ThreeDots color="#4FB8B3" height={80} width={80} />
  </div>;
  }
  return (
    <>
      <AuthRoute>
        <div className='flex justify-center items-center h-screen'>
          <div className="w-1/2 p-6 bg-white rounded-lg shadow-lg relative" style={{ marginTop: '-5rem' }}>
            {/* marginTop adjustment for Navbar */}
            <Link href="/chat">
              <span className="absolute top-4 right-4 text-xl">
                <MdClose />
              </span>
            </Link>
            <div className="flex items-center">
              <div className="p-2 rounded-full mr-2">
                <img src={offer.service.category.iconUrl} className="w-8 h-8" alt={offer.service.name} />
              </div>
              <h3 className="font-bold text-lg text-teal-500">{offer.service.name}</h3>
              <span className="ml-auto text-xl font-bold text-teal-500">${offer.price}</span>
            </div>
            <p className="text-gray-600 my-4">{offer.description}</p>
            <div className="flex items-center mb-4">
              <div className=" rounded-full mr-1">
                <MdAccessTime className='text-teal-500' />
              </div>
              <span className="text-teal-900 font-medium">
                {Math.ceil((new Date(offer.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))} day delivery
              </span>
            </div>
            <div className='flex items-center justify-center'>
              <button
                className=" w-1/2 py-2 flex items-center justify-center px-4 bg-yellow-400 rounded-md"
                onClick={handlePaymentClick}
              >
                <FaPaypal className="text-xl mr-2" /> Pay with PayPal
              </button>
            </div>
          </div>
        </div>
      </AuthRoute>
    </>
  );
};

export default PaymentPage;