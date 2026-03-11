import React, { ReactNode } from 'react'

const AdminLayoutProvider = ({children}: {children: ReactNode}) => {
  return (
    <div>
        <h1>AdminLayoutProvider</h1>
        {children}
    </div>
  )
}

export default AdminLayoutProvider