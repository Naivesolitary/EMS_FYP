import {createContext,  useState, useContext, useEffect } from 'react'
import axios from '../services/axios';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState({user:null,accessToken:null})
   


    const login = (user,token) => {setAuth(
        {user,accessToken:token})
        localStorage.setItem('L-ID',user.id)
    }
    const signup = (user,token) => {
        setAuth({user,accessToken:token})
        localStorage.setItem('L-ID', user.id);
}
    const logout = () => {
        setAuth({user:null,accessToken:null})
    localStorage.removeItem('L-ID')}
    // const setAccessToken = (token) => setAuth((prev) => ({...prev,accessToken:token}))
    console.log("Auth info from context: ",auth)



    useEffect(() => {
         const restoreSession = async() => {
            const storedUserId = localStorage.getItem('L-ID');
            if(storedUserId && !auth.accessToken){
                try{
                    const response = await axios.post(`/api/auth/refresh-token`,{},{
                        withCredentials:true
                     })
                     const {newAccessToken,user} = response.data.data
                     setAuth({user,accessToken:newAccessToken})
                    console.log("New AccessToken generated during page reload: ", newAccessToken)
                }catch(err){
                  console.log("Session restore failed: ",err);
                  localStorage.removeItem('L-ID');
                }
            }
         }

         restoreSession();
    },[auth.accessToken])
  

  

    return (
        <AuthContext.Provider value={{auth,setAuth,signup,login,logout}}>
        {children}

        </AuthContext.Provider>
    )
}


// const test = useContext(AuthContext)

export const useAuth = () => useContext(AuthContext) 