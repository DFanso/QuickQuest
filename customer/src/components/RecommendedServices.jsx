'use client';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';

export default function RecommendedServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchRecommendedServices = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in localStorage');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/recommendations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                });

                setServices(response.data);
            } catch (error) {
                console.error('Error fetching recommended services:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendedServices();
    }, []);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: services.length < 3 ? services.length : 3,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: services.length < 2 ? services.length : 2,
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

    const handleServiceClick = (serviceId) => {
        router.push(`/workers?serviceId=${serviceId}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <ThreeDots color="#4FB8B3" height={80} width={80} />
            </div>
        );
    }

    if (services.length === 0) {
        return null;
    }

    return (
        <div className="mx-auto mt-4 py-4 md:py-6 max-w-screen-2xl px-2 md:px-28">
            <h2 className="text-lg pl-4 font-bold md:mb-6 mb-2 text-left text-black">Recommended Services</h2>
            <Slider {...settings}>
                {services.map((service, index) => (
                    <div key={index} className="p-4" onClick={() => handleServiceClick(service._id)}>
                        <div className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer">
                            <img src={service.imageUrl} alt={service.name} className="w-full h-60 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-black">{service.name}</h3>
                                <p className="text-gray-500">Starting at ${service.startingPrice}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}