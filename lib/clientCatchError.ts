import { message } from "antd"
import axios from "axios"

interface ApiErrorResponse {
  message?: string
  error?: string
}

const clientCatchError = (error: unknown): void => {

  //  Axios Error (properly typed)
  if (axios.isAxiosError<ApiErrorResponse>(error)) {

    const serverMessage =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.response?.statusText ??
      "Server error"

    message.error(serverMessage)
    return
  }

  // Native JS Error
  if (error instanceof Error) {
    message.error(error.message)
    return
  }

  //Fallback
  message.error("Internal server error")
}

export default clientCatchError