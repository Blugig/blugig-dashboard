"use client"

import React, { useEffect, useState } from "react"
import { DatePickerWithRange } from "@/components/custom/DateRangePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Pagelayout from "@/components/layout/PageLayout"
import { UserDetailsColumns } from "@/lib/tableCols"
import DataTablePaginated from "@/components/custom/DataTablePaginated"

export default function Users() {

    const [statusFilter, setStatusFilter] = React.useState("All");
    const [userIdSearch, setUserIdSearch] = React.useState("");

    const filters = {
        user_type: statusFilter !== "All" ? statusFilter : undefined,
        user_id: userIdSearch || undefined,
    };

    return (
        <Pagelayout title={"All Users"}>
            <div className="w-full flex items-center justify-between mb-8">
                <div className="flex items-center justify-center space-x-4">
                    <Select onValueChange={(e) => setStatusFilter(e)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="User Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select Account Status</SelectLabel>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="seller">Seller</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex w-full max-w-sm items-center space-x-2 ml-auto">
                    <Input type="text" placeholder="Search by User ID" onChange={(e) => setUserIdSearch(e.target.value)} />
                </div>
            </div>

            <DataTablePaginated columns={UserDetailsColumns} dataUrl={"get-users"} filters={filters} />
        </Pagelayout>
    )
}