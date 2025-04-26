"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { BookOneOnOneColumns } from "@/lib/tableCols";

export default function BookOneOnOneForm() {
    return (
        <Pagelayout title={"Book 1-on-1 Consultation"}>
            <DataTablePaginated
                columns={BookOneOnOneColumns}
                dataUrl={`get-all-forms/ONE`}
                filters={{}}
            />
        </Pagelayout>
    );
}
