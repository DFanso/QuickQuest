"use client"
import React from 'react';
import '../globals.css';
import BidsList from "../../components/bidsCard";
import AuthRoute from '../(auth)/AuthRoute';


const JobPage = () => {
    return (
        <>
        <AuthRoute>
        <h2 className="text-xl text-black font-medium md:mb-2 mb-0 mt-4 p-4 pl-20">Recommended Bids</h2>
            <BidsList />

            <div className='mb-6'></div>
            </AuthRoute>
        </>
    );
};

export default JobPage;
