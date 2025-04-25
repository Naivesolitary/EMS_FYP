import {createContext,  useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { BASE_URL } from '../config';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState({user:null,accessToken:null})


    const login = (user,token) => setAuth({user,accessToken:token})
    const signup = (user,token) => setAuth({user,accessToken:token})
    const logout = () => setAuth({user:null,accessToken:null})
    // const setAccessToken = (token) => setAuth((prev) => ({...prev,accessToken:token}))
    console.log("Auth info from context: ",auth)

  

  

    return (
        <AuthContext.Provider value={{auth,setAuth,signup,login,logout}}>
        {children}

        </AuthContext.Provider>
    )
}


// const test = useContext(AuthContext)

export const useAuth = () => useContext(AuthContext) 