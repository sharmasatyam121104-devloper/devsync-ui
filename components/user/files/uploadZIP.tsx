"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton, Result, message, Input, Progress, Button, Alert } from "antd";
import { CloudUploadOutlined, FileZipOutlined, LockOutlined } from "@ant-design/icons";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import httpRequest from "@/lib/http";
import clientCatchError from "@/lib/clientCatchError";

const UploadZIP = () => {
  // eslint-disable-next-line
  const { data: projects, error, isLoading } = useSWR<any[]>("/project", fetcher);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentProject = useMemo(() => projects?.find(p => p._id === selectedProjectId), [selectedProjectId, projects]);
  const isCompleted = currentProject?.status === "COMPLTED";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.endsWith(".zip")) return message.error("Sirf .zip files allow hain!");
    if (selected.size > 13 * 1024 * 1024) return message.error("File size 13MB se kam honi chahiye!");

    setFile(selected);
  };

  const handleUpload = async () => {
    if (isCompleted) return message.warning("Ye project complete ho chuka hai, upload band hai.");
    if (!selectedProjectId || !file) return message.error("Project aur File dono select karein!");

    try {
      setUploading(true);
      setProgress(10);

      const { data } = await httpRequest.post(`/zip/${selectedProjectId}`);
      const uploadUrl = data.uploadUrl;
      setProgress(10);

      await httpRequest.put(uploadUrl, file, {
        headers: { "Content-Type": "application/zip" },
        // eslint-disable-next-line
        onUploadProgress: (e: any) => {
          const percent = Math.round((e.loaded / e.total) * 10 + 10);
          setProgress(percent);
        },
      });

      const pathStart = uploadUrl.indexOf("uploads/");
      const filePath = pathStart !== -1 ? uploadUrl.substring(pathStart) : uploadUrl;

      const payload = {
        key: filePath,
        fileName: file.name,
        fileDesciption: description,
        fileSize: file.size,
      };

      await httpRequest.post(`/zip/save-zip/${selectedProjectId}`, payload);
      setProgress(100);
      message.success("Build Successfully Deployed!");

      setTimeout(() => {
        setFile(null);
        setDescription("");
        setProgress(0);
      }, 2000);

    } catch (err) {
      clientCatchError(err);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div className="p-20"><Skeleton active /></div>;
  if (error) return <Result status="error" title="Data load nahi ho paya" />;

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload ZIP Archive</h1>

      <Card className="rounded-xl bg-white border border-gray-200">
        <CardContent className="space-y-6">

          {/* Project Select */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-600">Select Project</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
            >
              <option value="">-- Choose Project --</option>
              {projects?.map(p => (
                <option key={p._id} value={p._id}>{p.projectName} ({p.status})</option>
              ))}
            </select>
          </div>

          {isCompleted && (
            <Alert
              message="Project Completed"
              description="Is project mein naye zips allow nahi hain."
              type="warning"
              showIcon
              icon={<LockOutlined />}
            />
          )}

          {/* Upload Area */}
          <div className={`relative border-2 border-dashed rounded-lg p-12 text-center ${isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || isCompleted}
            />
            {file ? (
              <div className="space-y-2">
                <FileZipOutlined className="text-4xl text-indigo-500 mx-auto" />
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-sm text-green-600">Ready for Deployment</p>
              </div>
            ) : (
              <div className="space-y-2">
                <CloudUploadOutlined className="text-5xl text-gray-400 mx-auto" />
                <p className="text-gray-600 font-medium">Click or Drag Archive</p>
                <p className="text-sm text-gray-400">Only .ZIP (Max 13MB)</p>
              </div>
            )}
          </div>

          {/* Description */}
          <Input.TextArea
            placeholder="Update Notes"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={uploading || isCompleted}
          />

          {/* Progress */}
          {progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-700">
                <span>{progress < 100 ? "Uploading..." : "Upload Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress
                percent={progress}
                showInfo={false}
                strokeColor={progress === 100 ? "#10b981" : "#4f46e5"}
                strokeWidth={10}
                className="rounded-full"
              />
            </div>
          )}

          {/* Upload Button */}
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!file || !selectedProjectId || uploading || isCompleted}
            loading={uploading}
            className="w-full py-3 rounded-lg font-semibold text-sm"
          >
            {uploading ? "Uploading..." : "Start Deployment"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
};

export default UploadZIP;