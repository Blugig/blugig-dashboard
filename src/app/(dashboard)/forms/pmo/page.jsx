"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { PmoControlCenterColumns } from "@/lib/tableCols";

export default function PmoControlCenterForm() {
    return (
        <Pagelayout title={"PMO Control Center"}>
            <DataTablePaginated 
                columns={PmoControlCenterColumns}
                dataUrl={`get-all-forms/PMO`}
                filters={{}}
            />
        </Pagelayout>
    );
}
