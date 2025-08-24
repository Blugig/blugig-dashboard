"use client";

import React from "react";
import Pagelayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FreelancerDetailsColumns } from "@/lib/tableCols"
import DataTablePaginated from "@/components/custom/DataTablePaginated"
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postDataToAPI } from "@/lib/api";

export default function AllFreelancers() {
    const [exportFormat, setExportFormat] = React.useState(null); // xlsx or csv
    const [userIdSearch, setUserIdSearch] = React.useState("");
    const [isActive, setIsActive] = React.useState("all"); // "" for all, "true", "false"
    const [isApproved, setIsApproved] = React.useState("all"); // "" for all, "true", "false"

    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleBulkAction = async (selectedRows, clearSelection) => {
        if (selectedRows.length === 0) {
            toast.error("No rows selected");
            return;
        }

        setIsProcessing(true);
        // Extract IDs from selected rows
        const selectedIds = selectedRows.map(row => row.original.id);
        
        try {
            const res = await postDataToAPI('onboard-freelancers/', { ids: selectedIds });
    
            if (res) {
                toast.success(`Successfully processed ${selectedIds.length} items`);
                clearSelection();
            }
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
            {isProcessing && (
                <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <span>
                {isProcessing ? "Processing..." : "Approve Freelancers"}
            </span>
        </Button>
    );

    const filters = {
        user_id: userIdSearch || undefined,
        export_as: exportFormat,
        is_active: isActive,
        is_approved: isApproved,
    };

    return (
        <Pagelayout title={"All Freelancers"}>
            <div className="mb-4">
                <label className="text-lg font-semibold">Freelancer Filters</label>
            </div>
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    {/* <Select onValueChange={(e) => setExportFormat(e)}>
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
                    </Select> */}
                    <Select onValueChange={setIsActive} value={isActive}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Is Active" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Is Active</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setIsApproved} value={isApproved}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Is Approved" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Is Approved</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
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
                columns={FreelancerDetailsColumns}
                dataUrl={"get-freelancers"}
                filters={filters}
                setExportFormat={setExportFormat}
                multiSelectAction={<MultiSelectButton />}
            />
        </Pagelayout>
    )
}