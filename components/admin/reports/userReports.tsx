"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination, Skeleton, Empty, Alert, Modal, Button, message } from "antd"
import httpRequest from "@/lib/http"
import fetcher from "@/lib/fetcher"
import clientCatchError from "@/lib/clientCatchError"
import Link from "next/link"

interface Report {
  _id: string
  reporter: {
    fullname: string
    status: string
  }
  reportedUser: {
    fullname: string
    status: string
  }
  reason: string
  description: string
  status: string
  createdAt: string
}



const UserReports = () => {
  const [page, setPage] = useState(1)
  const limit = 5
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data, error, isLoading, mutate } = useSWR(
    `/admin/reports?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  )

  const reports: Report[] = data?.reports || []
  const total = data?.total || 0

  //  ERROR
  if (error) {
    return (
      <>
        <Link href={"/admin"} className="my-8 py-8 ml-270 h-20 w-60  ">
          <Button >Go To Dashboard</Button>
        </Link>
        <Alert
          title="Error"
          description={error.message || "Something went wrong"}
          type="error"
          showIcon
          className="mt-10!"
        />
      </>
    );
  }

  // ⏳ LOADING
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        ))}
      </div>
    )
  }

  // 📭 EMPTY
  if (!reports.length) {
    return (
      <div className="p-4 py-20 flex justify-center">
        <Empty description="NO REPORTS FOUND" />
      </div>
    )
  }

  // ✅ ACTION HANDLER
  const handleStatusChange = (reportId: string, status: "approved" | "rejected") => {
    Modal.confirm({
      title: "ARE YOU SURE?",
      content: `Do you want to mark this report as ${status.toUpperCase()}?`,
      okText: "YES",
      cancelText: "NO",
      onOk: async () => {
        try {
          setActionLoading(reportId)

          const {data} = await httpRequest.put("/report", {
            reportId,
            status,
          })

          message.success(data.message)
          mutate()

        } catch (error) {
          return clientCatchError(error)
        } finally {
          setActionLoading(null)
        }
      },
    })
  }

  const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-600"
    case "rejected":
      return "bg-red-100 text-red-600"
    case "pending":
      return "bg-yellow-100 text-yellow-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

  //  MAIN UI
  return (
    <div className="p-4 space-y-4">

      {/* Cards */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report._id} className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-5 space-y-4">

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">REPORTER</p>
                  <p className="font-medium capitalize">{report.reporter.fullname}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full uppercase ${getStatusStyle(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>

              {/* Reported User */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">REPORTED USER</p>
                <p className="font-medium capitalize">{report.reportedUser.fullname}</p>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">REASON</p>
                <p className="capitalize">{report.reason}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">DESCRIPTION</p>
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

                <p className="text-xs text-muted-foreground">
                  {new Date(report.createdAt).toLocaleString()}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="small"
                    type="primary"
                    loading={actionLoading === report._id}
                    onClick={() => handleStatusChange(report._id, "approved")}
                  >
                    APPROVE
                  </Button>

                  <Button
                    size="small"
                    danger
                    loading={actionLoading === report._id}
                    onClick={() => handleStatusChange(report._id, "rejected")}
                  >
                    REJECT
                  </Button>
                </div>

              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        
        <p className="text-sm text-muted-foreground">
          TOTAL REPORTS: <span className="font-semibold text-black">{total}</span>
        </p>

        <p className="text-sm text-muted-foreground">
          Showing page {page} of {Math.ceil(total / limit) || 1}
        </p>

        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
          size="small"
        />
      </div>

    </div>
  )
}

export default UserReports