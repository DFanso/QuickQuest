'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Loader from '../../../components/Loader';

export default function ProfileHandler() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.get('token');
    if (params) {
      setToken(params);
      localStorage.setItem('token', params);
    }
    
  }, [searchParams]);

  useEffect(() => {
    const delayFetch = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/profile`, {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${token}`,
            },
          });
          const fetchedProfile = response.data;
          console.log(response);
          localStorage.setItem('user', JSON.stringify(fetchedProfile));
          setProfile(fetchedProfile);

          if (fetchedProfile.status === 'GOOGLEAUTH') {
            router.push('/ssoSignup');
          } else if (fetchedProfile.status === 'VERIFIED') {
            router.push('/');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          router.push('/');
        }
      }
    };

    delayFetch();
  }, [token, router]);

  return <Loader />;
}