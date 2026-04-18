"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal, Input, Button as AntBtn, message, Empty } from "antd";
import httpRequest from "@/lib/http";
import clientCatchError from "@/lib/clientCatchError";
import { useRouter } from "next/navigation";

// Types
export interface IUser {
  _id: string;
  fullname: string;
  email: string;
}

export interface IMember {
  userId: IUser;
  role: "LEAD" | "MEMBER";
}

export interface IProject {
  _id: string;
  projectName: string;
  description: string;
  createdBy: string;
  members: IMember[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export type ReportReason =
  | "spam"
  | "abuse"
  | "harassment"
  | "hate_speech"
  | "fake_account"
  | "scam"
  | "nudity"
  | "violence"
  | "misinformation"
  | "impersonation"
  | "bullying"
  | "threat"
  | "copyright_violation"
  | "other";

const CreateReport = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [reasonType, setReasonType] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await httpRequest.get("/project");
        const activeProjects = data.filter(
          (p: IProject) => p.status === "ACTIVE"
        );
        setProjects(activeProjects);
      } catch (err) {
          if (err) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <h1 className="text-xl font-semibold text-black">
          Create Report
        </h1>
        <Empty description="Error in fetch Projects" />
      </div>
    );
  }
      }
    };

    fetchProjects();
  }, []);

  const handleSelectMember = (projectId: string, userId: string) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [projectId]: userId,
    }));
  };

  const openModal = (user: IUser, projectId: string) => {
    setSelectedUser(user);
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
  };

  const handleCreatereport = async () => {
    try {
      if (!reasonType) return message.warning("Please select a reason");
      if (!description.trim()) return message.warning("Please enter description");

      const payload = {
        projectId: selectedProjectId,
        reportedUserId: selectedUser?._id,
        reason: reasonType,
        description,
      };

      setLoading(true);
      const { data } = await httpRequest.post("/report", payload);

      setIsModalOpen(false);
      setReasonType("");
      setDescription("");
      setSelectedProjectId("");

      message.success(data.message);
      router.replace('/user/reports/report-history')
    
    } catch (error) {
      return clientCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" sm:p-6 max-w-9xl sm:mx-auto">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Create Report
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a project and report a member if needed
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col gap-4">

              {/* Project Info */}
              <div>
                <p className="text-xs text-gray-500">Project</p>
                <h2 className="text-lg font-semibold text-black">
                  {project.projectName}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Select + Button */}
              <div className="flex flex-col sm:flex-row gap-3">

                <Select
                  onValueChange={(val) =>
                    handleSelectMember(project._id, val)
                  }
                >
                  <SelectTrigger className="w-full sm:w-65 bg-white border border-gray-300 text-black">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    {project.members.map((m) => (
                      <SelectItem
                        key={m.userId._id}
                        value={m.userId._id}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {m.userId.fullname}
                          </span>
                          <span className="text-xs text-gray-500">
                            {m.userId.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="bg-black text-white w-full sm:w-auto"
                  onClick={() => {
                    const userId = selectedMembers[project._id];
                    const user = project.members.find(
                      (m) => m.userId._id === userId
                    );

                    if (!user) return alert("Select member first");

                    openModal(user.userId, project._id);
                  }}
                >
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        title="Report User"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        {selectedUser && (
          <div className="mb-4">
            <p className="text-sm"><strong>Name:</strong> {selectedUser.fullname}</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedUser.email}</p>
          </div>
        )}

        {/* Reason */}
        <div className="mb-3">
          <label className="text-sm font-medium">Reason</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={reasonType}
            onChange={(e) => setReasonType(e.target.value as ReportReason)}
          >
            <option value="">Select reason</option>
            <option value="spam">Spam</option>
            <option value="abuse">Abuse</option>
            <option value="harassment">Harassment</option>
            <option value="hate_speech">Hate Speech</option>
            <option value="fake_account">Fake Account</option>
            <option value="scam">Scam</option>
            <option value="nudity">Nudity</option>
            <option value="violence">Violence</option>
            <option value="misinformation">Misinformation</option>
            <option value="impersonation">Impersonation</option>
            <option value="bullying">Bullying</option>
            <option value="threat">Threat</option>
            <option value="copyright_violation">Copyright Violation</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input.TextArea
            rows={4}
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <AntBtn
            type="primary"
            className="mt-4 w-full"
            onClick={handleCreatereport}
            loading={loading}
          >
            Submit Report
          </AntBtn>
        </div>
      </Modal>
    </div>
  );
};

export default CreateReport;