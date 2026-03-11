import UserLayoutProvider from "@/components/user/userLayoutProvider"
import { ReactNode } from "react"

const UserLayoutRouter = ({children}: {children: ReactNode}) => {
  return (
    <UserLayoutProvider>
        {children}
    </UserLayoutProvider>
  )
}

export default UserLayoutRouter