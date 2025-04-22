import React from 'react'
import { FaRegCheckCircle as Check } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
export default function PaymentSuccess() {
  // const navigate = useNavigate()
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     requestAnimationFrame(() => navigate('/'));

  //   },8000)
    
  //   return () => clearTimeout(timer); //cleanup

  // },[navigate])
  return (
    <div className=' flex flex-col items-center gap-7 text-4xl mt-24 font-bold text-emerald-400 text-center  '>
      <Check size={100}/>
      <div>Payment Successful</div>
      <p className='text-blue-400'>Redirecting you to the home page...</p>
    </div>
  )
}
