"use client";

import React from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton, Result, message } from "antd";
import { Download } from "lucide-react";
import httpRequest from "@/lib/http";
import clientCatchError from "@/lib/clientCatchError";

type FileHistoryType = {
  _id: string;
  projectId: string;
  projectName: string;
  fileName: string;
  fileDesciption: string;
  fileSize: number;
  uploaderName: string;
  createdAt: string;
};

const FileHistory = () => {
  const { data, error, isLoading } = useSWR<FileHistoryType[]>("/zip/zip-history", fetcher);

  const handleDownload = async (zipId: string, fileName: string) => {
    try {
      const response = await httpRequest.get(`/zip/download-zip/${zipId}`, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } 
    catch (error) {
      return clientCatchError(error)
    }
  };

  if (isLoading) return <Skeleton active />;
  if (error) return <Result status="error" title="Failed to fetch file history" subTitle={error.message} />;

  return (
    <div className="md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">File History</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((file) => (
          <Card key={file._id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl">
            <CardContent className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-lg font-semibold mb-1 text-gray-900 truncate">{file.fileName}</h2>
                <p className="text-sm text-gray-600 mb-2">{file.fileDesciption}</p>

                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>
                    <span className="font-semibold">Project:</span> {file.projectName}
                  </p>
                  <p>
                    <span className="font-semibold">Uploaded By:</span> {file.uploaderName}
                  </p>
                  <p>
                    <span className="font-semibold">File Size:</span> {(file.fileSize / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <span className="font-semibold">Uploaded At:</span> {new Date(file.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(file._id, file.fileName)}
                className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium w-full"
              >
                <Download size={16} /> Download
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FileHistory;