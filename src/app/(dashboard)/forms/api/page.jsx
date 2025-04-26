"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { ApiIntegrationColumns } from "@/lib/tableCols";

export default function ApiIntegrationForm() {
    return (
        <Pagelayout title={"API Integration Requests"}>
            <DataTablePaginated
                columns={ApiIntegrationColumns}
                dataUrl={`get-all-forms/API`}
                filters={{}}
            />
        </Pagelayout>
    );
}
