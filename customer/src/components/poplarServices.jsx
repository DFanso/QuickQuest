'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function PopularServices() {
    const [services, setServices] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/services`);
                const allServices = response.data;
                const randomServices = getRandomServices(allServices, 5);
                setServices(randomServices);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    const getRandomServices = (services, count) => {
        const shuffled = services.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
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

    return (
        <div className="mx-auto mt-4 py-4 md:py-6 max-w-screen-2xl px-2 md:px-28 mb-8">
            <h2 className="text-lg pl-4 font-bold md:mb-6 mb-2 text-left text-black">Popular Services</h2>
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