import axios from 'axios'

const httpRequest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER,
    withCredentials: true
})

export default httpRequest