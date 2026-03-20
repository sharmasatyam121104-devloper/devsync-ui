'use client'
import React, { useState } from 'react';
import fetcher from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import moment from "moment";
import { 
  CalendarDays, 
  ChevronDown, 
  RefreshCcw, 
  User, 
  UserPlus, 
  Users, 
  Briefcase, 
  Loader2,
  X,
  Mail
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// UI Components
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input"
import {  message, Tooltip } from 'antd';
import clientCatchError from '@/lib/clientCatchError';
import httpRequest from '@/lib/http';

// --- Interfaces for TypeScript ---
interface UserData {
  _id: string;
  fullname: string;
  email: string;
}

interface Member {
  userId: UserData;
  role: "LEAD" | "MEMBER";
}

interface Project {
  _id: string;
  projectName: string;
  description: string;
  createdBy: string;
  members: Member[];
  status: string;
  createdAt: string;
}

const AllProjects = () => {
  const { data, isLoading, error } = useSWR<Project[]>("/project", fetcher);
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState("")

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault()

      if (!isValidEmail(input)) return

      if (emails.includes(input)) return

      setEmails([...emails, input])
      setInput("")
    }
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }


  const handleChageStatus = async(projectId: string)=>{
    try {
      setLoading(true)
      await httpRequest.get(`/project/${projectId}/change-status`)
      mutate('/project')
      message.success('Project status change successfully.')
      
    } catch (error) {
      return clientCatchError(error)
    }
    finally{
      setLoading(false)
    }
  }

  const handleAddMember = async(projectId: string)=>{
    try {
      setLoading(true)
      const payload = {
        emails
      }
      await httpRequest.post(`/project/${projectId}/add-members`, payload)
      setEmails([])
      setInput("")
      setOpen(false)
      setProjectId("")
      mutate('/project')
      message.success('Project status change successfully.')
      
    } catch (error) {
      return clientCatchError(error)
    }
    finally{
      setLoading(false)
    }
  }

  if (isLoading) return <div className="p-10 text-center font-medium">Loading Projects...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error fetching projects</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-6 bg-slate-50/30 min-h-screen">
      {data?.map((item) => {
        const creator = item.members.find((m) => m.role === "LEAD");
        
        return (
          <Card key={item._id} className="group border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[1.5rem] bg-white ring-1 ring-slate-200/60 overflow-hidden h-fit">
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Briefcase size={20} />
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight text-slate-800 capitalize">
                    {item.projectName}
                  </CardTitle>
                </div>
                <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase border-none ${
                  item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Description */}
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 capitalize">
                {item.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Created By */}
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <User size={16} className="text-indigo-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Owner</span>
                    <span className="text-sm font-semibold truncate max-w-30 capitalize">
                      {creator?.userId?.fullname || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <CalendarDays size={16} className="text-indigo-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Created On</span>
                    <span className="text-sm font-semibold">
                      {moment(item.createdAt).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Members Dropdown */}
              <div className="pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full px-4">
                      <Users size={16} />
                      <span className="text-xs font-bold tracking-wide uppercase">
                        {item.members.length} Members Joined
                      </span>
                      <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl shadow-xl border-slate-100">
                    <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-widest">Team List</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.members.map((member, idx) => (
                      <DropdownMenuItem key={idx} className="flex flex-col items-start gap-0.5 p-3 focus:bg-indigo-50">
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-bold text-sm text-slate-700 capitalize">{member.userId.fullname}</span>
                          <Badge variant="outline" className="text-[9px] h-4 px-1 leading-none uppercase ml-auto">
                            {member.role}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate w-full">{member.userId.email}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/50 gap-3 border-t border-slate-100 p-4">
              <Button 
                onClick={() => {
                  setProjectId(item._id) 
                  setOpen(true)
                }}
                className="flex-1 bg-slate-900 hover:bg-black 
                text-white rounded-xl h-10 gap-2 font-bold 
                text-xs uppercase tracking-wider 
                transition-all active:scale-95 shadow-md"
              >
                <UserPlus size={16} />
                Invite
              </Button>
              <Tooltip title="Clicking this will mark the project as COMPLETED. After that, you won't be able to make any changes.">  
                <Button 
                  disabled={loading}
                  variant="outline" 
                  className="flex-1 rounded-xl h-10 gap-2 font-bold 
                    text-xs uppercase tracking-wider border-slate-200 
                    hover:bg-white hover:border-indigo-500 hover:text-indigo-600 
                    transition-all active:scale-95"
                    onClick={()=>handleChageStatus(item._id)}
                  >
                  <RefreshCcw size={16} />
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Processing..." : " Status"}
                </Button>
              </Tooltip>
            </CardFooter>

          </Card>
        );
      })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">

          {/* Header */}
          <DialogHeader>
            <DialogTitle>Add Members</DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-3">

            {/* Input with icon */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary">
              <Mail size={16} className="text-gray-500" />
              <Input
                placeholder="Enter emails and press Enter"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-0 focus-visible:ring-0 shadow-none"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {emails.map((email, index) => (
                <Badge
                  key={index}
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {email}
                  <Button>
                    <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => {removeEmail(email)}}
                  />
                  </Button>
                </Badge>
              ))}
            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="mt-4 flex gap-2">

            <Button
              disabled={loading}
              onClick={() => {
                handleAddMember(projectId)
              }}
            >
            <RefreshCcw size={16} />
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : " Add Members"}
              
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProjects;