"use client";

import Info from "@/components/custom/Info";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Pagelayout from "@/components/layout/PageLayout";
import { useEffect, useRef, useState } from "react";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { getPermName } from "@/lib/constant";
import Link from "next/link";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleMessage, ChatBubbleTimestamp } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Paperclip, CornerDownLeft } from "lucide-react";
import { io } from "socket.io-client";

export default function FormDetails({ params }) {

    const { slug } = params;
    const [formId, formType] = slug.split("-");

    const [details, setDetails] = useState({});
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState({})

    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef(null);

    async function fetchData() {
        const res = await postDataToAPI(`get-form-details/`, {
            formId: parseInt(formId),
            formType
        });

        if (res) {
            setData(res);
            console.log(res);

            const { id, form_submission_id, ...remainingDetails } = res?.details || {};
            setDetails(remainingDetails);

            setConversationId(res?.conversation?.id);
            if (res?.conversation?.messages) {
                setMessages(res?.conversation?.messages)
            }
        }
    }

    async function startConversation() {
        const res = await postDataToAPI(`conversations/create`, {
            userId: data?.user?.id,
            formId: parseInt(formId),
        });

        if (res) {
            toast.success("Conversation started successfully");
            fetchData(); // Refresh the page data after starting conversation
        }
    }

    useEffect(() => {
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
            sender_id: "admin", // or current user's ID
            body: newMessage,
            message_type: "TEXT"
        };

        socketRef.current.emit("send_message", message);

        setMessages((prev) => [...prev, message])

        setNewMessage("");
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Pagelayout title={"Form Details"}>
            {/* Form Details */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex">{getPermName(formType)} #{data?.details?.form_submission_id}</CardTitle>
                    <CardDescription>Forms details which the user filled and converstaion</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-6">

                    <Link href={'/dashboard/users/' + data?.user?.id}>
                        <Info
                            title={"User"}
                            value={data?.user?.name}
                        />
                    </Link>

                    {Object.entries(details).map(([key, value]) => {
                        const title = key.split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

                        return (
                            <Info
                                key={key}
                                title={title}
                                value={value || '-'}
                            />
                        );
                    })}
                </CardContent>
                {!conversationId && (
                    <CardFooter>
                        <Button onClick={startConversation}>Start a Conversation</Button>
                    </CardFooter>
                )}
            </Card>

            {conversationId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Conversation</CardTitle>
                        <CardDescription>Real-time messaging interface for user communication</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChatMessageList
                            autoScrollEnabled
                            className="w-full h-[400px]"
                        >
                            {messages.map(message => (
                                <ChatBubble
                                    key={message.id}
                                    variant={message.sender_id === "admin" ? "sent" : "received"}
                                >
                                    <ChatBubbleMessage variant={message.sender_id === "admin" ? "sent" : "received"}>
                                        {message.body}
                                    </ChatBubbleMessage>
                                    <ChatBubbleTimestamp timestamp={new Date(message.time).toLocaleTimeString()} />
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
                            <Button variant="ghost" size="icon">
                                <Paperclip className="size-4" />
                                <span className="sr-only">Attach file</span>
                            </Button>

                            <Button onClick={handleSendMessage} size="sm" className="ml-auto gap-1.5">
                                Send Message
                                <CornerDownLeft className="size-3.5" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </Pagelayout>
    )
}