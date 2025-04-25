import axios from 'axios'
import {useAuth} from '../context/AuthContext'
import { BASE_URL } from '../config'
export const  useRefreshToken = () => {
    const {setAuth} = useAuth()
    const refresh = async () => {
         const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`,{},{
            withCredentials:true
         });
         const {newAccessToken} = response.data.data
         console.log(JSON.stringify(newAccessToken))
         setAuth( prev => {
            
            return {...prev,accessToken:newAccessToken}
         })

         return newAccessToken;
    }

    return refresh
}




