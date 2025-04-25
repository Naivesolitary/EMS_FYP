import { axiosPrivate } from "../services/axios";
import { useEffect } from "react";
import {useRefreshToken} from '../hooks/useRefreshToken'
import { useAuth } from "../context/AuthContext";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const {auth,setAuth} = useAuth();
    console.log("Auth value from useAxiosPrivate: ",auth)

          
    useEffect(() =>{

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config;
            }
            ,(error) => Promise.reject(error)
        )
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if((error?.response?.status === 403 || error?.reponse?.status === 401 || error?.response?.status === 401) && !prevRequest?.sent){
                    prevRequest.sent = true;
                    try{

                        const newAccessToken = await refresh();
                        console.log("new AccessToken has been generated :", newAccessToken)
                       
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                        setAuth({...auth,accessToken:newAccessToken})
                        return axiosPrivate(prevRequest)
                    }catch(refreshError){
                        console.error("Refresh token failed:",refreshError)
                        setAuth({...auth,accessToken:null});
                        return Promise.reject(refreshError)
                        

                    }
                   
                }
                return Promise.reject(error)
            }
        )
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }

    },[auth,setAuth,refresh])

    return axiosPrivate
}

export default useAxiosPrivate;