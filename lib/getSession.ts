import httpRequest from "./http"

export const getSession = async () => {
  try {
    const {data} = await httpRequest.get("/user/session")
    return data.session
  } catch  {
    return null
  }
}