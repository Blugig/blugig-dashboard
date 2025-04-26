"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { PAYOUT_STATUS } from "@/lib/constant";
import { useState } from "react";
import { postDataToAPI } from "@/lib/api";
import { toast } from "sonner";

export default function UpdateTransactionStatus({
    rid,
    value,
}) {

    const [selectedStatus, setSelectedStatus] = useState(value)
    const [isLoading, setIsLoading] = useState(false)

    async function handleStatusUpdate() {
        setIsLoading(true)
        const res = await postDataToAPI('updateWithdrawalRequestStatus/', {
            rid,
            status: selectedStatus
        })

        toast(res.status, {
            description: res?.message,
        })
        
        setSelectedStatus(selectedStatus)
        setIsLoading(false)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Update Order Status</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Payout Status</h4>
                        <p className="text-sm text-muted-foreground">
                            Update Payout Status
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full mb-2">
                                <SelectValue placeholder="Payout Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select Status</SelectLabel>
                                    {PAYOUT_STATUS.map((item, i) => (
                                        <SelectItem key={i} value={item.key}>{item.value}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleStatusUpdate} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Confirm'}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}