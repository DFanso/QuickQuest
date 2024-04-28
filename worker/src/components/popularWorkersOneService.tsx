import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function PopularWorkersOneService() {
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

    ];

    return (
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {workers.map((worker, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md text-center mt-8 md:mt-0 relative p-4">
                        <img
                            src={worker.imageUrl}
                            alt={worker.name}
                            className="rounded-full w-24 h-24 object-cover mx-auto -mt-12" // Adjust the position of the image
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
                                {/* Display tasks as icons or text */}
                            </div>
                            <button className="bg-teal-500 text-white px-8 py-2 rounded-md">Hire</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
