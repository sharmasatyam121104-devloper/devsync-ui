"use client";

import React from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Skeleton, Result } from "antd";

interface User {
  _id: string;
  fullname: string;
  email: string;
}

interface Project {
  _id: string;
  projectName: string;
}

interface Issue {
  _id: string;
  projectId: Project;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignedTo: User;
  createdBy: User;
  createdAt: string;
  comments?: Array<{
    _id: string;
    user: User;
    comment: string;
    timestamp: string;
  }>;
}

const ActiveIssues = () => {
  const { data, isLoading, error } = useSWR<Issue[]>("/issue/active-issue", fetcher);

  if (isLoading) return <Skeleton active />;
  if (error)
    return (
      <Result
        status="error"
        title="Failed to fetch active issues"
        subTitle={error.message}
      />
    );

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-4">Active Issues</h1>
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((issue) => (
            <div
              key={issue._id}
              className="p-4 border rounded shadow-sm hover:shadow-md transition-all"
            >
              {/* Project Info */}
              <p className="text-xs text-gray-500 mb-1">
                Project: <span className="font-semibold">{issue.projectId?.projectName ?? "Unknown"}</span>
              </p>

              <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold">{issue.title}</h2>
                <span className="text-xs text-gray-500">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{issue.description}</p>

              {/* Labels */}
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                  {issue.type}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {issue.status}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {issue.priority}
                </span>
              </div>

              {/* Assigned & Created By */}
              <div className="text-xs text-gray-500">
                Assigned To: {issue.assignedTo?.fullname ?? "Unknown"} <br />
                Created By: {issue.createdBy?.fullname ?? "Unknown"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No active issues found.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveIssues;