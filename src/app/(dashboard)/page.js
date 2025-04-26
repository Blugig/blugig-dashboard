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

  return (
    <Pagelayout title={"Dashboard"}>
      <div className="grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3">
        <Card className="border bg-[#F99BAB66]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.users}</div>
          </CardContent>
        </Card>

        <Card className="border bg-[#9BDFC466]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Form Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.forms}</div>
          </CardContent>
        </Card>

        <Card className="border bg-[#F99BAB4D]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.conversations}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2 mt-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-400">
              Total Revenue
            </CardTitle>

            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue className="text-xs" placeholder="This year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Present Month</SelectItem>
                <SelectItem value="dark">Last 6 months</SelectItem>
              </SelectContent>
            </Select>

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-6">$980,273.00</div>

            <BarGraph
              labels={[
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ]}
              yLabelVisible={false}
            />
          </CardContent>
        </Card>

        <Card className="border-2 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-auto">
            <CardTitle className="text-lg font-medium">
              Total Refunds
            </CardTitle>

            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue className="text-xs" placeholder="This year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Present Month</SelectItem>
                <SelectItem value="dark">Last 6 months</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <BarGraph
              labels={[
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </Pagelayout>
  );
}
