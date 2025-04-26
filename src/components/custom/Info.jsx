import { Skeleton } from "../ui/skeleton";

export default function Info({ title, value }) {
    return (
        <div className="flex flex-col">
            {!title 
                ? <Skeleton className={"h-4 w-[50px]"} />
                : <p className="text-sm text-gray-400">{title}</p>
            }

            {!value
                ? <Skeleton className={"h-4 w-[80px]"} />
                : <span className="text-md font-semibold">{value || "-"}</span>
            }
        </div>
    )
}