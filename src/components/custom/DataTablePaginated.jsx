"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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

function DataTablePaginated({ columns, dataUrl, filters = {}, setExportFormat = null }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const [columnFilters, setColumnFilters] = React.useState([])

    async function fetchTableData(dataUrl, page = 1) {
        // Filter out undefined values from filters object
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value);
            }
        });

        // Add pagination parameter
        queryParams.append('page', page);

        const res = await fetchFromAPI(`${dataUrl}/?${queryParams.toString()}`);
        return res;
    }

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const res = await fetchTableData(dataUrl, page, filters);

            setData(res?.results || []);
            setTotalCount(res?.count || 0);
            setNextPage(res?.next);
            setPreviousPage(res?.previous);
            setLoading(false);
        };

        getData();
    }, [page, filters]);

    const handleExport = async () => {
        if (!filters.export_as) return;

        await exportData(data, filters.export_as, "exported_data");
    };

    useEffect(() => {
        if (filters.export_as) {
            handleExport();
            setExportFormat(null);
        }
    }, [filters.export_as]);

    const handlePreviousPage = () => {
        if (previousPage) {
            setPage((prev) => Math.max(prev - 1, 1));
        }
    };

    const handleNextPage = () => {
        if (nextPage) {
            setPage((prev) => prev + 1);
        }
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            page,
            columnFilters
        },
        // onColumnFiltersChange: (updater) => {
        //     const newFilters = updater instanceof Function ? updater(table.getState().columnFilters) : updater;
        //     table.setColumnFilters(newFilters);
        // }
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
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
                                <TableCell colSpan={columns.length}>
                                    <Skeleton className="h-4 w-[60px]" />
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && (
                            <>
                                {table.getRowModel().rows?.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
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

export default DataTablePaginated;
