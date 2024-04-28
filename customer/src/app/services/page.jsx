"use client";
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../globals.css';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner';

export default function LabourPageServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryId, setCategoryId] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams) {
            setCategoryId(searchParams.get('categoryId') || '');
        }
    }, [searchParams]);

    const fetchServices = async () => {
        if (categoryId) {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services?category=${categoryId}`, {
                    headers: {
                        'accept': '*/*'
                    }
                });
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        if (categoryId) {
            fetchServices();
        }
    }, [categoryId]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerMode: true, // Centers slides if they are less than the slider width
    };

    return (
        <>
            <div className="mx-auto mt-4 py-4 max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <ThreeDots color="#4FB8B3" height={80} width={80} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        </div>

                        <h2 className="text-lg pl-4 font-medium text-left text-black mt-8">Services</h2>
                        <div className="block md:hidden md:mb-0 mb-6">
                            <Slider {...sliderSettings}>
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="p-4 cursor-pointer"
                                        onClick={() => router.push(`/workers?serviceId=${service._id}`)}
                                    >
                                        <div className="bg-white rounded-lg overflow-hidden shadow-md">
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
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="p-4 cursor-pointer"
                                    onClick={() => router.push(`/workers?serviceId=${service._id}`)}
                                >
                                    <div className="bg-white rounded-lg overflow-hidden shadow-md">
                                        <img src={service.imageUrl} alt={service.name} className="w-full h-60 object-cover" />
                                        <div className="p-4">
                                            <h3 className="text-lg font-medium text-black">{service.name}</h3>
                                            <p className="text-gray-500">Starting at ${service.startingPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}