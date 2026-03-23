"use client";

import React from "react";
import useSWR from "swr";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  FolderKanban,
  Bug,
  Activity,
  CalendarDays,
} from "lucide-react";

import httpRequest from "@/lib/http";

// ---------------- TYPES ----------------

interface IActivity {
  message: string;
  time: string;
}

interface IProject {
  _id: string;
  projectName: string;
  status: "ACTIVE" | "COMPLETED";
  createdAt: string;
}

interface IMeeting {
  _id: string;
  title: string;
  dateTime: string;
  joinEnabled: boolean;
}

interface IDashboardData {
  totalProjects: number;
  activeProjects: number;
  assignedIssues: number;
  upcomingMeetings: number;
  recentProjects: IProject[];
  recentMeetings: IMeeting[];
  recentActivities: IActivity[];
}

interface IDashboardResponse {
  success: boolean;
  data: IDashboardData;
}

// ---------------- FETCHER ----------------

const fetcher = async (url: string): Promise<IDashboardResponse> => {
  const res = await httpRequest.get(url);
  return res.data;
};

// ---------------- TIME FORMATTER ----------------

const formatTimeAgo = (date: string): string => {
  const now = Date.now();
  const past = new Date(date).getTime();

  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return "Now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} weeks ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(days / 365);
  return `${years} years ago`;
};

// ---------------- COMPONENT ----------------

const UserDashboard: React.FC = () => {
  const { data, isLoading, error } = useSWR<IDashboardResponse>(
    "/dashboard",
    fetcher
  );

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error || !data) {
    return <div className="p-6">Failed to load dashboard</div>;
  }

  const stats = data.data;

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Overview of your project activities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card>
          <CardContent className="flex justify-between items-center p-5">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <h2 className="text-2xl font-bold">
                {stats.totalProjects}
              </h2>
            </div>
            <FolderKanban className="text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-5">
            <div>
              <p className="text-sm text-gray-500">Assigned Issues</p>
              <h2 className="text-2xl font-bold">
                {stats.assignedIssues}
              </h2>
            </div>
            <Bug className="text-red-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-5">
            <div>
              <p className="text-sm text-gray-500">Active Projects</p>
              <h2 className="text-2xl font-bold">
                {stats.activeProjects}
              </h2>
            </div>
            <Activity className="text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-5">
            <div>
              <p className="text-sm text-gray-500">Upcoming Meetings</p>
              <h2 className="text-2xl font-bold">
                {stats.upcomingMeetings}
              </h2>
            </div>
            <CalendarDays className="text-purple-500" />
          </CardContent>
        </Card>

      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">

            {stats.recentActivities.length === 0 && (
              <p className="text-gray-500">No recent activity</p>
            )}

            {stats.recentActivities.map((activity: IActivity, index: number) => (
              <div key={index} className="flex justify-between">
                <span>{activity.message}</span>
                <Badge variant="secondary">
                  {formatTimeAgo(activity.time)}
                </Badge>
              </div>
            ))}

          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">

            {stats.recentProjects.map((project: IProject) => (
              <div key={project._id} className="flex justify-between items-center">
                <span>{project.projectName}</span>

                <Badge
                  className={
                    project.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            ))}

          </CardContent>
        </Card>

      </div>

      {/* Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">

          {stats.recentMeetings.length === 0 && (
            <p className="text-gray-500">No upcoming meetings</p>
          )}

          {stats.recentMeetings.map((meeting: IMeeting) => (
            <div key={meeting._id} className="flex justify-between items-center">
              <span>{meeting.title}</span>

              <Badge
                className={
                  meeting.joinEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              >
                {meeting.joinEnabled ? "LIVE" : "UPCOMING"}
              </Badge>
            </div>
          ))}

        </CardContent>
      </Card>

    </div>
  );
};

export default UserDashboard;