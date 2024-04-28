'use client';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';

export default function PopularWorkers() {
    const [workers, setWorkers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchNearbyWorkers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in localStorage');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/workers/nearby`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                });

                setWorkers(response.data);
            } catch (error) {
                console.error('Error fetching nearby workers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNearbyWorkers();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: workers.length < 5 ? workers.length : 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: workers.length < 3 ? workers.length : 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: workers.length < 2 ? workers.length : 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const getUniqueTaskIcons = (services) => {
        const uniqueIcons = new Set();
        services.forEach((service) => {
            uniqueIcons.add(service.category.iconUrl);
        });
        return Array.from(uniqueIcons);
    };

    const handleHireClick = (workerId) => {
        router.push(`/workerProfile?workerId=${workerId}`);
    };

    const renderWorkers = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center">
                    <ThreeDots color="#4FB8B3" height={80} width={80} />
                </div>
            );
        }

        if (workers.length === 0) {
            return null;
        }

        if (workers.length === 1) {
            const worker = workers[0];
            return (
                <div className="px-4">
                    <div className="bg-white rounded-lg shadow-md text-center relative mb-4 mt-2">
                        <img
                            src={worker.profileImage}
                            alt={`${worker.firstName} ${worker.lastName}`}
                            className="rounded-full w-24 h-24 object-cover mx-auto"
                            style={{ top: '-3rem' }}
                        />
                        <div className="pt-16 pb-4">
                            <h3 className="text-base text-black font-medium">{worker.firstName} {worker.lastName}</h3>
                            <div className="flex justify-center mt-2 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < worker.feedbackSummary.avgRating ? "text-yellow-400" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="font-semibold text-base text-black mb-2">Tasks:</p>
                            <div className="flex justify-center mb-4 space-x-2">
                                {getUniqueTaskIcons(worker.services).map((iconUrl, i) => (
                                    <img key={i} src={iconUrl} alt="Task Icon" className="h-5 w-5" />
                                ))}
                            </div>
                            <button
                                className="bg-teal-500 text-white px-8 py-2 rounded-md"
                                onClick={() => handleHireClick(worker._id)}
                            >
                                Hire
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Slider {...settings}>
                {workers.map((worker, index) => (
                    <div key={index} className="px-4">
                        <div className="bg-white rounded-lg shadow-md text-center relative mb-4 mt-2">
                            <img
                                src={worker.profileImage}
                                alt={`${worker.firstName} ${worker.lastName}`}
                                className="rounded-full w-24 h-24 object-cover mx-auto"
                                style={{ top: '-3rem' }}
                            />
                            <div className="pt-16 pb-4">
                                <h3 className="text-base text-black font-medium">{worker.firstName} {worker.lastName}</h3>
                                <div className="flex justify-center mt-2 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < worker.feedbackSummary.avgRating ? "text-yellow-400" : "text-gray-300"} />
                                    ))}
                                </div>
                                <p className="font-semibold text-base text-black mb-2">Tasks:</p>
                                <div className="flex justify-center mb-4 space-x-2">
                                    {getUniqueTaskIcons(worker.services).map((iconUrl, i) => (
                                        <img key={i} src={iconUrl} alt="Task Icon" className="h-5 w-5" />
                                    ))}
                                </div>
                                <button
                                    className="bg-teal-500 text-white px-8 py-2 rounded-md"
                                    onClick={() => handleHireClick(worker._id)}
                                >
                                    Hire
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        );
    };

    return (
        <div className="container mx-auto px-4 lg:px-28 py-6">
            <h2 className="text-lg font-bold mb-6 text-left pl-4 text-black">Popular Workers near you</h2>
            {renderWorkers()}
        </div>
    );
}