import React from 'react';
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";
import '../styles/globals.css';
import Link from 'next/link';

export default function LabourPageServices() {
    const services = [
        {
            name: "Lawn mowing",
            price: "Starting at Rs.5000",
            imageUrl: "/images/lawn-mowing.png" // Replace with the path to your image
        },
        {
            name: "Hedge trimming",
            price: "Starting at Rs.5000",
            imageUrl: "/images/hedge-trimming.png"
        },
        {
            name: "Garden maintenance",
            price: "Starting at Rs.5000",
            imageUrl: "/images/garden-maintenance.png"
        },

    ];

    const categories = [
        {
            name: "Lawn mowing",
            price: "Starting at Rs.5000",
            imageUrl: "/images/lawn-mowing.png" // Replace with the path to your image
        },
        {
            name: "Hedge trimming",
            price: "Starting at Rs.5000",
            imageUrl: "/images/hedge-trimming.png"
        },
        {
            name: "Garden maintenance",
            price: "Starting at Rs.5000",
            imageUrl: "/images/garden-maintenance.png"
        },
        {
            name: "Planting & garden design",
            price: "Starting at Rs.10000",
            imageUrl: "/images/plant-garden-design.png" // Replace with the path to your image
        },
        {
            name: "Irrigation systems installation and repair",
            price: "Starting at Rs.50000",
            imageUrl: "/images/Irrigation-systems.png"
        },
        {
            name: "Tree pruning and removal",
            price: "Starting at Rs.10,000",
            imageUrl: "/images/tree-pruning.png"
        },
        {
            name: "Soil fertilization and treatment",
            price: "Starting at Rs.10,000",
            imageUrl: "/images/soil-fertilization.jpg"
        },
        {
            name: "Weed Control",
            price: "Starting at Rs.10,000",
            imageUrl: "/images/weed-control.png"
        },
    ];

    return (
        <>
            <Navbar />
            <div className="mx-auto mt-4 py-4 md:py-2 max-w-screen-2xl px-2 md:px-20">
                <h2 className="text-lg pl-4 font-medium text-left text-black">Popular Services</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service, index) => (
                        <Link key={index} href="/oneServicePage" passHref>
                            <div key={index} className="p-4">
                                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                                    <img src={service.imageUrl} alt={service.name} className="w-full h-60 object-cover" />
                                    <div className="p-4">
                                        <h3 className="text-lg font-medium text-black">{service.name}</h3>
                                        <p className="text-gray-500">{service.price}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>

            <div className="mx-auto mt-4 py-4 md:py-2 max-w-screen-2xl px-2 md:px-20">
                <h2 className="text-lg pl-4 font-medium text-left text-black">Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((categorie, index) => (
                        <div key={index} className="p-4">
                            <div className="bg-white rounded-lg overflow-hidden shadow-md">
                                <img src={categorie.imageUrl} alt={categorie.name} className="w-full h-60 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-black">{categorie.name}</h3>
                                    <p className="text-gray-500">{categorie.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mb-2 md:mb-6'></div>
            <Footer />
        </>
    );
}
