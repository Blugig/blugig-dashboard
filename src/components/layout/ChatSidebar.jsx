"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Messenger from "@/components/custom/forms/Messenger";

export default function ChatSidebar({ 
    isOpen, 
    onClose, 
    uid, 
    conversationId, 
    messages, 
    setMessages, 
    session,
    userName,
    jobId
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed right-0 top-0 h-full w-[40%] bg-white border-l shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5" />
                        <h2 className="font-semibold">Chat with {userName}</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Chat Content */}
                <div className="flex flex-col h-[calc(100%-73px)]">
                    {conversationId ? (
                        <Messenger
                            uid={uid}
                            conversationId={conversationId}
                            messages={messages}
                            setMessages={setMessages}
                            session={session}
                            jobId={jobId}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>No conversation started yet</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
