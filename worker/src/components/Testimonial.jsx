import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
    {
        id: '2',
        name: 'P',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        image: '/images/test-prof-1.png',

    },
    {
        id: '2',
        name: 'P',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        image: '/images/test-prof-1.png',

    },
    {
        id: '1',
        name: 'K',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        image: '/images/test-prof-1.png',

    },
    {
        id: '2',
        name: 'P',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        image: '/images/test-prof-1.png',

    },
    {
        id: '2',
        name: 'P',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        image: '/images/test-prof-1.png',

    },

];

export default function Testimonials() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    return (
        <div className="bg-gray-100 py-6 mb-6 md:mb-0 md:py-12 px-8">
            <h2 className="text-2xl pl-6 font-bold mb-4 md:mb-10 text-left text-black">What Our Customers Say</h2>
            <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="px-4">
                        <div className="rounded-lg shadow-md p-6 bg-white">
                            <div className="flex items-center space-x-2 mb-2">
                                <img src={testimonial.image} className="rounded-full w-12 h-12 object-cover" alt="" />
                                <span className="font-bold text-black">{testimonial.name}</span>
                            </div>
                            <p className="text-sm text-black">{testimonial.content}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
