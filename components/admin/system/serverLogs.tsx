"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { Table, Input, Select, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Card, CardContent } from "@/components/ui/card";
import fetcher from "@/lib/fetcher";

const { Search } = Input;

interface Log {
  _id: string;
  method: string;
  url: string;
  status: number;
  time: number;
  user: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  logs: Log[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ServerLogs() {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const limit = 10;

  const query = `/api-logs?page=${page}&limit=${limit}&search=${search}&method=${method || ""}&status=${status || ""}`;

  const { data, isLoading } = useSWR<ApiResponse>(query, fetcher, {
    refreshInterval: 10000,
  });

  console.log(data);

  // ✅ SAFE DATA (IMPORTANT FIX)
  const logs = useMemo(() => {
    if (!data || !Array.isArray(data.logs)) return [];
    return data.logs;
  }, [data]);

  const columns: ColumnsType<Log> = [
    {
      title: "Method",
      dataIndex: "method",
      render: (method: string) => (
        <Tag color={method === "GET" ? "green" : "blue"}>
          {method}
        </Tag>
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => (
        <Tag color={status >= 400 ? "red" : "green"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Time (ms)",
      dataIndex: "time",
    },
    {
      title: "User",
      dataIndex: "user",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date: string) =>
        new Date(date).toLocaleString(),
    },
  ];

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-xl border">
        <CardContent className="p-6 space-y-5">

          {/* 🔍 Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <Search
              placeholder="Search URL..."
              allowClear
              onSearch={(val) => {
                setPage(1);
                setSearch(val);
              }}
              className="w-60"
            />

            <Select
              placeholder="Method"
              allowClear
              onChange={(val) => {
                setPage(1);
                setMethod(val);
              }}
              className="w-40"
              options={[
                { value: "GET", label: "GET" },
                { value: "POST", label: "POST" },
                { value: "PUT", label: "PUT" },
                { value: "DELETE", label: "DELETE" },
              ]}
            />

            <Select
              placeholder="Status"
              allowClear
              onChange={(val) => {
                setPage(1);
                setStatus(val);
              }}
              className="w-40"
              options={[
                { value: "200", label: "200" },
                { value: "400", label: "400+" },
                { value: "500", label: "500" },
              ]}
            />
          </div>

          {/* 📊 Table */}
          <Table
            columns={columns}
            dataSource={logs} // ✅ FIXED
            loading={isLoading}
            rowKey={(record) => record._id}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.pagination?.total || 0,
              onChange: (p) => setPage(p),
              showSizeChanger: false,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}