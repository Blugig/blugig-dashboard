"use client";

import React, { useEffect, useState } from "react";
import Pagelayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Calendar, User, FileText, MessageSquare, ChevronLeft, ChevronRight, Building } from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import { toast } from "sonner";
import { formatDate, cn } from "@/lib/utils";
import Link from "next/link";

// Job Card Component
function JobCard({ job }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">
                            {job.form_submission?.form_title || job.form_submission?.form_name || 'Untitled Job'}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                            {job.form_submission?.form_description || 'No description available'}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                        {job.form_submission?.form_name}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {/* Client Info */}
                    {job.client && (
                        <div className="flex items-center space-x-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{job.client.name}</span>
                            <Badge variant="secondary" className="text-xs">
                                {job.client.user_type}
                            </Badge>
                        </div>
                    )}

                    {/* Job Stats */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(job.created_at)}</span>
                        </div>
                        {job._count && (
                            <>
                                <div className="flex items-center space-x-1">
                                    <FileText className="h-4 w-4" />
                                    <span>{job._count.offers || 0} offers</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{job._count.conversations || 0} conversations</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Awarded Info */}
                    {job.awarded_to_user_type && (
                        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">
                                Awarded to {job.awarded_to_user_type}
                                {job.awarded_admin && ` (${job.awarded_admin.name})`}
                                {job.awarded_freelancer && ` (${job.awarded_freelancer.name})`}
                            </span>
                        </div>
                    )}

                    {/* Form Status */}
                    <div className="flex items-center justify-between">
                        <Link href={`/jobs/${job.id}`} className="text-blue-500 hover:underline text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Loading Card Component
function LoadingCard() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AllFreelancerJobs() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    async function fetchTableData(dataUrl, page = 1) {
        // Add pagination parameter
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);

        const res = await fetchFromAPI(`${dataUrl}/?${queryParams.toString()}`, true); // isFreelancer = true
        return res;
    }

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const res = await fetchTableData("freelancers/jobs", page);

                setData(res?.results || []);
                setTotalCount(res?.count || 0);
                setNextPage(res?.next);
                setPreviousPage(res?.previous);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                toast.error('Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [page]);

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

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1); // Reset to first page when searching
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Pagelayout title={"All Jobs"}>
            <div className="space-y-6">
                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Loading cards
                        Array.from({ length: 6 }, (_, i) => (
                            <LoadingCard key={i} />
                        ))
                    ) : data.length > 0 ? (
                        // Job cards
                        data.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))
                    ) : (
                        // No data state
                        <div className="col-span-full">
                            <Card className="p-8">
                                <div className="text-center">
                                    <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                                    <p className="text-gray-500">
                                        There are no jobs available at the moment.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && data.length > 0 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {page} - Showing {data.length} of {totalCount} entries
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={!previousPage}
                                className={cn(
                                    "flex items-center gap-1",
                                    !previousPage && "cursor-not-allowed opacity-50"
                                )}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={!nextPage}
                                className={cn(
                                    "flex items-center gap-1",
                                    !nextPage && "cursor-not-allowed opacity-50"
                                )}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Pagelayout>
    )
}