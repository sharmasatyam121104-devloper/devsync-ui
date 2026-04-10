"use client"

import { ReactNode,  useEffect, useState } from "react"
import Link from "next/link"
import { Layout, Menu, Skeleton, Tooltip, Button as AntButton } from "antd"
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
  PlusCircle,
  ListChecks,
  CheckSquare,
  Flag,
  ClipboardList,
} from "lucide-react"

import Logo from "../logo"
import {  usePathname, useRouter } from "next/navigation"
import { getSession } from "@/lib/getSession"
import RefreshToken from "../refreshToken"
import fetcher from "@/lib/fetcher"
import useSWR, { mutate } from 'swr'
import handleLogout from "@/lib/handleLogout"

const { Sider, Content, Header } = Layout

const PRIMARY_BG = "#f3f4f6"
const TEXT_COLOR = "#111827"

const menuItems = [
  {
    key: "/user",
    icon: <DashboardOutlined />,
    label: <Link href="/user">Dashboard</Link>,
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
        icon: <ListChecks size={16} />,
        label: <Link href="/user/issues">My Issues</Link>,
      },
      {
        key: "/user/issues/active",
        icon: <CheckSquare size={16} />,
        label: <Link href="/user/issues/active">Active Issues</Link>,
      },
      {
        key: "/user/issues/closed",
        icon: <CheckSquare size={16} />,
        label: <Link href="/user/issues/closed">Closed Issues</Link>,
      },
      {
        key: "/user/issues/create-issue",
        icon: <PlusCircle size={16} />,
        label: <Link href="/user/issues/create-issue">Create Issues</Link>,
      },
    ]
  },

  {
    key: "files",
    icon: <FileArchive size={16} />,
    label: "Files",
    children: [
      {
        key: "/user/files/upload",
        icon: <Upload size={16} />,
        label: <Link href="/user/files/upload">Upload ZIP</Link>,
      },
      {
        key: "/user/files/history",
        icon: <History size={16} />,
        label: <Link href="/user/files/history">File History</Link>,
      },
    ],
  },

  {
    key: "meetings",
    icon: <Calendar size={16} />,
    label: "Meetings",
    children: [
      {
        key: "/user/meetings/create",
        label: <Link href="/user/meetings/create">Schedule Meeting</Link>,
      },
      {
        key: "/user/meetings",
        label: <Link href="/user/meetings">Upcoming Meetings</Link>,
      },
    ],
  },

  {
    key: "reports",
    icon: <Flag size={16} />,
    label: "Reports",
    children: [
      {
        key: "/user/reports/create-report",
        icon: <Flag size={14} />,
        label: <Link href="/user/reports/create-report">Report User</Link>,
      },
      {
        key: "/user/reports/report-history",
        icon: <ClipboardList size={14} />,
        label: <Link href="/user/reports/report-history">Report History</Link>,
      },
    ],
  },

  {
    key: "/user/chat",
    icon: <MessageCircle size={16} />,
    label: <Link href="/user/chat">Project Chat</Link>,
  },

  {
    key: "profile",
    icon: <User size={16} />,
    label: "Profile",
    children: [
      {
        key: "user/profile",
        label: <Link href="/user/profile">My Profile</Link>,
      }
    ],
  },
]


export interface Session {
  id: string
  email: string
  fullname: string
  role: "USER" | "ADMIN"
  iat: number
  exp: number
}

const UserLayoutProvider = ({ children }: { children: ReactNode }) =>  {
  const [collapsed, setCollapsed] = useState(false)
  const [sessionData, setSessionData] = useState("")
  const [loading] = useState(false)
  const pathname = usePathname()
  const EightySecInMs = 80000
  const router = useRouter()

  const { error} = useSWR('/user/refresh-token', fetcher, {
    refreshInterval: EightySecInMs, shouldRetryOnError: false
  })

  console.log(sessionData);

  const logoutUser = async()=>{
    await handleLogout()
    mutate(() => true, undefined, { revalidate: false })
  }

  const logoutUserbtn = async()=>{
    await handleLogout()
    router.replace('/login')
    return
  }

  useEffect(() => {
    if (error) {
      logoutUser()
      router.replace('/login')
      return
    }
  }, [error, router])

  useEffect(() => {

    const fetchSession = async () => {
        const data = await getSession()
        setSessionData(data)

      if (!data) {
        // Not logged in → redirect to login
        router.push("/login")
        return
      }

      // ab data guaranteed hai
      if (data.role !== "USER") {
        if (data.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/login")
        }
      }

    }

    fetchSession()

  }, [])
  

  if (loading) {
    return (
      <Skeleton active />
    )
  }




  return (
    <Layout style={{ height: "100vh", overflow: "hidden", background: PRIMARY_BG }}>
      
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
          style={{ 
            background: PRIMARY_BG, 
            position: "sticky", 
            top: 0,
            height: "100vh",
          }}
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

      <Layout style={{ height: "100vh" }}>

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
          <Tooltip title={`Click here for logout.`}>
              <AntButton
                type={"text"}
                className="hover:bg-red-500"
                onClick={logoutUserbtn}
              >
                <LogoutOutlined style={{ color: TEXT_COLOR }} className="ml-18 " />
              </AntButton>
            </Tooltip>

        </Header>

        {/* CONTENT */}
        <Content
          style={{
            padding: 2,
            background: "#f8fafc",
            overflowY: "auto",   //scroll yaha aayega
            height: "calc(100vh - 64px)" // header height minus
          }}
        >
          { <RefreshToken />}
          {children}
        </Content>

      </Layout>
    </Layout>
  )
}

export default UserLayoutProvider