'use client';
import React, { FormEvent, useState } from 'react';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from 'next/link';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import '../../globals.css';
import Swal from 'sweetalert2';
import { useAuth } from '@/app/contexts/AuthContext';
import { loginUser, fetchUserProfile } from '@/app/lib/api/auth';
import { useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleGoogleSignIn = () => {
    const googleSSOUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/google-signin`;
    window.location.href = googleSSOUrl;
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate form fields
    const validationErrors = {
      email: '',
      password: '',
    };

    if (!event.currentTarget.email.value) {
      validationErrors.email = 'Email is required';
    }
    if (!event.currentTarget.password.value) {
      validationErrors.password = 'Password is required';
    }

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const token = await loginUser(
        event.currentTarget.email.value,
        event.currentTarget.password.value
      );
      
      const fetchedUser = await fetchUserProfile(token);
    if (fetchedUser.type === 'WORKER') {
      router.push('https://worker.quick-quest.vercel.app/login');
    } else {
      setUser(fetchedUser);
      localStorage.setItem('token', token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have successfully logged in.',
        confirmButtonColor: '#14b8a6',
      }).then(() => {
        router.push('/');
      });
    }
    } catch (error) {
      console.error('Login failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        confirmButtonColor: '#14b8a6',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className='flex flex-col h-screen'>
        <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 font-medium text-center text-3xl text-gray-900">
                Welcome Back
              </h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center">
                <ThreeDots color="#4FB8B3" height={80} width={80} />
              </div>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm mb-4`}
                      placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm`}
                      placeholder="Password"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link href="/forgotPassword">
                      <span className="cursor-pointer font-medium text-teal-600 hover:text-teal-500">
                        Forgot password?
                      </span>
                    </Link>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Log in
                  </button>
                </div>
              </form>
            )}
            <div className="text-sm text-center mt-2 mb-2 text-gray-600">OR</div>
            <div className="flex flex-col space-y-3">
            <button
                className="group relative w-full flex justify-center items-center py-2 px-4 border border-black text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-md"
                onClick={handleGoogleSignIn}
              >
                <FaGoogle className="text-red-500 mr-2" />
                Continue with Google
              </button>
              <button className="group relative w-full flex justify-center items-center py-2 px-4 border border-black text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-md">
                <FaApple className="text-black mr-2" />
                Continue with Apple
              </button>
              <button className="group relative w-full flex justify-center items-center py-2 px-4 border border-black text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-md">
                <FaFacebook className="text-blue-600 mr-2" />
                Continue with Facebook
              </button>
              <div className="mt-4">
                <p className="text-center text-sm text-gray-600">
                  Do not have an account?
                  <Link href="/signup">
                    <span className="ml-1 font-medium text-teal-600 hover:text-teal-500 cursor-pointer">
                      Sign up
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}