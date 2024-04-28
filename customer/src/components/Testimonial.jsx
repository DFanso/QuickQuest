import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
    {
        id: '1',
        name: 'Sarah Thompson',
        content: 'I hired a plumber through this platform to fix a leaky faucet, and I was impressed with the quality of work and professionalism. The plumber was on time, efficient, and left my bathroom spotless.',
        image: '/images/test-prof-1.png',
      },
      {
        id: '2',
        name: 'Michael Johnson',
        content: 'As a busy working parent, I was struggling to keep up with household chores. That is when I discovered this platform and hired a house cleaner. It has been a lifesaver! My home is always clean, and the cleaner is reliable and trustworthy.',
        image: '/images/test-prof-1.png',
      },
      {
        id: '3',
        name: 'Emily Davis',
        content: 'I needed someone to watch my kids after school, and I found the perfect babysitter on this platform. She is patient, caring, and my kids adore her. I can go to work with peace of mind, knowing my children are in good hands.',
        image: '/images/test-prof-1.png',
      },
      {
        id: '4',
        name: 'David Lee',
        content: 'My yard was starting to look unkempt, and I did not have the time or energy to maintain it. I hired a gardener through this platform, and he has transformed my outdoor space into a beautiful oasis.',
        image: '/images/test-prof-1.png',
      },
      {
        id: '5',
        name: 'Jessica Wilson',
        content: 'I needed help with cooking and meal preparation, and I found the perfect personal chef on this platform. The meals are delicious, healthy, and tailored to my dietary preferences. It has made my life so much easier!',
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
