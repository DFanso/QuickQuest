'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  location: {
    type: string;
    coordinates: number[];
  };
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  aboutMe: string;
  services: any[];
  type: string;
  status: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error retrieving user from local storage:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1300);
      }
    };

    checkUserAuthentication();
  }, []);

  useEffect(() => {
    // Check if user status is UNVERIFIED and redirect to verifyEmail page
    if (user && user.status === 'UNVERIFIED') {
      router.push('/verifyEmail');
    }
  }, [user, router]);

  useEffect(() => {
    // Update local storage whenever user state changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};