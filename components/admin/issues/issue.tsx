"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination, Skeleton, Empty, Alert, Tooltip, Button } from "antd"
import fetcher from "@/lib/fetcher"
import Link from "next/link"

interface comments {
    user: string;                
    comment: string;             
    timestamp: Date;             
}

interface Issue {
  _id: string
  title: string
  description: string
  type: string
  status: string
  priority: string
  createdAt: string
  projectId: {
    projectName: string
  }
  comments: comments[]
}

const Issue = () => {
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, error, isLoading } = useSWR(
    `/admin/issues?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  )

  const issues: Issue[] = data?.Issues || []
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

  // LOADING
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

  //  EMPTY
  if (!issues.length) {
    return (
      <div className="p-4 py-20 flex justify-center">
        <Empty description="NO ISSUES FOUND" />
      </div>
    )
  }

  //  STATUS COLOR
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-600"
      case "in progress":
        return "bg-yellow-100 text-yellow-600"
      case "closed":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  //  PRIORITY COLOR
  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-600"
      case "medium":
        return "bg-orange-100 text-orange-600"
      case "low":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="p-4 space-y-6">

      {/*  HEADING */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Issues</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all issues across projects
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          TOTAL ISSUES: <span className="font-semibold text-black">{total}</span>
        </p>
      </div>

      {/*  CARDS */}
      <div className="space-y-4">
        {issues.map((issue) => (
          <Card key={issue._id} className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-5 space-y-4">

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">TITLE</p>
                  <h2 className="text-lg font-semibold capitalize">
                    {issue.title}
                  </h2>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full uppercase ${getStatusStyle(issue.status)}`}>
                  {issue.status}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">DESCRIPTION</p>
                <p className="text-sm text-muted-foreground">
                  {issue.description}
                </p>
              </div>

              {/* Project */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">PROJECT</p>
                <p className="font-medium capitalize">
                  {issue.projectId?.projectName}
                </p>
              </div>

              {/* Type + Priority */}
              <div className="flex gap-4 flex-wrap">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">TYPE</p>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {issue.type}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">PRIORITY</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityStyle(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground">

                <span>
                  CREATED: {new Date(issue.createdAt).toLocaleDateString()}
                </span>

                <Tooltip title="Total comments on this issue">
                  <span>
                    COMMENTS: {issue.comments?.length || 0}
                  </span>
                </Tooltip>

              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/*  PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">

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

export default Issue