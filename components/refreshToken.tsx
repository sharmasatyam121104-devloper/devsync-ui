"use client"

import { useEffect } from "react"
import httpRequest from "@/lib/http"
import clientCatchError from "@/lib/clientCatchError"

const RefreshToken = () => {

  useEffect(() => {

    const interval = setInterval(async () => {
      try {
        await httpRequest.get("/user/refresh-token")
        console.log("Token refreshed")
      } 
      catch (error) {
        return clientCatchError(error)
      }
    }, 80000) // 80 seconds

    return () => clearInterval(interval)

  }, [])

  return null
}

export default RefreshToken