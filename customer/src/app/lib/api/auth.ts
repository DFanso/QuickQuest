import axios from 'axios';

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

interface LoginResponse {
  token: string;
}

export async function loginUser(email: string, password: string): Promise<string> {
  const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/login`, {
    email,
    password,
  });
  return response.data.token;
}

export async function fetchUserProfile(token: string): Promise<User> {
  const response = await axios.get<User>(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}