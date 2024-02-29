import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    

    // if our accessToken expires we can refresh the access token with this function
    const refresh = async () => {
        // allows us to send cookies (secure cookie) with our request
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        // once refresh token is verified we get an accessToken
        setAuth(prev => {
            console.log("Previous State : ")
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, roles: response.data.roles, accessToken: response.data.accessToken }
        });
        
        // returning the accessToken so that we can use it with our requests
        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken