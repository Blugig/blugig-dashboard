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
import { WithdrawalEarningsColumns } from "@/lib/tableCols"
import DataTablePaginated from "@/components/custom/DataTablePaginated"

const RenderInputSearch = React.memo(({ inputValue, setInputValue }) => {
    return (
        <div className="w-full md:w-auto md:max-w-sm">
            <Input
                type="text"
                placeholder="Search by Freelancer ID"
                className="w-full"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
    )
});

export default function WithdrawalEarnings() {

    const [statusFilter, setStatusFilter] = React.useState("All");
    const [userIdSearch, setUserIdSearch] = React.useState("");
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setUserIdSearch(inputValue);
        }, 700);

        return () => clearTimeout(debounceTimer);
    }, [inputValue]);

    const RenderFilters = React.memo(({ setStatusFilter }) => {
        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                <Select onValueChange={(e) => setStatusFilter(e)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Withdrawal Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Withdrawal Status</SelectLabel>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        )
    });

    const filters = {
        status: statusFilter !== "All" ? statusFilter : undefined,
        freelancer_id: userIdSearch || undefined,
    };

    return (
        <Pagelayout title={"Earning Withdrawals"}>
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-8">
                <RenderFilters setStatusFilter={setStatusFilter} />
                <RenderInputSearch inputValue={inputValue} setInputValue={setInputValue} />
            </div>

            <DataTablePaginated
                columns={WithdrawalEarningsColumns}
                dataUrl={"get-withdrawals"}
                filters={filters}
            />
        </Pagelayout>
    )
}