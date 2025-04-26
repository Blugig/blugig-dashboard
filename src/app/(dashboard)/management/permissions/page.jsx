"use client"

import React, { useEffect, useState } from "react"
import DataTable from "@/components/custom/DataTable"
import { Input } from "@/components/ui/input"
import Pagelayout from "@/components/layout/PageLayout"
import { fetchFromAPI } from "@/lib/api"
import Link from "next/link"

export default function PermissionsControl() {
    
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            accessorKey: "id",
            header: "User ID",
            cell: ({ row }) => <div className="text-blue-500">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email Address",
            cell: ({ row }) => <div>{row.getValue("email")}</div>,
        },
        { accessorKey: "is_super_admin", header: "Is Super Admin" },
        {
            id: "action",
            enableHiding: false,
            header: "Action",
            cell: ({ row }) => <Link className="text-blue-500" href={`/management/admin?email=${row.getValue("email")}`}>View</Link>,
        },
    ]

    const [email, setEmail] = React.useState("");


    const filteredData = React.useMemo(() => {
        let filtered = users;
        if (email) {
            filtered = filtered.filter(item => item.email.includes(email));
        }
        return filtered;
    }, [users, email]);

    useEffect(() => {
        async function fetchAdminUsers() {
            const res = await fetchFromAPI('get-admins/');
            
            setUsers(res)
            setLoading(false)
        }
        fetchAdminUsers()
    }, [])

    return (
        <Pagelayout title={"Permissions Control"}>
            <div className="w-full flex items-center justify-between mb-8">
                <Input type="text" placeholder="Search by Email Address" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <DataTable data={filteredData} columns={columns} loading={loading} />
        </Pagelayout>
    )
}