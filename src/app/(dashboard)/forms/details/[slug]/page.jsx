"use client";

import Info from "@/components/custom/Info";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
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
import { MessageCircle, TrendingUp } from "lucide-react";
import ChatSidebar from "@/components/layout/ChatSidebar";
import useProfileStore from "@/store/session.store";
import UpdateJobProgress from "@/components/custom/jobs/UpdateJobProgress";

export default function FormDetails({ params }) {

    const { slug } = params;
    const { is_super_admin, profile } = useProfileStore();
    const [formId, formType] = slug.split("-");

    const [details, setDetails] = useState({});
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [jobProgress, setJobProgress] = useState(65); // Default progress value

    async function handleProgressUpdate(newProgress) {
        // This is where you would typically make an API call
        // For now, just updating the local state and logging
        console.log("Progress value selected:", newProgress);
        setJobProgress(newProgress);

        // TODO: Add API call here to save progress to backend
        // const res = await postDataToAPI('update-job-progress', {
        //     jobId: data?.job?.id,
        //     progress: newProgress
        // });
    }

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
        setIsLoading(true);
        try {
            const res = await postDataToAPI(`conversations/create`, {
                userId: data?.user?.id,
                jobId: parseInt(data?.job?.id),
            });

            if (res) {
                toast.success("Conversation started successfully");
                fetchData(); // Refresh the page data after starting conversation
            }
        } catch (error) {
            toast.error("Failed to start conversation");
        } finally {
            setIsLoading(false);
        }
    }

    const getStatusBadge = (status) => {
        // Form submission statuses
        if (status === 'submitted') {
            return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Submitted</Badge>;
        } else if (status === 'offer_pending') {
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Offer Pending</Badge>;
        } else if (status === 'inprogress') {
            return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">In Progress</Badge>;
        } else if (status === 'completed') {
            return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>;
        } else if (status === 'cancelled') {
            return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
        }

        return <Badge variant="outline">{status}</Badge>;
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Pagelayout title={"Form Details"}>
            {/* Job Progress Display & Update - Combined */}
            {(!is_super_admin &&
                data?.job?.awarded_to_user_type === 'admin' &&
                data?.job?.awarded_admin?.id === profile?.id &&
                data?.status !== 'cancelled') ? (
                <UpdateJobProgress
                    currentProgress={data?.job?.progress || 0}
                    onProgressUpdate={handleProgressUpdate}
                />
            ) : null}

            {/* Form Details */}
            <Card className="mb-4">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="flex flex-wrap">{getPermName(formType)} #{data?.details?.form_submission_id}</CardTitle>
                            <CardDescription>Forms details which the user filled and converstaion</CardDescription>
                        </div>
                        {data?.status && (
                            <div>
                                {getStatusBadge(data.status)}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <Link href={'/dashboard/users/' + data?.user?.id} className="block text-blue-400">
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
                {!is_super_admin || data?.status === 'cancelled' ? (null) : (
                    <>
                        {!conversationId ? (
                            <CardFooter className="flex justify-center sm:justify-start">
                                <Button onClick={startConversation} disabled={isLoading}>
                                    {isLoading ? "Starting..." : "Start a Conversation"}
                                </Button>
                            </CardFooter>
                        ) : (
                            <CardFooter className="flex justify-center sm:justify-start">
                                <Button onClick={() => setIsChatOpen(true)} className="gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    Open Chat
                                </Button>
                            </CardFooter>

                        )}
                    </>
                )}
            </Card>

            <ChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                uid={data?.user?.id}
                conversationId={conversationId}
                messages={messages}
                setMessages={setMessages}
                session={data?.session}
                userName={data?.user?.name}
                jobId={data?.job?.id}
            />
        </Pagelayout>
    )
}