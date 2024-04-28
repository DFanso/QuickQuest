'use client';
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PopularServices() {
    const services = [
        {
            name: "BabySitting",
            price: "Starting at $10/hr",
            imageUrl: "/images/baby-sitting.png" // Replace with the path to your image
        },
        {
            name: "Bridal Makeup",
            price: "Starting at 100$",
            imageUrl: "/images/bridal-makeup.png"
        },
        {
            name: "IELTS Tutoring",
            price: "Starting at 50$",
            imageUrl: "/images/ilets-tutor.png"
        },
        {
            name: "Organizing Birthday parties",
            price: "Starting at 60$",
            imageUrl: "/images/birthday-party-img.png"
        },
    ];

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

    return (
        <div className="mx-auto mt-4 py-4 md:py-6 max-w-screen-2xl px-2 md:px-28 mb-8">
            <h2 className="text-lg pl-4 font-bold md:mb-6 mb-2 text-left text-black">Popular Services</h2>
            <Slider {...settings}>
                {services.map((service, index) => (
                    <div key={index} className="p-4">
                        <div className="bg-white rounded-lg overflow-hidden shadow-md">
                            <img src={service.imageUrl} alt={service.name} className="w-full h-60 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-black">{service.name}</h3>
                                <p className="text-gray-500">{service.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
