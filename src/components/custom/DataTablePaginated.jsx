"use client";

import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PackageOpen } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

import { fetchFromAPI } from "@/lib/api";
import { exportData } from "@/lib/exportData";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const RenderTableRow = ({ row }) => {
    return (
        <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                    )}
                </TableCell>
            ))}
        </TableRow>
    );
};


function DataTablePaginated({ columns, dataUrl, filters = {}, setExportFormat = null, multiSelectAction = null, isFreelancer = false }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const [columnFilters, setColumnFilters] = useState([])
    const [rowSelection, setRowSelection] = useState({})

    const fetchTableData = useCallback(async (currentPage) => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value);
            }
        });

        queryParams.append('page', currentPage);

        const res = await fetchFromAPI(`${dataUrl}/?${queryParams.toString()}`, isFreelancer);
        return res;
    }, [dataUrl, filters, isFreelancer]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const res = await fetchTableData(page);
            setData(res?.results || []);
            setTotalCount(res?.count || 0);
            setNextPage(res?.next);
            setPreviousPage(res?.previous);
            setLoading(false);
        };

        getData();
    }, [page, fetchTableData]);

    const handleExport = useCallback(async () => {
        if (!filters.export_as) return;
        await exportData(data, filters.export_as, "exported_data");
    }, [filters.export_as, data]);

    useEffect(() => {
        if (filters.export_as) {
            handleExport();
            if (setExportFormat) {
                setExportFormat(null);
            }
        }
    }, [filters.export_as, handleExport, setExportFormat]);

    const handlePreviousPage = useCallback(() => {
        if (previousPage) {
            setPage((prev) => Math.max(prev - 1, 1));
        }
    }, [previousPage]);

    const handleNextPage = useCallback(() => {
        if (nextPage) {
            setPage((prev) => prev + 1);
        }
    }, [nextPage]);

    const columnsWithSelection = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        ...columns,
    ], [columns]);

    const table = useReactTable({
        data,
        columns: columnsWithSelection,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            page,
            columnFilters,
            rowSelection,
        },
    });

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const filteredRowsLength = table.getFilteredRowModel().rows.length;

    const renderMultiSelectAction = useMemo(() => {
        if (selectedRows.length > 0 && multiSelectAction) {
            return (
                <div className="flex items-center space-x-2">
                    {React.cloneElement(multiSelectAction, {
                        selectedRows: selectedRows,
                        clearSelection: () => setRowSelection({}),
                    })}
                    <span className="text-sm text-muted-foreground">
                        •{"  "}
                        {selectedRows.length} of{" "}
                        {filteredRowsLength} row(s) selected.
                    </span>
                </div>
            );
        }
        return null;
    }, [selectedRows, multiSelectAction, filteredRowsLength]);

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex items-center space-x-2">
                    {renderMultiSelectAction}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={columnsWithSelection.length}>
                                    <Skeleton className="h-4 w-[60px]" />
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && (
                            <>
                                {table.getRowModel().rows?.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <RenderTableRow key={row.id} row={row} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columnsWithSelection.length}
                                            className="h-24 text-center"
                                        >
                                            <h1 className="flex items-center justify-center text-lg">
                                                <PackageOpen className="mr-2 h-6 w-6" />
                                                No Data Available.
                                            </h1>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground mr-auto">
                    Showing {totalCount} entries.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={!previousPage}
                    className={cn(
                        !previousPage && "cursor-not-allowed"
                    )}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!nextPage}
                    className={cn(
                        !nextPage && "cursor-not-allowed"
                    )}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default React.memo(DataTablePaginated);