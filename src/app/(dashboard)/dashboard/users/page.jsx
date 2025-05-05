"use client"

import React, { useEffect, useState } from "react"
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
    const [exportFormat, setExportFormat] = React.useState(null); // xlsx or csv
    const [userIdSearch, setUserIdSearch] = React.useState("");

    const filters = {
        user_type: statusFilter !== "All" ? statusFilter : undefined,
        user_id: userIdSearch || undefined,
        export_as: exportFormat
    };

    return (
        <Pagelayout title={"All Users"}>
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <Select onValueChange={(e) => setStatusFilter(e)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
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
                    <Select onValueChange={(e) => setExportFormat(e)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Export Data To" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select Export Format</SelectLabel>
                                <SelectItem value="xlsx">XLSX</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-auto md:max-w-sm">
                    <Input 
                        type="text" 
                        placeholder="Search by User ID" 
                        className="w-full"
                        onChange={(e) => setUserIdSearch(e.target.value)} 
                    />
                </div>
            </div>

            <DataTablePaginated 
                columns={UserDetailsColumns} 
                dataUrl={"get-users"} 
                filters={filters} 
                setExportFormat={setExportFormat}
            />
        </Pagelayout>
    )
}