"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Info from "@/components/custom/Info";
import DataTable from "@/components/custom/DataTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { JobDetailsColumns } from "@/lib/tableCols";
import UpdateStatus from "@/components/custom/status/UpdateStatus";
import Pagelayout from "@/components/layout/PageLayout";

export default function FreelancerDetails({ params }) {

    const [status, setStatus] = useState()
    const [approved, setApproved] = useState()
    const [user, setuser] = useState({})
    const [stats, setStats] = useState({})
    const [jobs, setJobs] = useState([])

    async function fetchUser() {
        const res = await fetchFromAPI(`get-freelancer-details/${params.id}`)

        setuser(res?.user);
        setStats(res?.stats || {});
        setJobs(res?.jobs || []);
        setStatus(res?.user?.is_active ? "active" : "inactive")
        setApproved(res?.user?.is_approved ? "approved" : "pending")
    }

    useEffect(() => {
        fetchUser()
    }, [])

    async function handleStatusUpdate(e) {
        const res = await postDataToAPI('update-freelancer-status/', {
            uid: params.id,
            status: e
        });

        toast(res.status, {
            description: res.message
        });
        fetchUser()
    }

    async function handleApprovalUpdate(e) {
        const res = await postDataToAPI('update-freelancer-status/', {
            uid: params.id,
            is_approved: e
        });

        toast(res.status, {
            description: res.message
        });
        fetchUser()
    }

    return (
        <Pagelayout title={"Freelancer Details"}>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jobs Awarded</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.awardedJobs || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total jobs awarded to this freelancer
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeConversations || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Jobs with ongoing conversations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20m8-9H4" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalEarnings || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            From completed projects
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.conversionRate || 0}%</div>
                        <p className="text-xs text-muted-foreground">
                            Jobs awarded vs applications
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Freelancer Details Card */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex">{user?.name}</CardTitle>
                    <CardDescription>Account details for the freelancer and related jobs</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Info title={"Name"} value={user?.name} />
                    <Info title={"Email"} value={user?.email || '-'} />
                    <Info title={"Phone Number"} value={user?.phone} />
                    <Info title={"Registration Date"} value={formatDate(user?.created_at)} />
                    <Info title={"Last Login"} value={formatDate(user?.last_login) || '-'} />
                    <Info title={"Account Status"} value={user?.is_active ? "Active" : "Inactive"} />
                    <Info title={"Approval Status"} value={user?.is_approved ? "Approved" : "Pending"} />
                </CardContent>
                <CardFooter className="flex-wrap space-x-4">
                    <UpdateStatus
                        label="Account"
                        value={status}
                        onStatusChange={handleStatusUpdate}
                        options={[
                            { key: 'active', value: 'Active' },
                            { key: 'inactive', value: 'Inactive' }
                        ]}
                    />

                    <UpdateStatus
                        label="Approval"
                        value={approved}
                        onStatusChange={handleApprovalUpdate}
                        options={[
                            { key: 'approved', value: 'Approved' },
                            { key: 'pending', value: 'Pending' }
                        ]}
                    />
                </CardFooter>
            </Card>

            {/* Jobs Table */}
            <CardTitle className="mt-4">Jobs involving this freelancer</CardTitle>
            <DataTable columns={JobDetailsColumns} data={jobs} />
        </Pagelayout>
    )
}