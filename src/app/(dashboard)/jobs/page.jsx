"use client";

import React from "react";
import Pagelayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobDetailsFreelancerColumns } from "@/lib/tableCols"
import DataTablePaginated from "@/components/custom/DataTablePaginated"
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { toast } from "sonner";

export default function AllFreelancerJobs() {

    const filters = {};

    return (
        <Pagelayout title={"All Jobs"}>
            <DataTablePaginated
                columns={JobDetailsFreelancerColumns}
                dataUrl={"jobs"}
                filters={filters}
                isFreelancer={true}
                // multiSelectAction={<MultiSelectButton />}
            />
        </Pagelayout>
    )
}