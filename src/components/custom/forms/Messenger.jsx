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

export default function Messenger({ conversationId, messages, setMessages }) {

    const { profile, refreshProfile } = useProfileStore();

    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        (async () => {
            await refreshProfile();
        })();

        if (conversationId) {
            socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL);

            socketRef.current.emit("join_room", { conversation_id: conversationId });
            console.log("Joined Conversation");

            socketRef.current.on("new_message", (message) => {
                setMessages((prev) => [...prev, message]);
            });

            return () => {
                socketRef.current.disconnect();
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
        message.time = new Date().toLocaleTimeString();
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversation</CardTitle>
                <CardDescription>Real-time messaging interface for user communication</CardDescription>
            </CardHeader>
            <CardContent>
                <ChatMessageList
                    autoScrollEnabled
                    className="w-full h-[350px]"
                >
                    {messages.map(message => (
                        <ChatBubble
                            key={message.id}
                            variant={message?.sender_admin_id ? "sent" : "received"}
                        >
                            <ChatBubbleMessage variant={message?.sender_admin_id ? "sent" : "received"}>
                                {message.media_url ? (
                                    message.media_type.startsWith('image/') ? (
                                        <img 
                                            src={message.media_url} 
                                            alt="Shared image"
                                            className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] rounded-lg"
                                        />
                                    ) : message.media_type.startsWith('video/') ? (
                                        <video 
                                            controls
                                            className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] rounded-lg"
                                        >
                                            <source src={message.media_url} type={message.media_type} />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : null
                                ) : message.body}
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
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <Button variant="ghost" size="icon" asChild>
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