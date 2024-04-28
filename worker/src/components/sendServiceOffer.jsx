import React, { useState, useEffect } from 'react';
import { MdOutlineTimer, MdOutlineLocalOffer } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import FinalServiceOffer from './serviceOffer';
import CreateServiceOffer from './createServiceOffer';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function SendServiceOffer({ service, onClose, aChat }) {
    const [showAnotherComponent, setShowAnotherComponent] = useState(false);
    const [description, setDescription] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('1 day');
    const [price, setPrice] = useState(service.startingPrice);
    const [expireTime, setExpireTime] = useState('1 day');

    useEffect(() => {
        // Event listener for handling browser back button
        const handlePopState = (event) => {
            // Check if the current state should show the default view
            if (window.history.state === null || !window.history.state.showAnotherComponent) {
                setShowAnotherComponent(false);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleCreateOfferClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const deliveryDate = new Date();
            const expireDate = new Date();

            // Set deliveryDate based on the selected deliveryTime
            switch (deliveryTime) {
                case '1 day':
                    deliveryDate.setDate(deliveryDate.getDate() + 1);
                    break;
                case '3 days':
                    deliveryDate.setDate(deliveryDate.getDate() + 3);
                    break;
                case '1 week':
                    deliveryDate.setDate(deliveryDate.getDate() + 7);
                    break;
                case '2 weeks':
                    deliveryDate.setDate(deliveryDate.getDate() + 14);
                    break;
                case '1 month':
                    deliveryDate.setMonth(deliveryDate.getMonth() + 1);
                    break;
                default:
                    break;
            }

            // Set expireDate based on the selected expireTime
            switch (expireTime) {
                case '1 day':
                    expireDate.setDate(expireDate.getDate() + 1);
                    break;
                case '3 days':
                    expireDate.setDate(expireDate.getDate() + 3);
                    break;
                case '1 week':
                    expireDate.setDate(expireDate.getDate() + 7);
                    break;
                case '2 weeks':
                    expireDate.setDate(expireDate.getDate() + 14);
                    break;
                case '1 month':
                    expireDate.setMonth(expireDate.getMonth() + 1);
                    break;
                default:
                    break;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/offers`, {
                service: service._id,
                price: price,
                description: description,
                deliveryDate: deliveryDate.toISOString(),
                status: 'PENDING',
                expireDate: expireDate.toISOString(),
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                console.log(response.data);

                // Send a message regarding the bid to the customer
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/chats/${aChat}/messages`, {
                    contentType: 'OFFER',
                    content: `${response.data._id}`
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Offer Created',
                    text: 'Your offer has been successfully created and sent to the customer.',
                }).then(() => {
                    window.history.pushState({ showAnotherComponent: true }, '');
                    setShowAnotherComponent(true);
                });
            } else {
                // Handle error response
                console.error('Error creating offer:', response.data);

                // Show error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Offer Creation Failed',
                    text: 'An error occurred while creating the offer. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error creating offer:', error);

            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Offer Creation Failed',
                text: 'An error occurred while creating the offer. Please try again.',
            });
        }
    };

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            if (value > service.startingPrice) {
                setPrice(value);
            } else {
                setPrice(service.startingPrice);
            }
        }
    };

    const handleClose = () => {
        window.history.pushState({ showAnotherComponent: true }, '');
        setShowAnotherComponent(true);
    };

    if (showAnotherComponent) {
        return <CreateServiceOffer />;
    }

    return (
        <div className="w-full md:w-3/5 px-2 px-4 py-2 bg-white rounded-lg shadow-md my-2 relative" style={{ boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)', borderRadius: '10px', background: '#FFF' }}>
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleClose}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="flex justify-between items-center my-4">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faPercent} className="text-teal-500" size="1.5em" />
                    <span className="ml-2 text-teal-500">Create an offer for {service.name}</span>
                </div>

            </div>

            <div className="items-center">
                <textarea
                    id="message-box"
                    className="mt-1 block h-32 w-full border border-green-800 p-1 rounded-md shadow-sm text-black"
                    placeholder="Describe your offer here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="flex justify-between items-center my-4 text-black">
                <div className="w-1/2 relative mr-2">
                    <label htmlFor="delivery-time" className="block text-sm font-medium text-gray-700">Delivery</label>
                    <div className="mt-1 relative block w-full">
                        <select
                            id="delivery-time"
                            className="block w-full border border-green-800 p-1 rounded-md shadow-sm appearance-none pl-3 pr-10"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                        >
                            <option value="1 day">1 day</option>
                            <option value="3 days">3 days</option>
                            <option value="1 week">1 week</option>
                            <option value="2 weeks">2 weeks</option>
                            <option value="1 month">1 month</option>
                        </select>
                        <FontAwesomeIcon icon={faCaretDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="w-1/2 mr-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price $</label>
                    <input
                        type="number"
                        id="price"
                        className="mt-1 block w-full border border-green-800 p-1 rounded-md shadow-sm"
                        value={price}
                        onChange={handlePriceChange}
                        min={service.startingPrice}
                    />
                </div>

                <div className="w-1/2 relative">
                    <label htmlFor="expire-time" className="block text-sm font-medium text-gray-700">Offer Expires In</label>
                    <div className="mt-1 relative block w-full">
                        <select
                            id="expire-time"
                            className="block w-full border border-green-800 p-1 rounded-md shadow-sm appearance-none pl-3 pr-10"
                            value={expireTime}
                            onChange={(e) => setExpireTime(e.target.value)}
                        >
                            <option value="1 day">1 day</option>
                            <option value="3 days">3 days</option>
                            <option value="1 week">1 week</option>
                            <option value="2 weeks">2 weeks</option>
                            <option value="1 month">1 month</option>
                        </select>
                        <FontAwesomeIcon icon={faCaretDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className='flex justify-end'>
                <button onClick={handleCreateOfferClick} className="w-1/4 bg-teal-500 text-sm text-white rounded-md py-2 mb-2 hover:bg-teal-600">
                    Send Offer
                </button>
            </div>
        </div>
    );
}