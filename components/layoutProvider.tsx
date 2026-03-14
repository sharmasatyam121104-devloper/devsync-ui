'use client'
import { FC, ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSession } from "@/lib/getSession"
import { Skeleton } from "antd"

interface Props {
  children: ReactNode
  role?: "USER" | "ADMIN" // optional role restriction
}

export interface Session {
  id: string
  email: string
  fullname: string
  role: "USER" | "ADMIN"
  iat: number
  exp: number
}

const LayoutProvider: FC<Props> = ({ children, role }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined) // undefined while loading
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSession()
      setSession(data || null)
    }
    fetchSession()
  }, [])

  useEffect(() => {
    if (session === undefined) return // still loading

    // If logged in and on login/signup, redirect to dashboard
    if (session && (pathname === "/login" || pathname === "/signup")) {
      router.replace(session.role === "ADMIN" ? "/admin" : "/user")
      return
    }

    // If not logged in and trying to access protected page, redirect to login
    if (!session) {
      if ((role === "ADMIN" && pathname.startsWith("/admin")) ||
          (role === "USER" && pathname.startsWith("/user"))) {
        router.replace("/login")
        return
      }
    }

    // If logged in but role mismatch, redirect to login
    if (session && role && session.role !== role) {
      router.replace("/login")
    }

  }, [session, pathname, role, router])

  if (session === undefined) return <Skeleton active />

  return <>{children}</>
}

export default LayoutProvider