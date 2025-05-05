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
import { useEffect, useState } from "react";
import { postDataToAPI } from "@/lib/api";
import { toast } from "sonner";
import { getPermName } from "@/lib/constant";
import Link from "next/link";
import Messenger from "@/components/custom/forms/Messenger";

export default function FormDetails({ params }) {

    const { slug } = params;
    const [formId, formType] = slug.split("-");

    const [details, setDetails] = useState({});
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState({})

    async function fetchData() {
        const res = await postDataToAPI(`get-form-details/`, {
            formId: parseInt(formId),
            formType
        });

        if (res) {
            setData(res);

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
        fetchData()
    }, [])

    return (
        <Pagelayout title={"Form Details"}>
            {/* Form Details */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex flex-wrap">{getPermName(formType)} #{data?.details?.form_submission_id}</CardTitle>
                    <CardDescription>Forms details which the user filled and converstaion</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <Link href={'/dashboard/users/' + data?.user?.id} className="block">
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
                    <CardFooter className="flex justify-center sm:justify-start">
                        <Button onClick={startConversation}>Start a Conversation</Button>
                    </CardFooter>
                )}
            </Card>

            {conversationId && (
                <Messenger
                    conversationId={conversationId}
                    messages={messages}
                    setMessages={setMessages}
                />
            )}
        </Pagelayout>
    )
}