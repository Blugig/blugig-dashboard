"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { PremiumAppSupportColumns } from "@/lib/tableCols";

export default function PremiumAppSupportForm() {
    return (
        <Pagelayout title={"Premium App Support"}>
            <DataTablePaginated
                columns={PremiumAppSupportColumns}
                dataUrl={`get-all-forms/PRM`}
                filters={{}}
            />
        </Pagelayout>
    );
}
