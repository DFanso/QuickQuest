"use client";
import { useRouter,useSearchParams } from 'next/navigation';
import '../../globals.css';
import { useState, useRef ,useEffect} from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

export default function VerifyEmail() {
  const router = useRouter(); 
  const [inputEmail, setInputEmail] = useState(''); 
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setInputEmail(searchParams.get('email') || '');
    }
  }, [searchParams]);

  const handleEmailChange = (e) => {
    setInputEmail(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value !== '') {
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    const pastedValue = e.clipboardData.getData('text/plain');
    const newOtp = pastedValue.split('').slice(0, 6).map((char) => char || '');
    setOtp(newOtp);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/request-verification-code`, {
        email: inputEmail,
      });
      Swal.fire('OTP Resent', 'A new OTP has been sent to your email.', 'success');
    } catch (error) {
      console.error('Error resending OTP:', error);
      Swal.fire('Error', 'An error occurred while resending the OTP.', 'error');
    }
    setIsLoading(false);
  };

  const handleConfirm = async () => {
    if (!validateEmail(inputEmail)) {
      Swal.fire('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    if (otp.some(digit => digit === '')) {
      Swal.fire('Incomplete OTP', 'Please enter the complete OTP.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/verify`, {
        email: inputEmail,
        confirmationCode: otp.join(''),
      });
      router.push("/login");
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Swal.fire('Error', 'An error occurred while verifying the OTP.', 'error');
    }
    setIsLoading(false);
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <div className="flex flex-1 items-center justify-center bg-none md:bg-gray-100 m-4 md:m-0 pt-4 md:pt-24 md:pb-24 ">
          <div className="py-10 px-12 bg-white rounded-xl mx-auto" style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)", maxWidth: "700px" }}>
            <div className="flex items-center mb-8">
              <button onClick={() => router.back()} className="text-black text-lg">
                &lt;
              </button>
              <h2 className="text-xl font-bold text-gray-700 pl-4">Verify Email</h2>
            </div>
            <div className="mb-8">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={inputEmail}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex justify-between mb-8">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(e, index)}
                  onPaste={handleOtpPaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={{ width: "40px", height: "40px", border: "1px solid #173735", borderRadius: "5px", margin: "0 4px" }}
                  className="text-center text-black focus:ring-teal-500 focus:border-teal-500"
                />
              ))}
            </div>
            <div className="text-center mb-8">
              <button
                onClick={handleResendOtp}
                className="text-teal-500 hover:underline focus:outline-none"
              >
                Resend OTP
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <ThreeDots color="#4FB8B3" height={80} width={80} />
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                className="w-full px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}