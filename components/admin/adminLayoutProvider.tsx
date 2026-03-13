"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { Layout, Menu, Tooltip } from "antd"
import {
  DashboardOutlined,
  FlagOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons"

import {
  CircleUserRound,
  ClipboardList,
  Cpu,
  UserCircle,
  UserRoundCheck,
  UserRoundPen,
  UserRoundSearch,
  UserRoundX,
  Users,
} from "lucide-react"

import Logo from "../logo"
import { Button } from "../ui/button"
import { usePathname } from "next/navigation"

const { Sider, Content, Header } = Layout

const PRIMARY_BG = "#f3f4f6"
const TEXT_COLOR = "#111827"

const menuItems = [
  {
    key: "/admin",
    icon: <DashboardOutlined style={{ color: TEXT_COLOR }} />,
    label: (
      <Tooltip title="View admin dashboard">
        <Link href="/admin">Dashboard</Link>
      </Tooltip>
    ),
    title: "",
  },

  {
    key: "users",
    icon: <UserRoundSearch style={{ color: TEXT_COLOR }} size={16} />,
    label: "Users",
    children: [
      {
        key: "/admin/users",
        icon: <Users style={{ color: TEXT_COLOR }} size={16} />,
        label: <Link href="/admin/users">All Users</Link>,
      },
      {
        key: "/admin/users/active",
        icon: <UserRoundCheck style={{ color: TEXT_COLOR }} size={16} />,
        label: <Link href="/admin/users/active">Active Users</Link>,
      },
      {
        key: "/admin/users/blocked",
        icon: <UserRoundX style={{ color: TEXT_COLOR }} size={16} />,
        label: <Link href="/admin/users/blocked">Blocked Users</Link>,
      },
    ],
  },

  {
    key: "reports",
    icon: <FlagOutlined style={{ color: TEXT_COLOR }} />,
    label: "Reports",
    children: [
      {
        key: "/admin/reports/users",
        label: <Link href="/admin/reports/users">User Reports</Link>,
      },
      {
        key: "/admin/reports/content",
        label: <Link href="/admin/reports/content">Content Reports</Link>,
      },
    ],
  },

  {
    key: "/admin/analytics",
    icon: <BarChartOutlined />,
    label: <Link href="/admin/analytics">Analytics</Link>,
    title: "",
  },

  {
    key: "system-monitor",
    icon: <DatabaseOutlined style={{ color: TEXT_COLOR }} />,
    label: "System Monitor",
    children: [
      {
        key: "/admin/system/status",
        icon: <Cpu style={{ color: TEXT_COLOR }} size={16} />,
        label: <Link href="/admin/system/status">Server Status</Link>,
      },
      {
        key: "/admin/system/logs",
        icon: <ClipboardList style={{ color: TEXT_COLOR }} size={16} />,
        label: <Link href="/admin/system/logs">Logs</Link>,
      },
    ],
  },
  {
    key: "profile",
    icon: <CircleUserRound style={{ color: TEXT_COLOR }} size={16} />,
    label: "Profile",
    children: [
      {
        key: "/admin/profile",
        icon: <UserRoundPen style={{ color: TEXT_COLOR }} size={16} />,
        label: <Link href="/admin/profile">My Profile</Link>,
      },
      {
        key: "logout",
        icon: <LogoutOutlined style={{ color: TEXT_COLOR }} />,
        label: (<Tooltip title={"Click here for logout."}><Button variant={"link"} onClick={()=>alert("logout")} className="cursor-pointer">Logout</Button></Tooltip>),
      },
    ],
  },
]

const AdminLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <Layout style={{ minHeight: "90vh", background: PRIMARY_BG }}>
      
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: PRIMARY_BG }}
        breakpoint="lg"
        trigger={null} 
      >
          {/* Collapse button */}
          <div className="flex justify-end mt-2 px-5">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md hover:bg-gray-200"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>
        <Menu
          theme="light"
          mode="inline"
          items={menuItems}
          selectedKeys={[pathname]}
          style={{
            background: PRIMARY_BG,
            color: TEXT_COLOR,
            paddingTop: 20,
          }}
        />
      </Sider>

      <Layout>

        {/* HEADER */}
        <Header
          className="flex items-center justify-between px-6 shadow-sm"
          style={{ background: PRIMARY_BG }}
        >
            <div className="flex items-center gap-3">
              <Logo />
            </div>

          {/* Welcome Admin (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2 font-bold text-lg text-gray-900">
            <UserCircle className="w-7 h-7 text-black" />
            <span>Welcome Admin</span>
          </div>

        </Header>

        {/* CONTENT */}
        <Content
          style={{
            padding: 24,
            background: "#f8fafc",
            minHeight: "100vh",
          }}
        >
          {children}
        </Content>

      </Layout>
    </Layout>
  )
}

export default AdminLayoutProvider