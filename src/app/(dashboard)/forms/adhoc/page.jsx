"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { AdhocRequestColumns } from "@/lib/tableCols";

export default function AdhocRequestForm() {
    return (
        <Pagelayout title={"Adhoc Request"}>
            <DataTablePaginated
                columns={AdhocRequestColumns}
                dataUrl={`get-all-forms/ADH`}
                filters={{}}
            />
        </Pagelayout>
    );
}
