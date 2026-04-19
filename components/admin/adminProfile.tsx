"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton, Alert, Button } from "antd"
import fetcher from "@/lib/fetcher"
import { AxiosError } from "axios"
import Link from "next/link"

interface Admin {
  _id: string
  fullname: string
  email: string
  verify: boolean
  createdAt: string
  status: string
}

const AdminProfile = () => {
  const { data, error, isLoading } = useSWR(
    "/admin/admin-profile",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const admin: Admin = data || {}

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
      <div className="p-4">
        <Card className="p-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    )
  }

  // 🎯 MAIN UI
  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-2xl rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <p className="text-xs uppercase text-muted-foreground">
                ADMIN NAME
              </p>
              <h2 className="text-2xl font-semibold capitalize">
                {admin.fullname}
              </h2>
            </div>

            {/* Status */}
            <div className="flex gap-2">
              <span className={`text-xs px-3 py-1 rounded-full uppercase font-medium ${
                admin.status === "ACTIVE"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}>
                {admin.status}
              </span>

              <span className={`text-xs px-3 py-1 rounded-full uppercase font-medium ${
                admin.verify
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {admin.verify ? "VERIFIED" : "NOT VERIFIED"}
              </span>
            </div>

          </div>

          {/* Email */}
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              EMAIL
            </p>
            <p className="text-sm break-all">{admin.email}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <p className="text-xs uppercase text-muted-foreground">
                ACCOUNT ID
              </p>
              <p className="text-sm break-all">{admin._id}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-muted-foreground">
                CREATED AT
              </p>
              <p className="text-sm">
                {new Date(admin.createdAt).toLocaleString()}
              </p>
            </div>

          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default AdminProfile