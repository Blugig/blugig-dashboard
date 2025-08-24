"use client"

import { useState } from "react";
import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { BookOneOnOneColumns } from "@/lib/tableCols";
import { Button } from "@/components/ui/button";
import { fetchFromAPI } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, Loader2, Check } from "lucide-react";

export default function BookOneOnOneForm() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBulkAction = (selectedRows, clearSelection) => {
        if (selectedRows.length === 0) {
            toast.error("No rows selected");
            return;
        }

        // Extract IDs from selected rows
        const selectedIds = selectedRows.map(row => row.original.id);
        
        setIsProcessing(true);
        
        try {
            toast.success(`Successfully processed ${selectedIds.length} items`);
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

    return (
        <Pagelayout title={"Book 1-on-1 Consultation"}>
            <DataTablePaginated
                columns={BookOneOnOneColumns}
                dataUrl={`get-all-forms/ONE`}
                filters={{}}
                multiSelectAction={<MultiSelectButton />}
            />
        </Pagelayout>
    );
}
