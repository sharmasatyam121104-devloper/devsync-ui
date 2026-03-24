"use client";

import { Card } from "@/components/ui/card";
import clientCatchError from "@/lib/clientCatchError";
import { getSession } from "@/lib/getSession";
import httpRequest from "@/lib/http";
import socket from "@/lib/socketClient";
import { Skeleton } from "antd";
import { SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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


interface Session {
  id: string;
  email: string;
  fullname: string;
  role: "USER" | "ADMIN";
}

interface Project {
  _id: string;
  projectName: string;
  description: string;
  createdBy: string;
  members: [];
  status: string;
  createdAt: string;
}

export default function ChatPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [chatLoading, setChatLoading] = useState(false)
  const [projectData, setProjectData] = useState<Project | null>(null)
  const [message, setMessage] = useState("");
  const [messagedata, setMessageData] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!projectId) return;

  const fetchMessages = async () => {
    setChatLoading(true);
    try {
      const {data} = await httpRequest(`/message/${projectId}`);
      
      setMessageData(data.messages);
      setChatLoading(false);
    } 
    catch (err) {
      return clientCatchError(err)
    }
    finally {
      setChatLoading(false)
    }
  };

  fetchMessages();
  }, [projectId]);



  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [projectId, message, messagedata]);

  // ================= SESSION =================
  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSession();
      setSessionData(data as Session);
    };

    fetchSession();
  }, []);

    useEffect(() => {
    const fetchProject = async () => {
      try {
        const {data} = await httpRequest.get(`/project/${projectId}`)
        setProjectData(data)
      } 
      catch (error) {
        return clientCatchError(error)
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    // join room
    socket.emit("join_group_chat", projectId);

    // receive real-time message
    socket.on("receive_group_message", (newMessage) => {
      const formattedMessage = {
        _id: newMessage._id || `${Date.now()}`, // agar backend id nahi de raha
        text: newMessage.message,
        senderId: {
          _id: newMessage.sender.id,
          fullname: newMessage.sender.fullname
        },
        createdAt: newMessage.createdAt || new Date().toISOString(),
      };
      setMessageData(prev => [...prev, formattedMessage]);
    });

    return () => {
      socket.off("receive_group_message");
    };
  }, [projectId]);

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await httpRequest.post(`/message/${projectId}`, {
        message,
      });

      if(sessionData){
        socket.emit("send_group_message", {
          projectId,
          message,
          sender: {
            id: sessionData.id,
            fullname: sessionData.fullname,
          },
        });
      }
      setMessage("");
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

  if (chatLoading) {
    return (
      <div className="p-6">
        <Skeleton active />
      </div>
    );
  }


  const currentUserId = sessionData?.id;

  return (
    <>
      {
        messagedata && 
        (<Card className="md:h-[88vh] h-[87vh] w-11/12 mx-auto flex flex-col md:px-2 py-4 overflow-hidden md:mt-2">
          
          {/* Header */}
          <div className="flex gap-2 justify-center items-center border py-3 rounded-2xl bg-indigo-600 text-white sticky top-0 z-10 mx-2">
            <p className="font-bold">Group Chat</p>
            <p className="font-medium">{projectData?.projectName}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 px-2 py-3 bg-gray-50 rounded-lg mt-2">
            {messagedata.map((msg) => (
              <div
                key={msg._id || `${msg.senderId?._id}-${msg.createdAt}`}
                className={`flex flex-col max-w-md ${
                  msg.senderId?._id === currentUserId
                    ? "ml-auto items-end bg-indigo-100"
                    : "items-start bg-gray-100"
                } p-3 rounded-xl`}
              >
                <h1 className="font-semibold capitalize">{msg?.senderId?.fullname}</h1>
                <p>{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg?.createdAt).toLocaleTimeString()}
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
        </Card>)
      }
    </>
  );
}