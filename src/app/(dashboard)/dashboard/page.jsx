import BarGraph from "@/components/custom/BarGraph";
import Pagelayout from "@/components/layout/PageLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { fetchFromAPI } from "@/lib/api";

export default async function Dashboard() {
    const dashboardData = await fetchFromAPI('dashboard-data/');

    // Calculate total counts with proper null checks
    const offerData = dashboardData?.acceptedRejectOffersData || {};
    const totalAccepted = Object.values(offerData).reduce((sum, v) => sum + (v?.accepted || 0), 0);
    const totalRejected = Object.values(offerData).reduce((sum, v) => sum + (v?.rejected || 0), 0);
    const totalPending = Object.values(offerData).reduce((sum, v) => sum + (v?.pending || 0), 0);

    return (
        <Pagelayout title={"Dashboard"}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
                <Card className="border bg-[#F99BAB66]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Total Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{dashboardData?.users || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border bg-[#9BDFC466]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Total Freelancers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{dashboardData?.freelancers || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border bg-[#FFE5B366]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Total Jobs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{dashboardData?.jobs || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border bg-[#E5F3FF66]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Form Submissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{dashboardData?.forms || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Second row of cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 mt-4">
                <Card className="border bg-[#F99BAB4D]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Admin Conversations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{dashboardData?.adminConversations || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            User-Admin chats
                        </p>
                    </CardContent>
                </Card>

                <Card className="border bg-[#9BDFC466]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Freelancer Conversations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{dashboardData?.freelancerConversations || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            User-Freelancer chats
                        </p>
                    </CardContent>
                </Card>

                <Card className="border bg-[#D4E5FF66]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">Rs. {dashboardData?.totalBudget || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From {dashboardData?.acceptedOffers || 0} accepted offers
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Summary metrics row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-8 mt-4">
                <Card className="border bg-gradient-to-r from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Accepted Offers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{dashboardData?.acceptedOffers || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Successfully completed
                        </p>
                    </CardContent>
                </Card>

                <Card className="border bg-gradient-to-r from-yellow-50 to-yellow-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Pending Offers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-yellow-600">{totalPending}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting response
                        </p>
                    </CardContent>
                </Card>

                <Card className="border bg-gradient-to-r from-red-50 to-red-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Rejected Offers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-red-600">{totalRejected}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Not accepted
                        </p>
                    </CardContent>
                </Card>

                <Card className="border bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base sm:text-lg font-medium">
                            Total Conversations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{dashboardData?.conversations || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All active chats
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
                <Card className="border-2">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-base sm:text-lg font-medium">
                                Marketplace Activity - Monthly Offer Status Overview
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Track the performance of offers between users, admins, and freelancers
                            </p>
                            <div className="flex gap-4 mt-2 text-sm">
                                <span className="text-green-600">✓ Accepted: {totalAccepted}</span>
                                <span className="text-red-600">✗ Rejected: {totalRejected}</span>
                                <span className="text-yellow-600">⏳ Pending: {totalPending}</span>
                            </div>
                        </div>

                        <Select>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue className="text-xs" placeholder="This year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current">Present Month</SelectItem>
                                <SelectItem value="last6">Last 6 months</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="w-full overflow-x-auto">
                        <div className="min-w-[300px]">
                            <BarGraph
                                labels={[
                                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                                ]}
                                acceptedData={Object.values(offerData).map(v => v?.accepted || 0)}
                                rejectedData={Object.values(offerData).map(v => v?.rejected || 0)}
                                pendingData={Object.values(offerData).map(v => v?.pending || 0)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Pagelayout>
    );
}
