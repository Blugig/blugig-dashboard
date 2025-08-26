"use client";

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { JobDetailsFreelancerColumns } from "@/lib/tableCols";

export default function AwardedJobs() {
    return (
        <Pagelayout title={"Awarded Jobs"}>
            <DataTablePaginated
                columns={JobDetailsFreelancerColumns}
                dataUrl={"freelancers/jobs/awarded"}
                filters={{}}
                isFreelancer={true}
            />
        </Pagelayout>
    )
}