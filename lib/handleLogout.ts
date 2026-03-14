import clientCatchError from "./clientCatchError";
import httpRequest from "./http";

const handleLogout = async() => {
    try {
        const {data} = await httpRequest.get('/user/logout')
        return data
    } 
    catch (error) {
        return clientCatchError(error)    
    }
}

export default handleLogout;
