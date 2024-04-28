import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaPaypal } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Link from 'next/link';
import '../styles/globals.css';
import { MdAccessTime } from "react-icons/md";

const PaymentPage = () => {
    return (
        <>

            <Navbar />
            <div className='flex justify-center items-center h-screen'>
                <div className="w-1/2 p-6 bg-white rounded-lg shadow-lg relative" style={{ marginTop: '-5rem' }}> {/* marginTop adjustment for Navbar */}
                    <Link href="/chat">
                        <span className="absolute top-4 right-4 text-xl">

                        </span>
                    </Link>
                    <div className="flex items-center">
                        <div className="p-2 rounded-full mr-2">
                            <img src="/images/hair-makeup-icon.png" className="w-8 h-8"></img>
                        </div>
                        <h3 className="font-bold text-lg text-teal-500">Bridal Makeup</h3>
                        <span className="ml-auto text-xl font-bold text-teal-500">$50</span>
                    </div>
                    <p className="text-gray-600 my-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                    </p>
                    <div className="flex items-center mb-4">
                        <div className=" rounded-full mr-1">
                            <MdAccessTime className='text-teal-500' />
                        </div>
                        <span className="text-teal-900 font-medium">3 day delivery</span>
                    </div>
                    <Link href="/paymentSuccess">
                        <div className='flex items-center justify-center'>

                            <button className=" w-1/2 py-2 flex items-center justify-center px-4 bg-yellow-400 rounded-md">
                                <FaPaypal className="text-xl mr-2" /> Pay with PayPal
                            </button></div></Link>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentPage;
