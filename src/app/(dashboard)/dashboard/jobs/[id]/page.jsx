"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Pagelayout from "@/components/layout/PageLayout";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/custom/DataTable";
import { JobParticipantsColumns } from "@/lib/tableCols";
import { Loader2, Users, MessageSquare, FileText, Calendar, DollarSign, User, Mail, Phone } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function JobSuperAdminDetails() {
    const params = useParams();
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchJobDetails();
    }, [params.id]);

    async function fetchJobDetails() {
        try {
            setLoading(true);
            const res = await fetchFromAPI(`get-job-details/${params.id}`);

            if (res) {
                setJobData(res);
            } else {
                toast.error("Failed to fetch job details");
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
            toast.error("Failed to fetch job details");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <Pagelayout title="Job Details">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </Pagelayout>
        );
    }

    if (!jobData) {
        return (
            <Pagelayout title="Job Details">
                <div className="text-center py-8">
                    <h2 className="text-xl font-semibold">Job not found</h2>
                    <p className="text-muted-foreground">The requested job could not be found.</p>
                </div>
            </Pagelayout>
        );
    }

    const { job, stats, participants } = jobData;

    return (
        <Pagelayout title="Job Details">
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Freelancers with Active Conversations
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.freelancersWithActiveConversation}</div>
                            <p className="text-xs text-muted-foreground">
                                Active freelancer conversations
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Admins with Active Conversations
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.adminsWithActiveConversation}</div>
                            <p className="text-xs text-muted-foreground">
                                Active admin conversations
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Offers Made
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOffers}</div>
                            <p className="text-xs text-muted-foreground">
                                Offers submitted for this job
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Job Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Job Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Job ID</label>
                                    <p className="text-sm">{job.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Job Type</label>
                                    <div>
                                        <Badge variant="outline">{job.job_type}</Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                                    <p className="text-sm flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(job.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div>
                                        <Badge variant={job.job_type === 'awarded' ? 'default' : 'secondary'}>
                                            {job.job_type}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            
                            {job.form_submission && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Form Details</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Form Type</label>
                                            <p className="text-sm">{job.form_submission.form_name}</p>
                                        </div>
                                        {job.form_submission.form_title && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Title</label>
                                                <p className="text-sm">{job.form_submission.form_title}</p>
                                            </div>
                                        )}
                                        {job.form_submission.form_description && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Description</label>
                                                <p className="text-sm">{job.form_submission.form_description}</p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Form Status</label>
                                            <div>
                                                <Badge variant={job.form_submission.status === 'completed' ? 'default' : 'secondary'}>
                                                    {job.form_submission.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Client Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {job.client && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Client Name</label>
                                        <p className="text-sm font-medium">{job.client.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p className="text-sm flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {job.client.email}
                                        </p>
                                    </div>
                                    {job.client.phone && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                            <p className="text-sm flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {job.client.phone}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">User Type</label>
                                        <div>
                                            <Badge>{job.client.user_type}</Badge>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {job.awarded_to_user_type && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Assignment Details</h4>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Awarded To</label>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{job.awarded_to_user_type}</Badge>
                                            {job.awarded_admin && (
                                                <span className="text-sm">({job.awarded_admin.name})</span>
                                            )}
                                            {job.awarded_freelancer && (
                                                <span className="text-sm">({job.awarded_freelancer.name})</span>
                                            )}
                                        </div>
                                    </div>
                                    {job.awarded_at && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Awarded At</label>
                                            <p className="text-sm">{formatDate(job.awarded_at)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Participants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Participants</CardTitle>
                        <CardDescription>
                            Users who have made offers or are engaged in conversations for this job
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={JobParticipantsColumns} 
                            data={participants || []} 
                        />
                    </CardContent>
                </Card>
            </div>
        </Pagelayout>
    );
}