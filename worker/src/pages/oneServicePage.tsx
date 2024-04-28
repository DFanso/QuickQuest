import React, { useState } from 'react';
import { FaSearch, FaCaretDown } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";
import '../styles/globals.css';
import ServicePopularWorkers from "../components/oneServiceWorkers";
import PopularWorkersOneService from "../components/popularWorkersOneService";

const OneServicePage = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Nattandiya');
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    return (
        <>
            <Navbar />
            <div className="relative">

                <img
                    src="/images/lawn-mowing-cover.png"
                    alt="Lawn mowing"
                    className="w-full"
                    style={{ height: '50vh' }}
                />
                <div className="relative inset-x-0 bottom-0 p-4 bg-white bg-opacity-90">

                    {/* Service title and location dropdown */}
                    <div className="flex justify-between items-center lg:px-16">
                        <h1 className="text-sm md:text-2xl font-medium text-gray-800">Lawn Mowing</h1>
                        <div className="flex items-center">
                            {/* Location dropdown */}
                            <IoLocationSharp className="text-teal-500 mr-2" />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="appearance-none bg-transparent md:text-base text-xs border-none text-gray-800 mr-2"
                            >
                                <option value="Nattandiya">Nattandiya</option>
                                {/* Add more location options here */}
                            </select>
                            <FaCaretDown className="text-gray-600" />

                            {/* Search bar */}
                            <div className="flex items-center ml-4">

                                <input
                                    type="text"
                                    placeholder="Search Workers"
                                    className="px-2 md:px-4 py-1 md:py-1.5 w-auto md:w-64 text-sm font-medium rounded-3xl text-teal-900 placeholder-teal-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    style={{ background: 'rgba(79, 184, 179, 0.30)' }}

                                />
                                {/* <FaSearch className='text-teal-500' /> */}

                            </div>
                        </div>
                    </div>
                </div>
                {/* Add additional content below */}
                {/* ... */}
            </div>
            <ServicePopularWorkers />

            <div className="flex justify-between items-center mb-6 mt-6 lg:px-16">
                <h1 className="text-xl font-semibold text-gray-800 mb-6 pl-8 md:pl-0">Popular Workers</h1>


                <div>

                    <div className="relative">
                        <div
                            onClick={toggleDropdown}
                            className="inline-flex items-center border border-teal-500 bg-white px-2 py-1 rounded-md cursor-pointer"
                        >
                            <span className="text-teal-500 mr-1">Highest Rating</span>
                            <FaCaretDown className='text-teal-500' />
                        </div>

                        {dropdownOpen && (
                            <ul className="absolute z-10 mt-1 w-32 border border-gray-200 bg-white shadow-md rounded-md py-1">
                                <li className="px-4 py-2 hover:bg-gray-100 text-teal-500 cursor-pointer">Recent</li>
                                <li className="px-4 py-2 hover:bg-gray-100 text-teal-500 cursor-pointer">Oldest</li>
                                {/* Add more dropdown items as needed */}
                            </ul>
                        )}

                    </div>
                    {/* <span className="text-gray-600 text-sm">67 Reviews</span> */}
                </div>

            </div>

            <PopularWorkersOneService />
            <div className='mt-4'></div>
            <PopularWorkersOneService />

            <Footer />
        </>
    );
};

export default OneServicePage;
