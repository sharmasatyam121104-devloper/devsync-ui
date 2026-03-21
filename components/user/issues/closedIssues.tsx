"use client";

import React from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Skeleton, Result, Divider } from "antd";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface User {
  _id: string;
  fullname: string;
  email: string;
}

interface Project {
  _id: string;
  projectName: string;
}

interface Comment {
  _id: string;
  user: User;
  comment: string;
  timestamp: string;
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
  closedAt?: string;
  comments?: Comment[];
}

const ClosedIssues = () => {
  const { data, isLoading, error } = useSWR<Issue[]>("/issue/close-issue", fetcher);

  if (isLoading) return <Skeleton active />;
  if (error)
    return <Result status="error" title="Failed to fetch closed issues" subTitle={error.message} />;

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-4">Closed Issues</h1>
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((issue) => (
            <div
              key={issue._id}
              className="p-4 border rounded bg-gray-50 text-gray-500 shadow-sm hover:shadow-md transition-all"
            >
              {/* Project Info */}
              <p className="text-xs mb-1">
                Project: <span className="font-semibold">{issue.projectId?.projectName ?? "Unknown"}</span>
              </p>

              <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold line-through">{issue.title}</h2>
                <span className="text-xs">
                  {issue.closedAt ? new Date(issue.closedAt).toLocaleDateString() : "Unknown Close Date"}
                </span>
              </div>

              <p className="text-sm mb-2 line-through">{issue.description}</p>

              {/* Labels */}
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">{issue.type}</span>
                <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded">{issue.status}</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">{issue.priority}</span>
              </div>

              {/* Assigned & Created By */}
              <div className="text-xs mb-2">
                Assigned To: {issue.assignedTo?.fullname ?? "Unknown"} <br />
                Created By: {issue.createdBy?.fullname ?? "Unknown"}
              </div>

              {/* Comments Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center justify-between w-full bg-gray-800 text-white">
                    Comments ({issue.comments?.length ?? 0}){" "}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-64 overflow-y-auto">
                  {issue.comments && issue.comments.length > 0 ? (
                    issue.comments.map((c) => (
                      <DropdownMenuItem key={c._id} className="flex flex-col items-start py-2">
                        <span className="text-sm font-semibold text-gray-700">{c.user?.email ?? "Unknown User"}</span>
                        <span className="text-sm text-gray-600">{c.comment}</span>
                        <span className="text-xs text-gray-400">
                          {c.timestamp ? new Date(c.timestamp).toLocaleString() : "Unknown Time"}
                        </span>
                        <Divider className="my-1" />
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem>No Comments</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No closed issues found.</p>
        )}
      </div>
    </div>
  );
};

export default ClosedIssues;