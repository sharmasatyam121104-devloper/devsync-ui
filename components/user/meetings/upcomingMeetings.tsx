"use client";

import React, { useEffect, useState } from "react";
import httpRequest from "@/lib/http";
import clientCatchError from "@/lib/clientCatchError";
import dayjs from "dayjs";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

//  Interface
interface IMeeting {
  _id: string;
  title: string;
  dateTime: string;
  joinEnabled: boolean;
  meetingLink: string | null;
}

const UpcomingMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Meetings
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await httpRequest.get("/meeting");
      setMeetings(res.data.meetings);
    } catch (error) {
      return clientCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="md:p-6">

      {/*  Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
        <p className="text-gray-500 text-sm">
          View and join your scheduled meetings
        </p>
      </div>

      {/*  Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {meetings.map((meeting) => (
          <Card
            key={meeting._id}
            className="rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {meeting.title}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  {dayjs(meeting.dateTime).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>

              <Badge
                className={
                  meeting.joinEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              >
                {meeting.joinEnabled ? "LIVE" : "UPCOMING"}
              </Badge>
            </CardHeader>

            {/* Content */}
            <CardContent>
              <div className="flex flex-col gap-4">

                {/*  Join Button */}
                {meeting.joinEnabled && meeting.meetingLink ? (
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(meeting.meetingLink!, "_blank")
                    }
                  >
                    Join Meeting
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    disabled
                    variant="secondary"
                  >
                    Join available 5 min before
                  </Button>
                )}

              </div>
            </CardContent>
          </Card>
        ))}

      </div>

      {/*  Empty State */}
      {!loading && meetings.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No upcoming meetings
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetings;