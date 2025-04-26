"use client"

import DataTablePaginated from "@/components/custom/DataTablePaginated";
import Pagelayout from "@/components/layout/PageLayout";
import { SolutionImplementationColumns } from "@/lib/tableCols";

export default function SolutionForm() {

    return(
        <Pagelayout title={"Solution Implemenations"}>
            <DataTablePaginated 
                columns={SolutionImplementationColumns} 
                dataUrl={`get-all-forms/SOL`} 
                filters={{}}
            />
        </Pagelayout>
    )
}