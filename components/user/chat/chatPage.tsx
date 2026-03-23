"use client";

import { Card } from "@/components/ui/card";
import clientCatchError from "@/lib/clientCatchError";
import fetcher from "@/lib/fetcher";
import { getSession } from "@/lib/getSession";
import httpRequest from "@/lib/http";
import { Result, Skeleton } from "antd";
import { SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR, { mutate } from "swr";

// ================= TYPES =================
interface Sender {
  _id: string;
  fullname: string;
}

interface Message {
  _id: string;
  text: string;
  senderId: Sender;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  messages: Message[];
  hasMore: boolean;
  projectName: string;
}

interface Session {
  id: string;
  email: string;
  fullname: string;
  role: "USER" | "ADMIN";
}

export default function ChatPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // ================= SWR =================
  const { data, isLoading, error } = useSWR<ApiResponse>(
    projectId ? `/message/${projectId}` : null,
    fetcher
  );

  const messages = useMemo(() => data?.messages || [], [data]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SESSION =================
  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSession();
      setSessionData(data as Session);
    };

    fetchSession();
  }, []);

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await httpRequest.post(`/message/${projectId}`, {
        message,
      });

      setMessage("");
      mutate(`/message/${projectId}`);
    } catch (error) {
      clientCatchError(error);
    }
  };

  // ================= ENTER PRESS =================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton active />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Result
        status="error"
        title="Failed to fetch chat data."
        subTitle={error?.message}
      />
    );
  }

  const currentUserId = sessionData?.id;

  return (
    <Card className="md:h-[88vh] h-[87vh] w-11/12 mx-auto flex flex-col md:px-2 py-4 overflow-hidden md:mt-2">
      
      {/* Header */}
      <div className="flex gap-2 justify-center items-center border py-3 rounded-2xl bg-indigo-600 text-white sticky top-0 z-10 mx-2">
        <p className="font-bold">Group Chat</p>
        <p className="font-medium">{data.projectName}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 py-3 bg-gray-50 rounded-lg mt-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col max-w-md ${
              msg.senderId?._id === currentUserId
                ? "ml-auto items-end bg-indigo-100"
                : "items-start bg-gray-100"
            } p-3 rounded-xl`}
          >
            <h1 className="font-semibold capitalize">{msg.senderId.fullname}</h1>
            <p>{msg.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 px-1 flex">
        <input
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-2"
        />

        <button
          disabled={!message.trim()}
          className="bg-green-500 disabled:bg-gray-400 rounded-3xl px-3 text-white"
          onClick={handleSend}
        >
          <SendHorizonal />
        </button>
      </div>
    </Card>
  );
}