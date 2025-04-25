import axios from 'axios'
import { BASE_URL } from '../config'


// THIS ONE FOR PUBLIC REQUESTS
export default axios.create({
    baseURL:    BASE_URL
})



// THIS ONE FOR PROTECTED ROUTES
export const axiosPrivate =  axios.create({
    baseURL:    BASE_URL,
    headers: {'Content-Type':'application/json'},
    withCredentials:true
})