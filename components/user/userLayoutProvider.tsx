import React, { ReactNode } from 'react'

const UserLayoutProvider = ({children}: {children: ReactNode}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default UserLayoutProvider