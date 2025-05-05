"use client";

import DataTable from "@/components/custom/DataTable";
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
import { useEffect, useMemo, useState } from "react";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { UserSubmissionsColumns } from "@/lib/tableCols";
import { formatDate } from "@/lib/utils";
import UpdateStatus from "@/components/custom/status/UpdateStatus";
import { toast } from "sonner";

export default function UserDetails({ params }) {

    const [status, setStatus] = useState()
    const [user, setuser] = useState({})
    const [submissions, setSubmissions] = useState([])

    async function fetchUser() {
        const res = await fetchFromAPI(`get-user-details/${params.id}`)

        console.log(res);

        setuser(res?.user);
        setSubmissions(res?.submissions)
        setStatus(res?.user?.is_active ? "active" : "inactive")
    }

    useEffect(() => {
        fetchUser()
    }, [])

    async function handleStatusUpdate(e) {
        const res = await postDataToAPI('update-user-status/', {
            uid: params.id,
            status: e
        });

        toast(res.status, {
            description: res.message
        })
        fetchUser()
    }

    return (
        <Pagelayout title={"User Details"}>
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex">{user?.name}</CardTitle>
                    <CardDescription>Account details for the user and related orders</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Info title={"Name"} value={user?.name} />
                    <Info title={"Email"} value={user?.email || '-'} />
                    <Info title={"Phone Number"} value={user?.phone} />
                    <Info title={"User Type"} value={user?.user_type} />
                    <Info title={"Registration Date"} value={formatDate(user?.created_at)} />
                    <Info title={"Last Login"} value={formatDate(user?.last_login) || '-'} />
                    <Info title={"Company Name"} value={user?.company_name || '-'} />
                    <Info title={"Account Status"} value={user?.is_active ? "Active" : "Inactive"} />
                </CardContent>
                <CardFooter className="flex-wrap">
                    <UpdateStatus
                        label="Account"
                        value={status}
                        onStatusChange={handleStatusUpdate}
                        options={[
                            { key: 'active', value: 'Active' },
                            { key: 'inactive', value: 'Inactive' }
                        ]}
                    />
                </CardFooter>
            </Card>

            <CardTitle className="mt-4">Form submissions by user</CardTitle>
            <DataTable columns={UserSubmissionsColumns} data={submissions} />
        </Pagelayout>
    )
}