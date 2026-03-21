"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import { useState } from "react";
import { Form, Input, Modal, Button as Antbtn, message, Divider, Tooltip, Skeleton, Result } from "antd";
import clientCatchError from "@/lib/clientCatchError";
import httpRequest from "@/lib/http";

interface ProjectIdInterface {
  _id: string,
  projectName: string
}

interface CreatedByInterface {
  _id: string,
  fullname: string,
  email: string
}

interface AssignedToInterface {
  _id: string,
  fullname: string,
  email: string
}

type Issue = {
  _id: string;
  projectId: ProjectIdInterface;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignedTo: AssignedToInterface;
  createdBy: CreatedByInterface;
  createdAt: string;
  comments?: Array<{
    _id: string,
    user: {
      fullname: string,
      email: string;
    };                
    comment: string;             
    timestamp: Date;             
  }>;
};

interface ValueInterface {
  comment : string
}


const MyIssues = () => {
  const {data, isLoading, error} = useSWR('/issue', fetcher)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [issueId, setIssueId] = useState("")
  const [form] = Form.useForm();


  const handleAddComment = async(values : ValueInterface) => {
    try {
      setLoading(true)
      const payload = {
        comment: values.comment
      }
      await httpRequest.post(`/issue/create-commnet/${issueId}`, payload)
      mutate('/issue')
      handleCloseModel()
      message.success("Comment adedd.")

    } 
    catch (error) {
      return clientCatchError(error)
    }
    finally {
      setLoading(false)
    }
  };

  const handleCloseModel = ()=>{
    setOpen(false)
    setIssueId("")
    form.resetFields()
  }

    // Change status
  const handleChangeStatus = async (issueId: string, newStatus: string) => {
    try {
      setLoading(true)
      await httpRequest.patch(`/issue/update-issue/${issueId}`, { status: newStatus })
      mutate('/issue')
      message.success(`Status updated to ${newStatus}`)
    } 
    catch(error){
      clientCatchError(error)
    }
    finally {
      setLoading(false)
    }
  }

  if(isLoading){
    return <Skeleton active/>
  }

  if(error){
     return <Result status="error" title="Failed to fetch issues." subTitle={error.message} />;
  }

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-6">My Issues</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((issue: Issue) => (
          <Card
            key={issue._id}
            className="p-4 shadow-md hover:shadow-lg transition-all"
          >
            <CardContent>
              {/* Show Project Info */}
              <p className="text-xs text-gray-500 mb-1">
                Project ID: <span className="font-semibold">{issue.projectId._id}</span>
              </p>
              <p className="text-sm font-semibold mb-2">{issue.projectId.projectName}</p>

              <h2 className="text-lg font-bold mb-2">{issue.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{issue.description}</p>

              <div className="flex flex-wrap gap-2 mb-2">
                <Tooltip title="Type of issue: Bug / Feature / Task">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    {issue.type}
                  </span>
                </Tooltip>

                <Tooltip title="Current status: Open / In Progress / Closed">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {issue.status}
                  </span>
                </Tooltip>

                <Tooltip title="Priority: High / Medium / Low">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    {issue.priority}
                  </span>
                </Tooltip>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                Assigned To: {issue?.assignedTo?.fullname}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Created By: {issue?.createdBy?.fullname}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Created At: {new Date(issue.createdAt).toLocaleString()}
              </p>

              {/* Add Comment Button */}

              <Button
                onClick={() => { setOpen(true); setIssueId(issue?._id); }}
                className="mb-2 flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                size="sm"
              >
                <Plus className="h-4 w-4" /> Add Comment
              </Button>

              {/* Change Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mb-2 w-full flex items-center justify-between bg-gray-700 text-white hover:bg-gray-600" size="sm">
                    Change Status
                    <ChevronDown className="ml-2 h-4 w-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["In Progress", "Closed"].map(statusOption => (
                    <DropdownMenuItem key={statusOption} onClick={() => handleChangeStatus(issue._id, statusOption)}>
                      {statusOption}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Comments Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center justify-between w-full bg-gray-100 text-black hover:bg-gray-200">
                    Comments ({issue?.comments?.length ?? 0}){" "}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-64 overflow-y-auto">
                  {issue?.comments && issue.comments.length > 0 ? (
                    issue.comments.map((c) => (
                      <DropdownMenuItem
                        key={c._id}
                        className="flex flex-col items-start py-2"
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          User: {c.user?.email ?? "Unknown User"}
                        </span>
                        <span className="text-sm text-gray-600">{c.comment}</span>
                        <span className="text-xs text-gray-400">
                          {c.timestamp
                            ? new Date(c.timestamp).toLocaleString()
                            : "Unknown Time"}
                        </span>
                        <Divider/>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem>No Comments</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
<Modal
  title="Add Comment"
  footer={null}
  open={open}
  onCancel={handleCloseModel}
>
  <Form layout="vertical" name="commentForm" onFinish={handleAddComment} form={form}>
    <Form.Item
      name="comment"
      label="Comment"
      rules={[{ required: true, message: "Please enter a comment!" }]}
    >
      <Input placeholder="Type your comment here..." />
    </Form.Item>

    {/* Custom Add Comment Button */}
    <Form.Item>
      <Antbtn type="primary"  block  htmlType="submit" loading={loading} disabled={loading}>
        Add Comment
      </Antbtn>
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default MyIssues;