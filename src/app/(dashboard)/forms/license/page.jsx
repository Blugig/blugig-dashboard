"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { LicenseRequestColumns } from "@/lib/tableCols";

export default function LicenseRequestForm() {
    return (
        <Pagelayout title={"License Requests"}>
            <DataTablePaginated
                columns={LicenseRequestColumns}
                dataUrl={`get-all-forms/LIR`}
                filters={{}}
            />
        </Pagelayout>
    );
}
