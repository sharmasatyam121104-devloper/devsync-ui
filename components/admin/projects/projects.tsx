"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination, Skeleton, Empty, Alert, Tooltip, Button } from "antd"
import fetcher from "@/lib/fetcher"
import Link from "next/link"

interface Project {
  _id: string
  projectName: string
  description: string
  createdBy: {
    fullname: string
    status: string
  }
  members: {
    userId: {
      fullname: string
      status: string
    }
    role: string
  }[]
  status: string
  createdAt: string
}

const Projects = () => {
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, error, isLoading } = useSWR(
    `/admin/projects?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  )

  const projects: Project[] = data?.Projects || []
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

  //  LOADING
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

  // EMPTY
  if (!projects.length) {
    return (
      <div className="p-4 py-20 flex justify-center">
        <Empty description="NO PROJECTS FOUND" />
      </div>
    )
  }

  //  STATUS COLOR
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-600"
      case "COMPLETED":
        return "bg-blue-100 text-blue-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="p-4 space-y-6">

      {/*  PAGE HEADING */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all projects
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          TOTAL PROJECTS: <span className="font-semibold text-black">{total}</span>
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project._id} className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-5 space-y-4">

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    PROJECT NAME
                  </p>
                  <h2 className="text-lg font-semibold capitalize">
                    {project.projectName}
                  </h2>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full uppercase ${getStatusStyle(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  DESCRIPTION
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>

              {/* Created By */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  CREATED BY
                </p>
                <p className="font-medium capitalize">
                  {project.createdBy.fullname}
                </p>
              </div>

              {/* Members */}
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  MEMBERS ({project.members.length})
                </p>

                <div className="flex flex-wrap gap-2 mt-1">
                  {project.members.map((m, i) => (
                    <Tooltip key={i} title={`Role: ${m.role}`}>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                        {m.userId.fullname}
                      </span>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  CREATED: {new Date(project.createdAt).toLocaleDateString()}
                </span>

                <span>
                  MEMBERS: {project.members.length}
                </span>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}
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

export default Projects