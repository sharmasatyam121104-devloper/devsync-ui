"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination, Skeleton, Empty, Alert } from "antd"
import httpRequest from "@/lib/http"
import { AxiosError } from "axios"

interface User {
  _id: string
  fullname: string
  email: string
  verify: boolean
  status: string
  createdAt: string
}

const fetcher = async (url: string) => {
  const { data } = await httpRequest.get(url)
  return data
}

const ActiveUsers = () => {
  const [page, setPage] = useState(1)
  const limit = 6

  const { data, error, isLoading } = useSWR(
    `/admin/active-users?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  )

  const users: User[] = data?.activeUsers || []
  const total = data?.totalActiveUsers || 0

  // Safe error handling
  let errorMessage = ""
  if (error) {
    const err = error as AxiosError<AxiosError >
    errorMessage =
      err?.response?.data?.message ||
      "Server error"
  }

  if (errorMessage) {
    return (
      <div className="p-4">
        <Alert
          title="ERROR"
          description={errorMessage}
          type="error"
          showIcon
        />
      </div>
    )
  }

  return (
    <div className="lg:p-4">

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (

        /* Empty */
        <div className="py-20 flex justify-center">
          <Empty description="No Active Users Found" />
        </div>

      ) : (

        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user._id} className="rounded-2xl shadow-sm hover:shadow-md transition">
                <CardContent className="p-4 space-y-3">

                  {/* Name + Status */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground tracking-wide">
                        NAME
                      </p>
                      <h2 className="font-semibold text-lg truncate">
                        {user.fullname}
                      </h2>
                    </div>

                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 uppercase font-medium">
                      {user.status}
                    </span>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">
                      EMAIL
                    </p>
                    <p className="text-sm break-all">{user.email}</p>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground tracking-wide">
                        VERIFIED
                      </p>
                      <p className="font-medium">
                        {user.verify ? "YES" : "NO"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase text-muted-foreground tracking-wide">
                        CREATED
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
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
        </>
      )}
    </div>
  )
}

export default ActiveUsers