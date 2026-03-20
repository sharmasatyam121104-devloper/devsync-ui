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

const LayoutProvider: FC<Props> = ({ children }) => {
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
    if (session && (pathname === "/login" || pathname === "/signup")) {
      router.replace(session.role === "ADMIN" ? "/admin" : "/user")
      return
    }
  }, [session])

  if (session === undefined) return <Skeleton active />

  return <>{children}</>
}

export default LayoutProvider