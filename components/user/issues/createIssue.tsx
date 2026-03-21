'use client'

import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import httpRequest from "@/lib/http";
import clientCatchError from "@/lib/clientCatchError";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  projectName: string;
  members: { userId: { _id: string; fullname: string; email: string } }[];
}

interface CreateIssueFormValues {
  projectId: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  assignedTo: string;
}

const CreateIssue = () => {
  const { data: projects } = useSWR<Project[]>("/project", fetcher);
  const [members, setMembers] = useState<{ _id: string; fullname: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter()

  // When project changes, update members
  const handleProjectChange = (projectId: string) => {
    const project = projects?.find(p => p._id === projectId);
    if (project) {
      setMembers(project.members.map(m => m.userId));
      form.setFieldsValue({ assignedTo: undefined }); // reset assignedTo
    }
  };

  const handleSubmit = async (values: CreateIssueFormValues) => {
    try {
      setLoading(true);
      await httpRequest.post(`/issue/${values.projectId}`, values);
      message.success("Issue created successfully!");
      mutate('/issue')
      form.resetFields();
      router.push('/user/issues')
    } catch (error) {
      clientCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-6">Create Issue</h1>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Project Select */}
        <Form.Item
          name="projectId"
          label="Select Project"
          rules={[{ required: true, message: "Please select a project!" }]}
        >
          <Select
            placeholder="Select a project"
            onChange={handleProjectChange}
            options={projects?.map(p => ({ label: p.projectName, value: p._id }))}
          />
        </Form.Item>

        {/* Assigned To Select */}
        <Form.Item
          name="assignedTo"
          label="Assign To"
          rules={[{ required: true, message: "Please select a user!" }]}
        >
          <Select
            placeholder="Select a user"
            options={members.map(m => ({ label: m.fullname, value: m._id }))}
          />
        </Form.Item>

        {/* Title */}
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title!" }]}
        >
          <Input placeholder="Issue title" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea placeholder="Issue description" rows={4} />
        </Form.Item>

        {/* Type */}
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select type!" }]}
        >
          <Select
            placeholder="Select type"
            options={[
              { label: "Bug", value: "Bug" },
              { label: "Improvement", value: "Improvement" },
              { label: "Task", value: "Task" },
            ]}
          />
        </Form.Item>

        {/* Priority */}
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select priority!" }]}
        >
          <Select
            placeholder="Select priority"
            options={[
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
              { label: "Critical", value: "Critical" },
            ]}
          />
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Issue
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateIssue;
