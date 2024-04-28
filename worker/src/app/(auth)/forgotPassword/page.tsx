'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import '../../globals.css';
import { ThreeDots } from 'react-loader-spinner';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/forgot-password`, { email });
      setMessage(response.data.message);
      router.push(`/forgot-password-verification?email=${encodeURIComponent(email)}`);
    } catch (error) {
      // Check if the error is an AxiosError and has the expected structure
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        // Handle unexpected errors
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className='flex flex-col h-screen'>
        <div className="flex items-center justify-center bg-none md:bg-gray-100 m-4 md:m-0 pt-4 md:pt-24 md:pb-24">
          <div className="p-6 bg-white rounded-xl mx-auto max-w-sm" style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}>
            <div className="flex items-center mb-4">
              <button onClick={() => router.back()} className="text-black text-lg">
                &lt;
              </button>
              <h2 className="text-xl font-bold text-gray-700 pl-4">Forgot Password</h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Enter your email address and we will send you a link to reset your password
            </p>
            <div className="mb-4 flex justify-center">
              <img src="/images/forgotPassword-icon.png" alt="Forgot Password" className="max-w-xs" />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                  setMessage('');
                }}
                className="w-full p-2 mt-1 mb-2 border focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md text-black"
                placeholder="Enter your email"
              />
              {emailError && <p className="text-red-500 text-xs mb-2">{emailError}</p>}
              {message && <p className={`text-xs mb-2 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
              <button
                className="mt-2 px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                <span className="flex items-center justify-center">
                  {loading && <ThreeDots color="#ffffff" height={20} width={20} />}
                  <span>Send OTP</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}