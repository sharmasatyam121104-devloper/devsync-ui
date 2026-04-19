"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination, Skeleton, Empty, Alert } from "antd"
import fetcher from "@/lib/fetcher"

interface User {
  _id: string
  fullname: string
  email: string
  verify: boolean
  status: string
  createdAt: string
}

const Users = () => {
  const [page, setPage] = useState(1)
  const limit = 5

  const { data, error, isLoading } = useSWR(
    `/admin/users?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false, //
      revalidateOnReconnect: false,
      keepPreviousData: true, // 
    }
  )

  const users: User[] = data?.users || []
  const total = data?.totalUser || 0

  console.log(error);

  if(error){
    return(
      <div>
         {/* ❌ Error */}
          {error && (
            <div className="mb-4">
              <Alert
                title="Error"
                description={error.response?.data?.message || error.response?.data?.error || "Server error"}
                type="error"
                showIcon
              />
            </div>
          )}
      </div>
    )
  }


  return (
    <div className="lg:p-4">
      <Card className="shadow-sm sm:shadow-md rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            All Users
          </CardTitle>
        </CardHeader>

        <CardContent>


          <div className="w-full overflow-x-auto rounded-xl border">
            <div className="min-w-175">

              {/* ⏳ Loading */}
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton active key={i} paragraph={{ rows: 1 }} />
                  ))}
                </div>
              ) : users.length === 0 ? (

                /* 📭 Empty */
                <div className="py-10 flex justify-center">
                  <Empty description="No users found" />
                </div>

              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {user.fullname}
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground break-all">
                          {user.email}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === "ACTIVE"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          {user.verify ? "Yes" : "No"}
                        </TableCell>

                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Pagination */}
          {!isLoading && users.length > 0 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Users