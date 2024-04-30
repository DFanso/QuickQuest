"use client";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faDollarSign, faScissors } from '@fortawesome/free-solid-svg-icons';
import './globals.css';
import OrderAnalysisCard from './components/totalOrders';
import AuthRoute from './(auth)/AuthRoute';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const DashboardCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-10 m-2" style={{ width: '300px', height: '200px', boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)' }}>
      <FontAwesomeIcon icon={icon} size="4x" className="text-teal-400" />
      <p className="mt-4 text-gray-600 text-sm uppercase">{title}</p>
      <p className="text-xl font-semibold text-teal-500 mt-2">{value}</p>
    </div>
  );
};

const options = {
  maintainAspectRatio: false, 
  aspectRatio: 2,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
};

const Dashboard = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data: profileData } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          setUserProfile(profileData);

          const { data: jobsData } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/jobs/admin`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          setJobs(jobsData);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    checkToken();
  }, [router]);

  if (!userProfile) {
    return null; // or you can render a loading state
  }

  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));

  // Calculate total revenue earned (8% of each order price)
  const totalRevenue = jobs.reduce((revenue, job) => {
    if (job.status === 'COMPLETED') {
      revenue += job.price * 0.08;
    }
    return revenue;
  }, 0);

  const data = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Order frequency',
        data: jobs.reduce((frequency, job) => {
          const orderedDate = new Date(job.orderedDate);

          if (orderedDate >= startOfWeek && orderedDate <= endOfWeek) {
            const dayOfWeek = orderedDate.getDay();
            frequency[dayOfWeek]++;
          }

          return frequency;
        }, [0, 0, 0, 0, 0, 0, 0]),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <>
      <h2 className="text-2xl font-semibold my-4 text-black mt-16 pl-12">Dashboard</h2>
      <div className="flex justify-around">
        <DashboardCard icon={faBriefcase} title="Total jobs completed" value={jobs.length} />
        <DashboardCard icon={faDollarSign} title="Total Revenue earned" value={`$${totalRevenue.toFixed(2)}`} />
        <DashboardCard icon={faScissors} title="Services provided" value={jobs.reduce((services, job) => services.add(job.service.name), new Set()).size} />
      </div>
      {/* Chart Section */}
      <div className="mb-4 mt-10 mx-16">
        <div className="p-10 w-full bg-white rounded-lg shadow-md my-6" style={{ height: '370px' }}>
          <Line data={data} options={options} />
        </div>
        {/* <p className='text-black'>Total Orders this week</p> */}
      </div>
      <div className='flex items-center justify-center'>
        <OrderAnalysisCard jobs={jobs} />
      </div>
    </>
  );
};

export default Dashboard;