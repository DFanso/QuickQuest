
"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ChatSidebar from '../../components/ChatSidebar';
import ChatWindow from '../../components/ChatWindow';
import MobileChatSidebar from '../../components/MobileChatSidebar';
import MobileChatWindow from '../../components/MobileChatWindow';
import '../globals.css';
import axios from 'axios';
import AuthRoute from '../(auth)/AuthRoute';

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/chats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setChats(response.data.chats);
        setActiveChat(response.data.chats[0]);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);



  return (
    <>
      <AuthRoute>
        <Head>
          <title>Chat Interface</title>
        </Head>
        <div className='h-screen'>
          {/* Ensure the sidebar takes the full screen width on mobile */}
          <div className="md:hidden h-screen w-screen px-0 py-0 m-0">
            <MobileChatSidebar chats={chats} onSelectChat={setActiveChat} activeChat={activeChat} />
          </div>

          {/* Original Layout: Only visible on medium screens and up */}
          <div className="hidden md:flex h-screen my-2 overflow-hidden align-center justify-center">
            <ChatSidebar chats={chats} onSelectChat={setActiveChat} />
            <div className='mb-4 w-3/5' style={{ height: "90%" }}>
              <ChatWindow activeChat={activeChat} />
            </div>
          </div>
        </div>
      </AuthRoute>




    </>
  );
}