'use client'
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { FC, ReactNode } from "react"

interface ChildrenInterface {
    children: ReactNode
}

const LayoutProvider:FC<ChildrenInterface> = ({children}) => {
  return (
    <AntdRegistry>{children}</AntdRegistry>
  )
}

export default LayoutProvider