"use client";

import { Card, CardContent } from "@/components/ui/card";
import httpRequest from "@/lib/http";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Empty, Skeleton, Tooltip, Button } from "antd";
import clientCatchError from "@/lib/clientCatchError";
import { useState } from "react";

export interface IReport {
  _id: string;
  reporter: string;
  reportedUser: {
    _id: string;
    fullname: string;
    status: string;
  };
  reason: string;
  description: string;
  status: string;
  createdAt: string;
}

const capitalize = (text: string) =>
  text
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");



const ReportHistory = () => {
  const [loading, setLoading] = useState(false)
  const { data: reports, error, isLoading, mutate } = useSWR<IReport[]>(
    "/report",
    fetcher
  );

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      await httpRequest.delete(`/report/${id}`);

      mutate(
        (prev) => prev?.filter((r) => r._id !== id),
        false
      );
    } 
    catch (error) {
      return clientCatchError(error)
    }
    finally{
      setLoading(false)
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton active />
      </div>
    );
  }

  if (error || !reports || reports.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <h1 className="text-xl font-semibold text-black">
          Report History
        </h1>
        <Empty description="No Reports Found" />
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 max-w-9xl mx-auto">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">
          Report History
        </h1>
        <p className="text-sm text-gray-500">
          View and manage reports you have submitted
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card
            key={report._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-5 flex flex-col gap-4">

              {/* User Section */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-xs text-gray-500">Reported User</p>
                  <h2 className="text-lg font-semibold text-black">
                    {capitalize(report.reportedUser.fullname)}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Account Status: {capitalize(report.reportedUser.status)}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(
                    report.status
                  )}`}
                >
                  {capitalize(report.status)}
                </span>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs text-gray-500">Report Reason</p>
                <p className="text-sm font-medium text-black capitalize">
                  {report.reason.replace("_", " ")}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-gray-500">Detailed Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="text-xs text-gray-500">
                  Created On: {new Date(report.createdAt).toLocaleDateString()}
                </p>

                <Tooltip title="Delete this report permanently">
                  <Button

                    className="bg-red-500! hover:bg-red-600! text-white! px-4 py-2 rounded-lg"
                    onClick={() => handleDelete(report._id)}
                    loading={loading}
                    disabled={loading}  
                  >
                    Delete
                  </Button>
                </Tooltip>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory;