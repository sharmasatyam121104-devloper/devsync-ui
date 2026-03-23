"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, DatePicker, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import clientCatchError from "@/lib/clientCatchError";
import httpRequest from "@/lib/http";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const { TextArea } = Input;

//  Interfaces
interface IUser {
  _id: string;
  fullname: string;
  email: string;
}

interface IMember {
  userId: IUser;
  role: "LEAD" | "MEMBER";
}

interface IProject {
  _id: string;
  projectName: string;
  description: string;
  members: IMember[];
  status: "ACTIVE" | "COMPLETED";
}

interface IFormValues {
  title: string;
  description?: string;
  dateTime: Dayjs;
  meetingLink: string;
}

const ScheduleMeeting: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const [form] = Form.useForm();

  //  Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await httpRequest.get("/project");
      const activeProjects = res.data.filter(
        (p: IProject) => p.status === "ACTIVE"
      );
      setProjects(activeProjects);
    } catch (error) {
      return clientCatchError(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  //  Open Modal
  const openModal = (project: IProject) => {
    setSelectedProject(project);
    setOpen(true);
  };

  //  Submit Form
  const handleSubmit = async (values: IFormValues) => {
    if (!selectedProject) return;

    try {
      setLoading(true);

      await httpRequest.post("/meeting", {
        projectId: selectedProject._id,
        title: values.title,
        description: values.description,
        dateTime: values.dateTime.toISOString(),
        meetingLink: values.meetingLink,
      });

      message.success("Meeting scheduled successfully");
      setOpen(false);
      form.resetFields();
    } catch (error) {
      return clientCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-6">
      
      {/*  Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Schedule Meeting</h2>
        <p className="text-gray-500 text-sm">
          Organize and schedule meetings for your active projects
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {projects.map((project) => (
          <Card
            key={project._id}
            className="rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {project.projectName}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  {project.members.length} Members
                </p>
              </div>

              <Badge className="bg-green-100 text-green-700">
                ACTIVE
              </Badge>
            </CardHeader>

            {/* Content */}
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              <Button
                type="primary"
                onClick={() => openModal(project)}
                className="w-full rounded-lg"
              >
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        ))}

      </div>

      {/*  Modal */}
      <Modal
        title={
          <span className="font-semibold text-lg">
            Schedule Meeting - {selectedProject?.projectName}
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>

          <Form.Item
            label="Meeting Title"
            name="title"
            rules={[{ required: true, message: "Please enter meeting title" }]}
          >
            <Input placeholder="e.g., Sprint Planning / Daily Standup" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea placeholder="Add optional details about the meeting..." />
          </Form.Item>

          <Form.Item
            label="Date & Time"
            name="dateTime"
            rules={[{ required: true, message: "Select date and time" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              placeholder="Select meeting date & time"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            label="Meeting Link"
            name="meetingLink"
            rules={[
              { required: true, message: "Enter meeting link" },
              { type: "url", message: "Enter a valid URL" },
            ]}
          >
            <Input placeholder="https://meet.google.com/..." />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="rounded-lg"
          >
            Create Meeting
          </Button>
        </Form>
      </Modal>

    </div>
  );
};

export default ScheduleMeeting;