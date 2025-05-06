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

  // Calculate total counts
  const totalAccepted = Object.values(dashboardData?.acceptedRejectOffersData).reduce((sum, v) => sum + v.accepted, 0);
  const totalRejected = Object.values(dashboardData?.acceptedRejectOffersData).reduce((sum, v) => sum + v.rejected, 0);
  const totalPending = Object.values(dashboardData?.acceptedRejectOffersData).reduce((sum, v) => sum + v.pending, 0);

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
            <div className="text-xl sm:text-2xl font-bold">{dashboardData.users}</div>
          </CardContent>
        </Card>

        <Card className="border bg-[#9BDFC466]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base sm:text-lg font-medium">
              Total Form Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardData.forms}</div>
          </CardContent>
        </Card>

        <Card className="border bg-[#F99BAB4D] sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base sm:text-lg font-medium">
              Conversations Initiated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardData.conversations}</div>
          </CardContent>
        </Card>

        <Card className="border bg-[#F99BAB4D] sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base sm:text-lg font-medium">
              Total Revenue Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Rs. {dashboardData.totalBudget}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <Card className="border-2">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-medium">
                Accepted, Pending and Rejected Offers Monthly
              </CardTitle>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-green-600">Total Accepted: {totalAccepted}</span>
                <span className="text-red-600">Total Rejected: {totalRejected}</span>
                <span className="text-yellow-600">Total Pending: {totalPending}</span>
              </div>
            </div>

            <Select>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue className="text-xs" placeholder="This year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Present Month</SelectItem>
                <SelectItem value="dark">Last 6 months</SelectItem>
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
                acceptedData={Object.values(dashboardData?.acceptedRejectOffersData).map(v => v.accepted)}
                rejectedData={Object.values(dashboardData?.acceptedRejectOffersData).map(v => v.rejected)}
                pendingData={Object.values(dashboardData?.acceptedRejectOffersData).map(v => v.pending)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Pagelayout>
  );
}
