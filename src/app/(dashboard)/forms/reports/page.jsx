"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { ReportsDashboardColumns } from "@/lib/tableCols";

export default function ReportsDashboardForm() {
    return (
        <Pagelayout title={"Reports & Dashboard"}>
            <DataTablePaginated
                columns={ReportsDashboardColumns}
                dataUrl={`get-all-forms/REP`}
                filters={{}}
            />
        </Pagelayout>
    );
}
