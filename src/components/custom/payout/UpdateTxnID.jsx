"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { postDataToAPI } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function UpdateTransactionStatus({
    rid,
    value,
}) {

    const [isLoading, setIsLoading] = useState(false)
    const [transactionId, setTransactionId] = useState(value)

    async function handleUpdate() {
        setIsLoading(true)
        const res = await postDataToAPI('updateWithdrawalRequestID/', {
            rid,
            transactionId
        })

        toast(res.status, {
            description: res?.message,
        })
        
        setIsLoading(false)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Update Transaction ID</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Transaction ID</h4>
                        <p className="text-sm text-muted-foreground">
                            Update Transaction ID
                        </p>
                    </div>
                    <div className="grid gap-2">
                        
                        <Input 
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />

                        <Button onClick={handleUpdate} disabled={isLoading || value === transactionId}>
                            {isLoading ? 'Updating...' : 'Confirm'}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}