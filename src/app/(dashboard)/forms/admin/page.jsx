"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { SystemAdminSupportColumns } from "@/lib/tableCols";

export default function SystemAdminSupportForm() {
    return (
        <Pagelayout title={"System Admin Support"}>
            <DataTablePaginated
                columns={SystemAdminSupportColumns}
                dataUrl={`get-all-forms/SYS`}
                filters={{}}
            />
        </Pagelayout>
    );
}
