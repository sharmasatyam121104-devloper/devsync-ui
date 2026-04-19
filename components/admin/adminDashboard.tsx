/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton, Alert, Empty, Tooltip } from "antd"
import fetcher from "@/lib/fetcher"

import {
  Users,
  UserCheck,
  UserX,
  FolderKanban,
  Bug,
  Flag,
} from "lucide-react"

const AdminDashboard = () => {
  const { data, error, isLoading } = useSWR("/admin/dashboard", fetcher, {
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

  //  LOADING
  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
    )
  }

  // EMPTY
  if (!data) {
    return (
      <div className="py-20 flex justify-center">
        <Empty description="NO DATA FOUND" />
      </div>
    )
  }

  const { stats, recent } = data

  const statCards = [
    {
      label: "TOTAL USERS",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "ACTIVE USERS",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      label: "BLOCKED USERS",
      value: stats.blockedUsers,
      icon: UserX,
      color: "text-red-600",
    },
    {
      label: "PROJECTS",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-purple-600",
    },
    {
      label: "ISSUES",
      value: stats.totalIssues,
      icon: Bug,
      color: "text-orange-600",
    },
    {
      label: "REPORTS",
      value: stats.totalReports,
      icon: Flag,
      color: "text-pink-600",
    },
  ]

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "open":
        return "bg-green-100 text-green-600"
      case "closed":
      case "completed":
        return "bg-gray-100 text-gray-600"
      case "in progress":
        return "bg-yellow-100 text-yellow-600"
      case "approved":
        return "bg-green-100 text-green-600"
      case "rejected":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="p-3 sm:p-4 space-y-8">

      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">ADMIN DASHBOARD</h1>
        <p className="text-sm text-muted-foreground">
          Overview of system performance and activity
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <Card key={i} className="hover:shadow-md transition">
              <CardContent className="p-4 flex justify-between items-center">

                <div>
                  <p className="text-xs uppercase text-muted-foreground tracking-wide">
                    {card.label}
                  </p>
                  <h2 className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </h2>
                </div>

                <Tooltip title={card.label}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </Tooltip>

              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 📌 RECENT DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* USERS */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              RECENT USERS
            </h2>

            {recent.users.map((u: any) => (
              <div key={u._id} className="flex justify-between items-center border-b pb-2">

                <div className="min-w-0">
                  <p className="font-medium truncate capitalize">{u.fullname}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {u.email}
                  </p>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(u.status)}`}>
                  {u.status}
                </span>

              </div>
            ))}
          </CardContent>
        </Card>

        {/* PROJECTS */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              RECENT PROJECTS
            </h2>

            {recent.projects.map((p: any) => (
              <div key={p._id} className="flex justify-between items-center border-b pb-2">

                <div>
                  <p className="font-medium truncate">{p.projectName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(p.status)}`}>
                  {p.status}
                </span>

              </div>
            ))}
          </CardContent>
        </Card>

        {/* ISSUES */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              RECENT ISSUES
            </h2>

            {recent.issues.map((i: any) => (
              <div key={i._id} className="flex justify-between items-center border-b pb-2">

                <div>
                  <p className="font-medium truncate">{i.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {i.priority}
                  </p>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(i.status)}`}>
                  {i.status}
                </span>

              </div>
            ))}
          </CardContent>
        </Card>

        {/* REPORTS */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              RECENT REPORTS
            </h2>

            {recent.reports.map((r: any) => (
              <div key={r._id} className="flex justify-between items-center border-b pb-2">

                <div>
                  <p className="font-medium capitalize">{r.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(r.status)}`}>
                  {r.status}
                </span>

              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default AdminDashboard