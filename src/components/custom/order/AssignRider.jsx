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
import { ORDER_STATUS } from "@/lib/constant";
import { useEffect, useState } from "react";
import { postDataToAPI } from "@/lib/api";
import { toast } from "sonner";

export default function AssignRider({ oid }) {

    const [riders, setRiders] = useState([]);
    const [selectedRider, setSelectedRider] = useState()
    const [loading, setLoading] = useState(false);

    async function fetchNearbyRiders() {
        setLoading(true);
        const res = await postDataToAPI('fetchNearbyRiders/', { oid });

        if (res.status === 'success') {
            setRiders(res.riders)
            setSelectedRider(res.riders[0].id)
        }
        setLoading(false);
    }

    async function assignRider() {
        setLoading(true);
        const res = await postDataToAPI('assignRiderToOrder/', { oid, rid: selectedRider })

        if (res.status === 'success') {
            toast("Rider was assigned", {
                description: res.message
            })
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchNearbyRiders()
    }, [])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={loading}>Assign Rider To Order</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Nearby Riders</h4>
                        <p className="text-sm text-muted-foreground">
                            Below is a list of riders that are nearby the search radius of the order's pickup location.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Select value={selectedRider} onValueChange={(e) => setSelectedRider(e)} disabled={loading}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Rider to Assign" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select Rider</SelectLabel>
                                    {riders?.length > 0 && riders?.map((item, i) => (
                                        <SelectItem key={i} value={item.id}>{item.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={assignRider} className="mt-2 p-0" disabled={loading}>
                        {loading ? "Loading..." : "Assign"}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}