
import httpRequest from "./http"

const fetcher = async(url: string) => {
    try {
        const {data} = await httpRequest.get(url)
        return data
    } 
    catch (error) {
       throw error
    }
}

export default fetcher