'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../globals.css';
import { ThreeDots } from 'react-loader-spinner';

export default function ForgotPassword() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setEmail(searchParams.get('email') || '');
    }
  }, [searchParams]);

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOtp = [...otp];
    const value = event.target.value;

    // Update the input box with the new value
    newOtp[index] = value.slice(-1);

    // Move focus to the next input box if the current one is filled
    if (value && index < otp.length - 1) {
      (event.target.nextSibling as HTMLInputElement)?.focus();
    }

    // Move focus to the previous input box if the current one is empty and the previous one is filled
    if (!value && index > 0 && newOtp[index - 1]) {
      (event.target.previousSibling as HTMLInputElement)?.focus();
    }

    setOtp(newOtp);
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = event.clipboardData.getData('text/plain');
    const newOtp = pastedValue.split('').slice(0, 6).map((char: string) => char || '');
    setOtp(newOtp);
  };

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewPassword(value);

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: '',
      }));
    }
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setConfirmPassword(value);

    if (value !== newPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Passwords do not match.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: '',
      }));
    }
  };

  const handleSubmit = async () => {
    // Check if all fields are valid
    const isOtpValid = otp.every((value) => value !== '');
    const isPasswordValid = newPassword !== '' && errors.newPassword === '';
    const isConfirmPasswordValid = confirmPassword !== '' && errors.confirmPassword === '';

    if (!isOtpValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otp: 'Please enter a valid OTP.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otp: '',
      }));
    }

    if (isOtpValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        setLoading(true);
        const confirmationCode = otp.join('');
        const newPasswordValue = newPassword;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/confirm-forgot-password`,
          {
            email,
            confirmationCode,
            newPassword: newPasswordValue,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password successfully changed!',
          confirmButtonColor: '#14b8a6',
        }).then(() => {
          router.push('/login'); 
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error occurred while updating password',
            confirmButtonColor: '#14b8a6',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An unexpected error occurred',
            confirmButtonColor: '#14b8a6',
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <div className="flex flex-1 items-center justify-center bg-none md:bg-gray-100 m-4 md:m-0 pt-4 md:pt-24 md:pb-24">
          {loading ? (
            <div className="flex items-center justify-center">
              <ThreeDots color="#4FB8B3" height={80} width={80} />
            </div>
          ) : (
            <div
              className="py-10 px-12 bg-white rounded-xl mx-auto"
              style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)", maxWidth: "700px" }}
            >
              <div className="flex items-center mb-8">
                <button onClick={() => router.back()} className="text-black text-lg">
                  &lt;
                </button>
                <h2 className="text-xl font-bold text-gray-700 pl-4">Forgot Password</h2>
              </div>
              <div>
                <p className='text-black text-lg text-center pb-8'>Enter your OTP</p>
              </div>
              <div className="flex justify-between mb-12">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(event) => handleOtpChange(event, index)}
                    onPaste={handleOtpPaste}
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "1px solid #173735",
                      borderRadius: "5px",
                      margin: "0 4px",
                    }}
                    className="text-center text-black focus:ring-teal-500 focus:border-teal-500"
                  />
                ))}
              </div>
              {errors.otp && <p className="text-red-500 text-xs mb-2">{errors.otp}</p>}
              {/* New Password Input */}
              <div className="flex flex-col mb-6">
                <label htmlFor="new-password" className="mb-2 text-sm text-gray-600">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="p-2 text-black border focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
                />
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>
              {/* Confirm Password Input */}
              <div className="flex flex-col mb-6">
                <label htmlFor="confirm-password" className="mb-2 text-sm text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="p-2 border text-black focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              {/* Confirm Button */}
              <button
                className="w-full px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}