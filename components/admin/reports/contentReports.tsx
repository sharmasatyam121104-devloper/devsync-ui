"use client"

import { Empty, Button } from "antd"

const ContentReports = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">

      <Empty
        description={
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">
              FEATURE COMING SOON
            </p>
            <p className="text-sm text-gray-500">
              Content Reports module will be available in future updates.
            </p>
          </div>
        }
      >
        <Button type="primary">
          STAY TUNED
        </Button>
      </Empty>

    </div>
  )
}

export default ContentReports