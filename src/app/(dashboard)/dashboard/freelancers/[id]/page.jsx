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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import UpdateStatus from "@/components/custom/status/UpdateStatus";
import Pagelayout from "@/components/layout/PageLayout";

export default function FreelancerDetails({ params }) {

    const [status, setStatus] = useState()
    const [approved, setApproved] = useState()
    const [user, setuser] = useState({})

    async function fetchUser() {
        const res = await fetchFromAPI(`get-freelancer-details/${params.id}`)

        console.log(res);
        setuser(res?.user);
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
        </Pagelayout>
    )
}