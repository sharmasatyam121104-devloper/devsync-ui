'use client'

import React from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";


interface ICpu {
  cores: number;
  loadAverage: number[];
}

interface IDisk {
  total: string;
  free: string;
  used: string;
}

interface IMemory {
  total: string;
  free: string;
  used: string;
}

interface IProcess {
  pid: number;
  nodeVersion: string;
  platform: string;
}

export interface IServerStatus {
  activeUsers: number;
  cpu: ICpu;
  database: string;
  disk: IDisk;
  memory: IMemory;
  message: string;
  process: IProcess;
  responseTime: string;
  server: string;
  success: boolean;
  timestamp: string;
  uptime: string;
}

const COLORS = ["#0088FE", "#00C49F"];

const ServerStatus: React.FC = () => {
  // SWR with refreshInterval 5s = 5000ms
  const { data, isLoading, error } = useSWR<IServerStatus>("/admin/server-status", fetcher, {
    refreshInterval: 5000,
  });

  if (isLoading) return <div className="p-6"><Progress className="w-full" /></div>;
  if (error) return <p className="text-red-500">Failed to fetch server status</p>;
  if (!data) return <p className="text-gray-500">No data available</p>;

  // Helper functions
  const calcPercentage = (used: string, total: string) => {
    const usedNum = parseFloat(used.split(" ")[0]);
    const totalNum = parseFloat(total.split(" ")[0]);
    return Math.round((usedNum / totalNum) * 100);
  };
  const getProgressColor = (percent: number) => {
    if (percent > 80) return "bg-red-500";
    if (percent > 50) return "bg-yellow-400";
    return "bg-green-500";
  };

  // Pie chart data
  const memoryData = [
    { name: "Used", value: parseFloat(data.memory.used.split(" ")[0]) },
    { name: "Free", value: parseFloat(data.memory.free.split(" ")[0]) },
  ];
  const diskData = [
    { name: "Used", value: parseFloat(data.disk.used.split(" ")[0]) },
    { name: "Free", value: parseFloat(data.disk.free.split(" ")[0]) },
  ];

  // CPU load chart data
  const cpuData = [
    { name: "Load 1", load: data.cpu.loadAverage[0] },
    { name: "Load 5", load: data.cpu.loadAverage[1] },
    { name: "Load 15", load: data.cpu.loadAverage[2] },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Server Status Dashboard</h1>

      {/* Server & Database */}
      <div className="flex space-x-4 mb-6">
        <span className={`px-3 py-1 rounded-full text-white font-semibold ${data.server === "UP" ? "bg-green-500" : "bg-red-500"}`}>
          Server: {data.server}
        </span>
        <span className={`px-3 py-1 rounded-full text-white font-semibold ${data.database === "UP" ? "bg-green-500" : "bg-red-500"}`}>
          Database: {data.database}
        </span>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CPU Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">CPU</h2>
          <p>Cores: {data.cpu.cores}</p>

          <ResponsiveContainer width="100%" height={200} minHeight={200}>
            <LineChart
              data={cpuData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" />
              <YAxis domain={[0, Math.max(...data.cpu.loadAverage) * 1.5]} />
              <Tooltip />
              <Line type="monotone" dataKey="load" stroke="#0088FE" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">Memory</h2>
          <p>Total: {data.memory.total}</p>
          <p>Used: {data.memory.used}</p>
          <p>Free: {data.memory.free}</p>
          <div className="mt-2 h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-4 ${getProgressColor(calcPercentage(data.memory.used, data.memory.total))}`} style={{ width: `${calcPercentage(data.memory.used, data.memory.total)}%` }}></div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={memoryData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50} label>
                {memoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Disk Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">Disk</h2>
          <p>Total: {data.disk.total}</p>
          <p>Used: {data.disk.used}</p>
          <p>Free: {data.disk.free}</p>
          <div className="mt-2 h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-4 ${getProgressColor(calcPercentage(data.disk.used, data.disk.total))}`} style={{ width: `${calcPercentage(data.disk.used, data.disk.total)}%` }}></div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={diskData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50} label>
                {diskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Process Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">Process</h2>
          <p>PID: {data.process.pid}</p>
          <p>Node Version: {data.process.nodeVersion}</p>
          <p>Platform: {data.process.platform}</p>
        </div>
      </div>

      {/* Other Info */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 space-y-1">
        <p><strong>Active Users:</strong> {data.activeUsers}</p>
        <p><strong>Response Time:</strong> {data.responseTime}</p>
        <p><strong>Uptime:</strong> {data.uptime}</p>
        <p><strong>Last Updated:</strong> {data.timestamp}</p>
        <p className="text-gray-500 mt-2">{data.message}</p>
      </div>
    </div>
  );
};

export default ServerStatus;