import React, { useEffect, useState } from 'react';
import ChooseServiceOffer from './chooseServiceOffer';
import { FaSearch } from 'react-icons/fa';
import { IoCallOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAttach } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { CiFaceSmile } from "react-icons/ci";


export default function ChatWindowChooseOffer({ activeChat }) {


    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMessages = async (chatId) => {
        setIsLoading(true);
        setMessages([
            { id: 1, text: "This is the start of your conversation with Leo.", sender: 'Leo', timestamp: '21:45' },
            { id: 2, text: "Hey there! How's it going?", sender: 'You', timestamp: '21:59' },
            // ... more messages
        ]);
        setIsLoading(false);
    };

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.id);
        }
    }, [activeChat]);


    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="flex m-2 flex-col h-full w-full p-4" style={{ boxShadow: '0px 0px 4px 2px rgba(79, 184, 179, 0.25)', borderRadius: '10px' }}>
            {/* Chat header */}
            {activeChat && (
                <div className="flex justify-between items-center p-2 border-b border-gray-300">
                    {/* User profile and name */}
                    <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full mr-2" src={`/images/chat-profile.png`} alt={activeChat.name} />
                        <h2 className="font-semibold text-teal-900">{activeChat.name}</h2>
                    </div>
                    {/* Icons */}
                    <div className="flex items-center">
                        <FaSearch className="text-gray-700 mx-2" />
                        <IoCallOutline className="text-gray-700 mx-2 text-xl" />
                        <BsThreeDotsVertical className="text-gray-700 mx-2" />
                    </div>
                </div>
            )}

            {/* Chat messages */}
            <div className="flex-grow overflow-auto p-2">
                {messages.map(message => (
                    <div key={message.id} className={`flex items-end ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-2/3 p-2 my-1 rounded-lg ${message.sender === 'You' ? 'bg-teal-600' : 'bg-teal-400'}`}>
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs text-gray-300 text-right">{message.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>

            <ChooseServiceOffer />
            {/* Input for sending messages */}
            <div className="flex items-center p-2">
                <input className="flex-grow p-2 border rounded" placeholder="Type a message..." style={{ background: '#CAE9E8', borderRadius: '10px' }} />
                <CiFaceSmile className="text-teal-500 text-3xl mx-1" />
                <IoIosAttach className="text-teal-500 text-3xl mx-1" />
                <div className="flex items-center justify-center">
                    <button className="flex items-center justify-center w-9 h-9 bg-teal-500 text-white rounded-full">
                        <LuSend className="text-white text-xl m-[-2px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
