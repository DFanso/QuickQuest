import React, { useEffect, useState } from 'react';
import ServiceOffer from './serviceOffer';
import { FaSearch } from 'react-icons/fa';
import { IoCallOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAttach } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { CiFaceSmile } from "react-icons/ci";
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { IoChevronBack } from "react-icons/io5";

export default function ChatWindow({ activeChat, onBack }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [sseConnection, setSseConnection] = useState(null);

    const storedUser = localStorage.getItem('user');
    const parsedUser = JSON.parse(storedUser);

    console.log(activeChat)

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/chats/${activeChat._id}/messages`, {
                    content: newMessage,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    useEffect(() => {
        if (activeChat) {
            const sse = new EventSource(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/chats/${activeChat._id}/sse`);
            setSseConnection(sse);

            sse.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages(data.messages);
            };

            return () => {
                sse.close();
            };
        }
    }, [activeChat]);


    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <ThreeDots color="#4FB8B3" height={80} width={80} />
        </div>;
    }



    return (
        <div className="flex md:text-base text-xs m-2 flex-col w-full p-2 md:p-4" style={{ boxShadow: '0px 0px 4px 2px rgba(79, 184, 179, 0.25)', borderRadius: '10px', height: "90%" }}>
            {/* Chat header */}
            {activeChat && (
                <div className="flex justify-between items-center p-2 border-b border-gray-300">
                    {/* User profile and name */}
                    <div className="flex items-center justify-center">
                        <button onClick={handleBack} className="text-teal-500 mr-2">
                            <IoChevronBack className='text-2xl' />
                        </button>
                        <img className="w-10 h-10 rounded-full mr-2 object-cover" src={activeChat.worker.profileImage} alt={`${activeChat.worker.firstName} ${activeChat.worker.lastName}`} />
                        <h2 className="font-semibold text-teal-900">{activeChat.worker.firstName} {activeChat.worker.lastName}</h2>
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
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex items-end ${message.sender === parsedUser._id ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.contentType === 'OFFER' ? (
                            <ServiceOffer
                                offer={{
                                    service: message.content.service,
                                    worker: message.content.worker,
                                    price: message.content.price,
                                    description: message.content.description,
                                    deliveryDate: message.content.deliveryDate,
                                    expireDate: message.content.expireDate,
                                    icon: message.content.service.category.iconUrl,
                                    status: message.content.status,
                                    _id: message.content._id,
                                }}
                            />
                        ) : (
                            <div className={`max-w-2/3 p-2 my-1 rounded-lg ${message.sender === parsedUser._id ? 'bg-teal-600' : 'bg-teal-400'}`}>
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs text-gray-300 text-right">{new Date(message.timestamp).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input for sending messages */}
            <div className="flex items-center p-2">
                <input
                    className="flex-grow p-2 border rounded text-black"
                    placeholder="Type a message..."
                    style={{ background: '#CAE9E8', borderRadius: '10px' }}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                />
                <CiFaceSmile className="text-teal-500 text-3xl mx-1" />
                <IoIosAttach className="text-teal-500 text-3xl mx-1" />
                <div className="flex items-center justify-center">
                    <button
                        className="flex items-center justify-center w-9 h-9 bg-teal-500 text-white rounded-full"
                        onClick={sendMessage}
                    >
                        <LuSend className="text-white text-xl m-[-2px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}