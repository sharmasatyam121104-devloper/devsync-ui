import AdminLayoutProvider from "@/components/admin/adminLayoutProvider"
import { ReactNode } from "react"

const AdminLayoutRouter = ({children}:{children: ReactNode}) => {
  return (
    <AdminLayoutProvider>
        {children}
    </AdminLayoutProvider>
  )
}

export default AdminLayoutRouter