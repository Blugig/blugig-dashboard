"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

export default function Messenger({ uid, conversationId, messages, setMessages, session }) {

    const { profile, refreshProfile } = useProfileStore();

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
            sender_id: profile?.id, // or current user's ID
            body: newMessage,
            sender_role: "admin",
            message_type: "TEXT"
        };

        socketRef.current.emit("send_message", message);

        // Add the sent message to the local state
        message.time = new Date();
        message.sender_admin_id = true;
        message.id = Date.now();
        setMessages((prev) => [...prev, message])

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
                sender_id: profile?.id,
                body: null,
                media_url: url,
                media_type,
                sender_role: "admin",
                message_type: "MEDIA"
            };

            socketRef.current.emit("send_message", message);

            message.time = new Date();
            message.sender_admin_id = true;
            message.id = Date.now();
            setMessages((prev) => [...prev, message]);
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
            sender_id: profile?.id,
            sender_role: "admin",
            body: null,
            offer_id: offer.id,
            message_type: "OFFER"
        };

        socketRef.current.emit("send_message", message);

        // Add the sent message to the local state
        message.time = new Date();
        message.sender_admin_id = true;
        message.id = Date.now();
        message.offer = offer;
        setMessages((prev) => [...prev, message])
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversation</CardTitle>
                <CardDescription>Real-time messaging interface for user communication</CardDescription>
            </CardHeader>
            <CardContent>
                <ChatMessageList
                    className="w-full h-full max-h-[400px] overflow-y-auto"
                >
                    {messages.map(message => (
                        <ChatBubble
                            key={message.id}
                            variant={message?.sender_admin_id ? "sent" : "received"}
                        >
                            <ChatBubbleMessage variant={message?.sender_admin_id ? "sent" : "received"}>
                                {message.message_type === "MEDIA" && (
                                    <div className="media-container">
                                        {message.media_type.startsWith('image/') ? (
                                            <div className="relative group">
                                                <img
                                                    src={message.media_url}
                                                    alt="Shared image"
                                                    className="w-full max-w-[350px] md:max-w-[450px] lg:max-w-[500px] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                                                    onClick={() => window.open(message.media_url, '_blank')}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200 flex items-center justify-center">
                                                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full transition-opacity duration-200">
                                                        Click to view full size
                                                    </span>
                                                </div>
                                            </div>
                                        ) : message.media_type.startsWith('video/') ? (
                                            <div className="relative">
                                                <video
                                                    controls
                                                    className="w-full max-w-[350px] md:max-w-[450px] lg:max-w-[500px] rounded-xl shadow-md border border-gray-200"
                                                    preload="metadata"
                                                >
                                                    <source src={message.media_url} type={message.media_type} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        ) : message.media_type === 'application/pdf' ? (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-[350px] md:max-w-[450px] lg:max-w-[500px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-red-100 p-2 rounded-lg">
                                                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">PDF Document</p>
                                                        <p className="text-sm text-gray-600">Click to view or download</p>
                                                    </div>
                                                    <button
                                                        onClick={() => window.open(message.media_url, '_blank')}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        Open
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-[350px] md:max-w-[450px] lg:max-w-[500px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gray-100 p-2 rounded-lg">
                                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">File Attachment</p>
                                                        <p className="text-sm text-gray-600">{message.media_type}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => window.open(message.media_url, '_blank')}
                                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        Open
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {message.body && (
                                            <p className="mt-3 text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">{message.body}</p>
                                        )}
                                    </div>
                                )}
                                {message.message_type === "TEXT" && message.body}
                                {message.message_type === "OFFER" && message.offer && (
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 max-w-sm shadow-lg">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <Newspaper className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">Project Offer</h3>
                                                <p className="text-sm text-blue-600 font-medium">{message.offer.name}</p>
                                            </div>
                                        </div>

                                        {/* Project Details Grid */}
                                        <div className="space-y-3 mb-5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 font-medium">Duration:</span>
                                                <span className="text-gray-900 font-semibold">{message.offer.timeline}</span>
                                            </div>
                                            
                                            {message.offer.budget && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Rate:</span>
                                                    <span className="text-gray-900 font-semibold">${message.offer.budget}/hour</span>
                                                </div>
                                            )}
                                            
                                            {message.offer.estimated_hours && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Est. Hours:</span>
                                                    <span className="text-gray-900 font-semibold">{message.offer.estimated_hours} hrs</span>
                                                </div>
                                            )}
                                            
                                            {message.offer.total_cost && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Total:</span>
                                                    <span className="text-blue-600 font-bold text-lg">${message.offer.total_cost.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Deliverables Section */}
                                        {message.offer.deliverables && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">Deliverables:</h4>
                                                <ul className="space-y-2">
                                                    {message.offer.deliverables.split(',').map((deliverable, index) => (
                                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                                            <span className="text-blue-500 mt-1">•</span>
                                                            <span>{deliverable.trim()}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="mt-4 pt-4 border-t border-blue-200">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {message.offer.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </ChatBubbleMessage>
                            <ChatBubbleTimestamp timestamp={new Date(message.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} />
                        </ChatBubble>
                    ))}

                    {messages.length === 0 && (
                        <span className="w-full text-center text-slate-400">No conversation exists. Start one to begin messaging.</span>
                    )}
                </ChatMessageList>

            </CardContent>
            <CardFooter className="relative flex flex-col rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-2 m-4">
                <ChatInput
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none rounded-lg bg-background border-2 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="w-full flex items-center justify-between p-3 pt-2">
                    <CreateOffer 
                        uid={uid}
                        sendOfferMessage={handleSendOffer}
                    />

                    <label htmlFor="file-upload" className="cursor-pointer">
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <Button variant="outline" size="icon" asChild>
                            <div>
                                <Paperclip className="size-4" />
                                <span className="sr-only">Attach file</span>
                            </div>
                        </Button>
                    </label>

                    <Button onClick={handleSendMessage} size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}