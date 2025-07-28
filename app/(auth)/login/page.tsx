"use client"

import { useState, FormEvent } from "react";
import Cookies from 'js-cookie';
import Link from "next/link";
import ErrorMessage from "@/app/components/ErrorMessage";
import SuccessMsg from "@/app/components/SuccessMsg";
import axios from "axios";

export default function Login() {
  const [login, setLogin] = useState({
    email: "chronicleofstrangers@gmail.com",
    password: "Ajay@150490"
  })
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/login', login, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      // console.log(response,'response.data.user.id');
      if (response?.status == 200 || '200') {
        Cookies.set('token', response.data.user.token, { expires: 12 });
        Cookies.set('isAuthenticated', 'true', { expires: 12 });
        Cookies.set('userId', response.data.user.id, { expires: 12 });
        const successMsg = response?.data?.message;
        setSuccess(successMsg)
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
      // location.reload();
      console.log(response, 'response');
     } catch (err: unknown) {
       let message = 'Unexpected error';
       
       if (axios.isAxiosError(err)) {
         message = err.response?.data?.message || err.message;
       } else if (err instanceof Error) {
         message = err.message;
       }
       setError(message);
     }
  }

  return (
    <>
    <SuccessMsg successMsg={success}/>
      <section className="w-full max-w-sm p-8 shadow-2xl backdrop-blur-lg border border-white/20 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow text-start">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="text-white">
            <input value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} type="text" placeholder="Email" className="w-full px-4 py-3 rounded-null bg-white/10  placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-white" autoComplete="email"  required />
          </div>
           <div className="text-white">
            <input value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })}  type="password" placeholder="Password" className="w-full px-4 py-3 rounded-null bg-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300" autoComplete="current-password" required />
          </div>
          <button type="submit" className="tbh_button w-full"> Login </button>
        </form>
        <ErrorMessage message={error} />
        {/* Links */}
        <div className="mt-6 text-center space-y-2 text-sm">
          <p className="text-gray-300"> Don&apos;t have an account? <Link href="/register" className="text-blue-400 hover:underline"> Register </Link> </p>
          <p> <Link href="/forgot-password" className="text-blue-400 hover:underline"> Forgot your password? </Link> </p>
          <p className="text-gray-400 text-xs"> By signing in, you agree to our  <Link href="/terms" className="underline hover:text-white"> Terms & Conditions  </Link> . </p>
        </div>
      </section>
           
    </>
  )
}