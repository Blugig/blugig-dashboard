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
import { MessageCircle, Calendar, User, Briefcase } from "lucide-react";
import ChatSidebar from "@/components/layout/ChatSidebar";
import { Badge } from "@/components/ui/badge";
import useProfileStore from "@/store/session.store";
import UpdateJobProgress from "@/components/custom/jobs/UpdateJobProgress";

export default function JobFreelancerDetails({ params }) {

    const { id } = params;
    const { is_freelancer, profile } = useProfileStore();

    const [details, setDetails] = useState({});
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchDetails() {
        try {
            setLoading(true);
            const res = await postDataToAPI("freelancers/job-details", {
                jobId: parseInt(id),
            }, false, true);

            if (res) {
                console.log(res);
                setData(res);
                setDetails(res.details || {});

                if (res.conversation) {
                    setConversationId(res.conversation.id);
                    setMessages(res.conversation.messages || []);
                }
            }
        } catch (error) {
            toast.error("Failed to fetch job details");
        } finally {
            setLoading(false);
        }
    }

    async function startConversation() {
        setIsLoading(true);
        try {
            const res = await postDataToAPI(`conversations/create`, {
                userId: data?.client?.id,
                jobId: parseInt(id),
            }, false, true);

            if (res) {
                toast.success("Conversation started successfully");
                fetchDetails(); // Refresh the page data after starting conversation
            }
        } catch (error) {
            toast.error("Failed to start conversation");
        } finally {
            setIsLoading(false);
        }
    }

    async function updateProgress(progress) {
        try {
            const res = await postDataToAPI(`freelancers/update-job-progress`, {
                progress,
                jobId: parseInt(data?.job?.id),
            }, false, true);
            console.log(res);
    
            if (res) {
                toast.success("Job progress updated successfully");
                fetchDetails(); // Refresh the page data after updating progress
            }
        } catch (error) {
            toast.error("Failed to update job progress");
        }
    }

    useEffect(() => {
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <Pagelayout title={"Job Details"}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading job details...</p>
                    </div>
                </div>
            </Pagelayout>
        );
    }

    const getStatusBadge = (jobType) => {
        if (jobType === 'open') {
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Open</Badge>;
        } else if (jobType === 'awarded') {
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Awarded</Badge>;
        }
        return <Badge variant="outline">{jobType}</Badge>;
    };

    return (
        <Pagelayout title={"Job Details"}>
            {/* Job Overview Card */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <Briefcase className="h-5 w-5 text-blue-500" />
                                Job # {data?.job?.id}
                            </CardTitle>
                            <CardDescription className="mt-2">
                                {data.formType ? getPermName(data.formType) : 'Job Details'}
                            </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            {getStatusBadge(data?.job?.job_type)}
                            {data?.job?.created_at && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(data.job.created_at).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Job Details */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />

                        Client Details
                    </CardTitle>
                    <CardDescription>Information about the client and project requirements</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <Link href={'/dashboard/users/' + data?.client?.id} className="block text-blue-400 hover:text-blue-600 transition-colors">
                        <Info
                            title={"Client"}
                            value={data?.client?.name}
                        />
                    </Link>

                    <Info
                        title={"Client Email"}
                        value={data?.client?.email}
                    />

                    <Info
                        title={"Job ID"}
                        value={`#${data?.job?.id}`}
                    />

                    {data?.job?.awarded_at && (
                        <Info
                            title={"Awarded Date"}
                            value={new Date(data.job.awarded_at).toLocaleDateString()}
                        />
                    )}

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

                {/* Action Buttons */}
                <CardFooter className="flex justify-start gap-3 pt-6 border-t">
                    {!conversationId && is_freelancer ? (
                        <Button onClick={startConversation} disabled={isLoading} className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            {isLoading ? "Starting..." : "Start Conversation"}
                        </Button>
                    ) : (
                        <Button onClick={() => setIsChatOpen(true)} className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Open Chat
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <ChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                uid={data?.client?.id}
                conversationId={conversationId}
                messages={messages}
                setMessages={setMessages}
                session={data.session}
                userName={data?.client?.name}
            />

            {/* Show to awarded freelancer only */}
            {data?.job?.job_type === 'awarded' && data?.job?.awarded_freelancer?.id === profile?.id && (
                <UpdateJobProgress
                    currentProgress={data?.job?.progress}
                    onProgressUpdate={updateProgress}
                />
            )}
        </Pagelayout>
    )
}