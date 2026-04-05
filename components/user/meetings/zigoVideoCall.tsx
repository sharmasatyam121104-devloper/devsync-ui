"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { getSession } from "@/lib/getSession";

import {
  Users,
  FileText,
  Clock,
  FolderKanban,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import httpRequest from "@/lib/http";

interface Session {
  id: string;
  email: string;
  fullname: string;
  role: "USER" | "ADMIN";
}

interface Participant {
  _id: string;
  fullname: string;
  email: string;
}

interface Meeting {
  _id: string;
  title: string;
  description: string;
  projectId: {
    _id: string;
    projectName: string;
  };
  createdBy: string;
  participants: Participant[];
  dateTime: string;
}

const ZigoVideoCall = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasJoined = useRef(false);

  const params = useParams();
  const meetingId = params.meetingId as string;

  const [me, setMe] = useState<Session | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // ✅ Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSession();
      setMe(data as Session);
    };
    fetchSession();
  }, []);

  // ✅ Fetch meeting
  useEffect(() => {
    if (!meetingId) return;

    const fetchMeeting = async () => {
      try {
        const { data } = await httpRequest.get(`/meeting/${meetingId}`);
        setMeeting(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  // ✅ Zego Init (FINAL FIX)
  useEffect(() => {
    if (!me || !meetingId || !containerRef.current) return;
    if (hasJoined.current) return;

    hasJoined.current = true;

    let zp: ReturnType<typeof ZegoUIKitPrebuilt.create> | null = null;

    const init = () => {
      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        meetingId,
        me.id,
        me.fullname
      );

      zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current!,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showScreenSharingButton: true,
        maxUsers: 10,
        layout: "Sidebar",
        showLayoutButton: true,
      });
    };

    // slight delay for stability
    const timer = setTimeout(init, 100);

    return () => {
      clearTimeout(timer);
      zp?.destroy();
      hasJoined.current = false;
    };
  }, [me, meetingId]);

    return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black flex">

        {/* ✅ Zego Video (main area) */}
            <div
            ref={containerRef}
            style={{ width: "85vw", height: "85vh" }}
            className=" mt-9"
            />

        {/* ✅ Sidebar (responsive) */}
        {showSidebar && (
        <div className="
            w-75 max-md:w-62.5 max-sm:w-full
            bg-black/80 backdrop-blur-md text-white
            p-4 border-l border-white/10
            absolute md:relative right-0 top-0 h-full z-20
        ">

            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-4 md:hidden">
            <p className="font-semibold">Meeting Info</p>
            <button onClick={() => setShowSidebar(false)}>
                <ChevronRight />
            </button>
            </div>

            {/* Description */}
            <div className="mb-4">
            <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
                <FileText size={16} />
                <span>Description</span>
            </div>
            <p className="text-xs text-gray-300">
                {meeting?.description || "No description"}
            </p>
            </div>

            {/* Participants */}
            <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <Users size={16} />
                <span>Participants</span>
            </div>

            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                {meeting?.participants?.map((p) => (
                <div
                    key={p._id}
                    className={`text-xs px-2 py-1 rounded flex justify-between ${
                    p._id === me?.id
                        ? "bg-green-500/20"
                        : "bg-white/10"
                    }`}
                >
                    <span>{p.fullname}</span>

                    {meeting?.createdBy === p._id && (
                    <span className="text-[10px] text-yellow-400">
                        HOST
                    </span>
                    )}
                </div>
                ))}
            </div>

            <p className="text-xs text-gray-400 mt-2">
                Total: {meeting?.participants?.length || 0}
            </p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-xs text-gray-300">
            <Clock size={14} />
            <span>
                {meeting?.dateTime
                ? new Date(meeting.dateTime).toLocaleString()
                : ""}
            </span>
            </div>
        </div>
        )}

        {/* ✅ Top Bar (adjusted) */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-black/60 backdrop-blur-md text-white z-10">

        <div>
            <p className="font-semibold text-sm md:text-lg">
            {meeting?.title || "Meeting"}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-300">
            <FolderKanban size={12} />
            <span>{meeting?.projectId?.projectName}</span>
            </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
            <User size={16} />
            <span className="text-xs md:text-sm">{me?.fullname}</span>

            <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
            >
            {showSidebar ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
        </div>
        </div>
    </div>
    );
};

export default ZigoVideoCall;