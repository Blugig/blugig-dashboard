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
import { useState } from "react";

export default function UpdateStatus({
    label="",
    value,
    onStatusChange,
    options
}) {

    const [status, setStatus] = useState(value)
    const [isConfirmed, setIsConfirmed] = useState(false)

    const handleConfirm = () => {
        onStatusChange(status);
        setIsConfirmed(false);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Update {label} Status</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{label} Status</h4>
                        <p className="text-sm text-muted-foreground">
                            Update {label} status.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={`${label} Status`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select Status</SelectLabel>
                                    {options.map((item, i) => (
                                        <SelectItem key={i} value={item.key}>{item.value}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}