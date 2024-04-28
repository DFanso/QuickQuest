'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Loader from '@/components/Loader';
import axios from 'axios';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { user, setUser, loading, setLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/profile`, {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          if (data) {
            setUser(data);
            setLoading(false);
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
            router.push('/login');
          } else {
            console.error('Error retrieving user from API:', error);
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    };

    checkTokenValidity();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.status === 'UNVERIFIED') {
    router.push('/verifyEmail');
    return null;
  }

  if (user.type === 'WORKER') {
    router.push('https://worker.quick-quest.vercel.app/login');
    return null;
  }

  return <>{children}</>;
};

export default AuthRoute;