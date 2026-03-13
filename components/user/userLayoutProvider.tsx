"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { Layout, Menu, Tooltip } from "antd"
import {
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons"

import {
  FolderGit2,
  Bug,
  FileArchive,
  Calendar,
  MessageCircle,
  User,
  Plus,
  Upload,
  History,
} from "lucide-react"

import Logo from "../logo"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const { Sider, Content, Header } = Layout

const PRIMARY_BG = "#f3f4f6"
const TEXT_COLOR = "#111827"

const menuItems = [
  {
    key: "/user",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },

  {
    key: "projects",
    icon: <FolderGit2 size={16} />,
    label: "Projects",
    children: [
      {
        key: "/user/projects",
        icon: <FolderGit2 size={16} />,
        label: <Link href="/user/projects">All Projects</Link>,
      },
      {
        key: "/user/projects/create",
        icon: <Plus size={16} />,
        label: <Link href="/user/projects/create">Create Project</Link>,
      },
    ],
  },

  {
    key: "issues",
    icon: <Bug size={16} />,
    label: "Issues",
    children: [
      {
        key: "/user/issues",
        label: <Link href="/user/issues">My Issues</Link>,
      },
      {
        key: "/user/issues/active",
        label: <Link href="/user/issues/active">Active Issues</Link>,
      },
      {
        key: "/user/issues/closed",
        label: <Link href="/user/issues/closed">Closed Issues</Link>,
      },
    ],
  },

  {
    key: "files",
    icon: <FileArchive size={16} />,
    label: "Files",
    children: [
      {
        key: "/files/upload",
        icon: <Upload size={16} />,
        label: <Link href="/files/upload">Upload ZIP</Link>,
      },
      {
        key: "/files/history",
        icon: <History size={16} />,
        label: <Link href="/files/history">File History</Link>,
      },
    ],
  },

  {
    key: "meetings",
    icon: <Calendar size={16} />,
    label: "Meetings",
    children: [
      {
        key: "/meetings/create",
        label: <Link href="/meetings/create">Schedule Meeting</Link>,
      },
      {
        key: "/meetings",
        label: <Link href="/meetings">Upcoming Meetings</Link>,
      },
    ],
  },

  {
    key: "/chat",
    icon: <MessageCircle size={16} />,
    label: <Link href="/chat">Project Chat</Link>,
  },

  {
    key: "profile",
    icon: <User size={16} />,
    label: "Profile",
    children: [
      {
        key: "/profile",
        label: <Link href="/profile">My Profile</Link>,
      },
      {
        key: "logout",
        icon: <LogoutOutlined style={{ color: TEXT_COLOR }} />,
        label: (<Tooltip title={"Click here for logout."}><Button variant={"link"} onClick={()=>alert("logout")} className="cursor-pointer">Logout</Button></Tooltip>),
      },
    ],
  },
]

const UserLayoutProvider = ({ children }: { children: ReactNode }) =>  {
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

          <div className="hidden sm:flex items-center gap-2 font-bold text-lg text-gray-900">
            <span>Welcome Developer</span>
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

export default UserLayoutProvider