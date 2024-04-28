import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent } from '@fortawesome/free-solid-svg-icons';
import ChooseServiceOffer from './chooseServiceOffer';

export default function CreateServiceOffer({aChat}) {
    const [showAnotherComponent, setShowAnotherComponent] = useState(false);
    const [activeChat, setActiveChat] = useState('');

   

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

    const handleCreateOfferClick = () => {
        
        // Push a new state into the history when showing ChooseServiceOffer
        window.history.pushState({ showAnotherComponent: true }, '');
        setShowAnotherComponent(true);
    };

    useEffect(() => {
        const chatId = localStorage.getItem('chatId');
        if (chatId !== null && chatId !== undefined) {
          setActiveChat(chatId);
        }
      }, []);
      
      useEffect(() => {
        console.log(activeChat);
      }, [activeChat]);

    if (showAnotherComponent) {
        return <ChooseServiceOffer aChat={activeChat}/>;
    }
    

    // Otherwise, render the button to create an offer
    return (
        <div className="w-full p-4 rounded-lg" style={{ background: '#FFF' }}>
            <div className="flex justify-left items-left">
                <button onClick={handleCreateOfferClick} className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                    <FontAwesomeIcon icon={faPercent} className="text-teal-500 mr-2" size="1.5em" />
                    <span className="text-teal-500">Create an Offer</span>
                </button>
            </div>
        </div>
    );
}
