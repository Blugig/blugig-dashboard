"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/utils";

import { toast } from "sonner";
import { postDataToAPI } from "@/lib/api";

function TabContent({
    status = null,
    title = null,
    body,
    time,

    orderId = null,
    actionText = null
}) {

    const isActionValid = status !== 'inactive' && orderId && actionText;

    async function resolveOrderSOS() {
        if (isActionValid) {
            const res = await postDataToAPI('resolveSOS/', { oid: orderId })

            if (res.status === 'success') {
                toast("Rider SOS was resolved", {
                    description: res.message
                })
            }
        }
    }

    return (
        <Card>
            {status && (
                <CardHeader>
                    <Badge className={"w-fit text-xs font-regular px-4 py-2"}>{status}</Badge>
                </CardHeader>
            )}
            <CardContent>
                {title && (
                    <CardTitle className="text-lg">{title}</CardTitle>
                )}
                <CardDescription className={`${!status && 'mt-4'}`}>{body}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                {isActionValid && (
                    <Button onClick={resolveOrderSOS}>{actionText}</Button>
                )}
                <p className="text-xs text-slate-400">{formatDate(time)}</p>
            </CardFooter>
        </Card>
    )
}

export default function TabScreen({ data, orderId = null, actionText = null }) {

    if (!data || data?.length == 0) {
        return (
            <div className="w-full">
                <CardHeader className="text-center">No Data Available</CardHeader>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col space-y-4">
            {data.map((content, index) => (
                <TabContent
                    key={index}
                    {...content}
                    orderId={orderId}
                    actionText={actionText}
                />
            ))}
        </div>
    )
}