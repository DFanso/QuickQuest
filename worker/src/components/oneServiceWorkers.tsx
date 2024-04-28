'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ServicePopularWorkers() {
    const workers = [
        {
            name: "Mahinda Rajapaksha",
            imageUrl: "/images/construction-pp.jpg",
            tasks: ["cleaning", "baby-sitting"],
            rating: 3,
        },
        {
            name: "Mahinda Rajapaksha",
            imageUrl: "/images/construction-pp.jpg",
            tasks: ["cleaning", "baby-sitting"],
            rating: 3,
        },
        {
            name: "Mahinda Rajapaksha",
            imageUrl: "/images/construction-pp.jpg",
            tasks: ["cleaning", "baby-sitting"],
            rating: 3,
        },
        {
            name: "Mahinda Rajapaksha",
            imageUrl: "/images/construction-pp.jpg",
            tasks: ["cleaning", "baby-sitting"],
            rating: 3,
        },
        {
            name: "Mahinda Rajapaksha",
            imageUrl: "/images/construction-pp.jpg",
            tasks: ["cleaning", "baby-sitting"],
            rating: 3,
        },
        {
            name: "Mahinda Rajapaksha",
            imageUrl: "/images/construction-pp.jpg",
            tasks: ["cleaning", "baby-sitting"],
            rating: 3,
        },
        {
            name: "Mahinda Rajapaksha",
            imageUrl: "/images/construction-pp.jpg",
            tasks: ["cleaning", "baby-sitting"],
            rating: 3,
        },


    ];

    // Adjusted settings for slidesToShow to 5 for larger screens
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768, // For tablets
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600, // For mobile
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-6">
            <h2 className="text-lg font-medium mb-6 text-left pl-4 text-black">Recommended Workers around you</h2>
            {/* Slider wrapper */}
            <Slider {...settings}>
                {workers.map((worker, index) => (
                    <div key={index} className="px-4">
                        <div className="bg-white rounded-lg shadow-md text-center relative">
                            <img
                                src={worker.imageUrl}
                                alt={worker.name}
                                className="rounded-full w-24 h-24 object-cover mx-auto"
                                style={{ top: '-3rem' }} // Adjust the position of the image
                            />
                            <div className="pt-16 pb-4">
                                <h3 className="text-base text-black font-medium">{worker.name}</h3>
                                <div className="flex justify-center mt-2 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < worker.rating ? "text-yellow-400" : "text-gray-300"} />
                                    ))}
                                </div>
                                <p className="font-semibold text-base text-black mb-2">Tasks:</p>
                                <div className="flex justify-center mb-4 space-x-2">
                                    <img src="/images/construction-icon.png" alt="Construction" className="h-5 w-5" />
                                    <img src="/images/cleaning-icon.png" alt="Cleaning" className="h-5 w-5" />

                                </div>
                                <button className="bg-teal-500 text-white px-8 py-2 rounded-md">Hire</button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
