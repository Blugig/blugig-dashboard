"use client";

import React from "react";
import Pagelayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobDetailsColumns } from "@/lib/tableCols"
import DataTablePaginated from "@/components/custom/DataTablePaginated"
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { toast } from "sonner";

export default function AllJobs() {

    const [jobIdSearch, setJobIdSearch] = React.useState("");
    const [clientIdSearch, setClientIdSearch] = React.useState("");
    const [jobType, setJobType] = React.useState("all");
    const [awardedToUserType, setAwardedToUserType] = React.useState("all");

    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleBulkAction = async (selectedRows, clearSelection) => {
        if (selectedRows.length === 0) {
            toast.error("No rows selected");
            return;
        }

        // Extract IDs from selected rows
        const selectedIds = selectedRows.map(row => row.original.id);
        
        setIsProcessing(true);
        
        try {

            const res = await postDataToAPI("mark-jobs-as-open/", { ids: selectedIds });
            if (res) {
                toast.success(`Successfully processed ${selectedIds.length} items`);
            }

            clearSelection();
        } catch (error) {
            console.error('Bulk action error:', error);
            toast.error("An error occurred while processing the request");
        } finally {
            setIsProcessing(false);
        }
    };

    const MultiSelectButton = ({ selectedRows, clearSelection }) => (
        <Button
            size="sm"
            onClick={() => handleBulkAction(selectedRows, clearSelection)}
            disabled={isProcessing}
            className="flex items-center space-x-2"
        >
            {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Check className="h-4 w-4" />
            )}
            <span>
                {isProcessing ? "Processing..." : "Mark as External Jobs"}
            </span>
        </Button>
    );

    const filters = {
        job_id: jobIdSearch || undefined,
        client_id: clientIdSearch || undefined,
        job_type: jobType || undefined,
        awarded_to_user_type: awardedToUserType || undefined,
    };

    return (
        <Pagelayout title={"All Jobs"}>
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-8">
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Search by Job ID"
                            className="w-full"
                            onChange={(e) => setJobIdSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="Search by Client ID"
                            className="w-full"
                            onChange={(e) => setClientIdSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <Select onValueChange={setJobType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Job Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Job Type</SelectLabel>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="internal">Internal</SelectItem>
                                    <SelectItem value="open">External</SelectItem>
                                    <SelectItem value="awarded">Awarded</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select onValueChange={setAwardedToUserType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Awarded To" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Awarded To</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="freelancer">Freelancer</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <DataTablePaginated
                columns={JobDetailsColumns}
                dataUrl={"get-jobs"}
                filters={filters}
                multiSelectAction={<MultiSelectButton />}
            />
        </Pagelayout>
    )
}