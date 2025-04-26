"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { HireSmartsheetExpertColumns } from "@/lib/tableCols";

export default function HireSmartsheetExpertForm() {
    return (
        <Pagelayout title={"Hire Smartsheet Expert"}>
            <DataTablePaginated
                columns={HireSmartsheetExpertColumns}
                dataUrl={`get-all-forms/EXP`}
                filters={{}}
            />
        </Pagelayout>
    );
}
