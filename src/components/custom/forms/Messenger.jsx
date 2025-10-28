"use client";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleMessage, ChatBubbleTimestamp } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Paperclip, CornerDownLeft } from "lucide-react";

import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import useProfileStore from "@/store/session.store";
import { postDataToAPI } from "@/lib/api";
import { Newspaper } from "lucide-react";
import { CreateOffer } from "./CreateOffer";

export default function Messenger({ uid, conversationId, messages, setMessages, session, jobId }) {

    const { profile, refreshProfile, is_internal_admin, is_freelancer } = useProfileStore();

    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        (async () => {
            await refreshProfile();
        })();

        if (conversationId) {
            socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL, {
                extraHeaders: {
                    token: session
                }
            });

            socketRef.current.emit("join_room", { conversation_id: conversationId });
            console.log("Joined Conversation");

            socketRef.current.on("new_message", (message) => {
                setMessages((prev) => [...prev, message]);
            });

            // Handle page unload/navigation events
            const handleBeforeUnload = (event) => {
                if (socketRef.current) {
                    socketRef.current.emit("leave_room", { conversation_id: conversationId });
                }
            };

            const handlePageHide = () => {
                if (socketRef.current) {
                    socketRef.current.emit("leave_room", { conversation_id: conversationId });
                }
            };

            // Add event listeners
            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('pagehide', handlePageHide);

            return () => {
                // Clean up event listeners
                window.removeEventListener('beforeunload', handleBeforeUnload);
                window.removeEventListener('pagehide', handlePageHide);

                // Send leave_room before disconnecting
                if (socketRef.current) {
                    socketRef.current.emit("leave_room", { conversation_id: conversationId });
                    socketRef.current.disconnect();
                }
            };
        }
    }, [conversationId]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            conversation_id: conversationId,
            body: newMessage,
            message_type: "TEXT"
        };

        socketRef.current.emit("send_message", message);

        // Add the sent message to the local state with correct sender flags
        const localMessage = {
            ...message,
            time: new Date(),
            id: Date.now(),
            // Set sender flags based on user role
            sender_admin_id: is_internal_admin ? profile?.id : null,
            sender_freelancer_id: is_freelancer ? profile?.id : null,
            sender_user_id: (!is_internal_admin && !is_freelancer) ? profile?.id : null
        };
        setMessages((prev) => [...prev, localMessage]);

        setNewMessage("");
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await postDataToAPI("/file-upload", formData, true);

            if (!res) {
                alert("something went wrong")
            }

            const { url, media_type } = res;

            const message = {
                conversation_id: conversationId,
                body: null,
                media_url: url,
                media_type,
                message_type: "MEDIA"
            };

            socketRef.current.emit("send_message", message);

            // Add the sent message to the local state with correct sender flags
            const localMessage = {
                ...message,
                time: new Date(),
                id: Date.now(),
                // Set sender flags based on user role
                sender_admin_id: is_internal_admin ? profile?.id : null,
                sender_freelancer_id: is_freelancer ? profile?.id : null,
                sender_user_id: (!is_internal_admin && !is_freelancer) ? profile?.id : null
            };
            setMessages((prev) => [...prev, localMessage]);
        } catch (err) {
            console.error(err);
            alert("Failed to upload file.");
        } finally {
            e.target.value = ""; // reset file input
        }
    };

    const handleSendOffer = async (offer) => {
        const message = {
            conversation_id: conversationId,
            body: null,
            offer_id: offer.id,
            message_type: "OFFER"
        };

        socketRef.current.emit("send_message", message);

        // Add the sent message to the local state with correct sender flags
        const localMessage = {
            ...message,
            time: new Date(),
            id: Date.now(),
            offer: offer,
            // Set sender flags based on user role
            sender_admin_id: is_internal_admin ? profile?.id : null,
            sender_freelancer_id: is_freelancer ? profile?.id : null,
            sender_user_id: (!is_internal_admin && !is_freelancer) ? profile?.id : null
        };
        setMessages((prev) => [...prev, localMessage]);
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
                <ChatMessageList className="h-full p-4 overflow-y-auto space-y-4">
                    {messages.map(message => {
                        // Determine if this message is from the current user
                        const isCurrentUserMessage = 
                            (is_internal_admin && message.sender_admin_id === profile?.id) ||
                            (is_freelancer && message.sender_freelancer_id === profile?.id) ||
                            (!is_internal_admin && !is_freelancer && message.sender_user_id === profile?.id);
                        
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isCurrentUserMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[75%] ${isCurrentUserMessage ? "order-1" : "order-2"}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 ${
                                            isCurrentUserMessage
                                                ? "bg-blue-500 text-white rounded-br-md"
                                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                                        } shadow-sm`}
                                    >
                                    {message.message_type === "MEDIA" && (
                                        <div className="media-container">
                                            {message.media_type.startsWith('image/') ? (
                                                <div className="relative group mb-2">
                                                    <img
                                                        src={message.media_url}
                                                        alt="Shared image"
                                                        className="w-full max-w-[250px] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                                        onClick={() => window.open(message.media_url, '_blank')}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
                                                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium bg-black bg-opacity-70 px-3 py-1 rounded-full transition-opacity duration-200">
                                                            Click to expand
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : message.media_type.startsWith('video/') ? (
                                                <div className="relative mb-2">
                                                    <video
                                                        controls
                                                        className="w-full max-w-[250px] rounded-xl shadow-sm"
                                                        preload="metadata"
                                                    >
                                                        <source src={message.media_url} type={message.media_type} />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ) : message.media_type === 'application/pdf' ? (
                                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 mb-2 max-w-[250px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-red-500/20 p-2 rounded-lg">
                                                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">PDF Document</p>
                                                            <button
                                                                onClick={() => window.open(message.media_url, '_blank')}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 mt-1"
                                                            >
                                                                Open PDF
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 mb-2 max-w-[250px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-gray-500/20 p-2 rounded-lg">
                                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">File Attachment</p>
                                                            <button
                                                                onClick={() => window.open(message.media_url, '_blank')}
                                                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 mt-1"
                                                            >
                                                                Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {message.body && (
                                                <p className="text-sm leading-relaxed">{message.body}</p>
                                            )}
                                        </div>
                                    )}
                                    {message.message_type === "TEXT" && (
                                        <p className="text-sm leading-relaxed break-words">{message.body}</p>
                                    )}
                                    {message.message_type === "OFFER" && message.offer && (
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-4 shadow-sm max-w-[300px]">
                                            {/* Header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                                                    <Newspaper className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-gray-900">Project Offer</h3>
                                                    <p className="text-xs text-blue-600 font-medium">{message.offer.name}</p>
                                                </div>
                                            </div>

                                            {/* Project Details */}
                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-xs font-medium">Duration:</span>
                                                    <span className="text-gray-900 font-semibold text-xs bg-gray-200 px-2 py-1 rounded-md">{message.offer.timeline}</span>
                                                </div>
                                                
                                                {message.offer.budget && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 text-xs font-medium">Rate:</span>
                                                        <span className="text-gray-900 font-semibold text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md">${message.offer.budget}/hr</span>
                                                    </div>
                                                )}
                                                
                                                {message.offer.total_cost && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 text-xs font-medium">Total:</span>
                                                        <span className="text-blue-600 font-bold text-sm bg-blue-100 px-2 py-1 rounded-md">${message.offer.total_cost.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="pt-3 border-t border-blue-200">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 shadow-sm">
                                                    {message.offer.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={`flex items-center gap-2 mt-1 ${isCurrentUserMessage ? "justify-end" : "justify-start"}`}>
                                    <span className="text-xs text-gray-500">
                                        {new Date(message.time).toLocaleTimeString('en-US', { 
                                            hour: 'numeric', 
                                            minute: '2-digit', 
                                            hour12: true 
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        );
                    })}

                    {messages.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-2.28 1.014A1 1 0 017 19.586l1.087-2.451A8.002 8.002 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-1">No messages yet</h3>
                                <p className="text-xs text-gray-500">Start the conversation by sending a message!</p>
                            </div>
                        </div>
                    )}
                </ChatMessageList>
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
                <div className="flex flex-col space-y-3">
                    <div className="relative">
                        <ChatInput
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="min-h-12 resize-none rounded-2xl bg-gray-50 border-gray-200 border-2 p-4 pr-14 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 text-sm transition-all duration-200"
                            style={{ resize: 'none' }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Button 
                            onClick={handleSendMessage} 
                            size="sm" 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors duration-200 z-10"
                            disabled={!newMessage.trim()}
                        >
                            <CornerDownLeft className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CreateOffer 
                                uid={uid}
                                jobId={jobId}
                                sendOfferMessage={handleSendOffer}
                            />

                            <input
                                id="file-upload-messenger"
                                type="file"
                                accept="image/*,video/*,application/pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <label htmlFor="file-upload-messenger" className="cursor-pointer inline-flex items-center justify-center h-9 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors duration-200 text-sm font-medium">
                                <Paperclip className="h-4 w-4 mr-2" />
                                <span className="text-xs font-medium">Attach</span>
                            </label>
                        </div>

                        <div className="text-xs text-gray-500">
                            Press Enter to send
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}