/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import useSWR from "swr"
import fetcher from "@/lib/fetcher"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton, Alert, Empty } from "antd"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const Analytics = () => {
  const { data, error, isLoading } = useSWR("/admin/analytics", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  // ERROR
  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="ERROR"
          description={error.message || "Something went wrong"}
          type="error"
          showIcon
        />
      </div>
    )
  }

  // LOADING
  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ))}
      </div>
    )
  }

  // EMPTY
  if (!data) {
    return (
      <div className="py-20 flex justify-center">
        <Empty description="NO ANALYTICS DATA FOUND" />
      </div>
    )
  }

  const { userGrowth, issueStats, reportStats, projectStats } = data

  const formatPieData = (arr: any[]) =>
    arr.map((item) => ({
      name: item._id,
      value: item.count,
    }))

  const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4"]

  return (
    <div className="p-3 sm:p-4 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">ANALYTICS</h1>
        <p className="text-sm text-muted-foreground">
          Insights and trends of platform data
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* User Growth */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
              USER GROWTH
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Status */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
              ISSUE STATUS
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatPieData(issueStats)}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {formatPieData(issueStats).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Report Status */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
              REPORT STATUS
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatPieData(reportStats)}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {formatPieData(reportStats).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
              PROJECT STATUS
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatPieData(projectStats)}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {formatPieData(projectStats).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Analytics