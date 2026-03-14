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
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const EightySecInMs = 80000
  const router = useRouter()

  const { error} = useSWR('/user/refresh-token', fetcher, {
    refreshInterval: EightySecInMs, shouldRetryOnError: false
  })

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
          console.log("acess in ulayout in 169");
          logoutUser()
          router.replace('/login')
          return
        }
      }, [error, router])

  useEffect(() => {

    const fetchSession = async () => {
        const data = await getSession()

       if(!data || data.role !== "USER") {
        console.log("acess in ualayout, 184");
          router.push("/login")
          return
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
    <Layout style={{ minHeight: "90vh", background: PRIMARY_BG }} >
      
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: PRIMARY_BG, position: "sticky", top: 0 }}
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
          <Tooltip title={"Click here for logout."}>
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
            padding: 24,
            background: "#f8fafc",
            minHeight: "100vh",
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