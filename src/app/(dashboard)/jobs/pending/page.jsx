"use client";

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { JobDetailsFreelancerColumns } from "@/lib/tableCols";

export default function PendingJobs() {
    return (
        <Pagelayout title={"Pending Jobs"}>
            <DataTablePaginated
                columns={JobDetailsFreelancerColumns}
                dataUrl={"freelancers/jobs/pending"}
                filters={{}}
                isFreelancer={true}
            />
        </Pagelayout>
    )
}