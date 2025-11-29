"use client"
 import { useState, FormEvent } from "react";
import Cookies from 'js-cookie';
import Link from "next/link";
import ErrorMessage from "@/app/components/ErrorMessage";
import SuccessMsg from "@/app/components/SuccessMsg";
import axios from "axios";
import ImageCom from "../../components/ImageCom";
import ToggleEyes from "../components/ToggleEyes";
import ButtonLoading from "@/app/components/ButtonLoading";
import Styles from "../auth.module.css";
import { getBaseUrl } from "@/lib/getBaseUrl";

 
function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: ""
  })
  const [eyes, setEyes] = useState(false); // false = password hidden, true = visible
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${getBaseUrl()}/api/user/login`, login, {
        headers: {
          "Content-Type": "application/json",
        }
      });
       if (response?.status == 200 || '200') {
        Cookies.set('token', response.data.user.token, { expires: 12 });
        Cookies.set('isAuthenticated', 'true', { expires: 12 });
        Cookies.set('userId', response.data.user.id, { expires: 12 });
        Cookies.set('avatar', response.data.user.avatar, { expires: 12 });
        Cookies.set('username', response.data.user.username, { expires: 12 });
        if(response.data.user.role === "subscribed"){
           Cookies.set('role', response.data.user.role, { expires: 12 });
        }
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
    setLoading(false);

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
      <SuccessMsg successMsg={success} />
      <section className="lg:me-60">
        <div className={`${Styles.glassCard} backdrop-blur-md`}>
        <h1 className="subHeader font_two mb-4">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-white">
            <input value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} type="text" placeholder="Email" className="w-full px-4 py-3 customBox" autoComplete="email" required />
          </div>
          <div className="text-white relative">
            <input value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} type={eyes ? "text" : "password"} placeholder="Password" className="w-full px-4 py-3 customBox" autoComplete="current-password" required />
            <ToggleEyes eyes={eyes} setEyes={setEyes} />
          </div>
          {loading ? (
            <ButtonLoading/>
          ) : (
            <button type="submit" className="tbh_button w-full"> Login </button>
          )}
        </form>
        <ErrorMessage message={error} />
         <div className="mt-6 text-center space-y-2 text-sm">
          <p className="text-gray-300"> Don&apos;t have an account? <Link href="/register" className="text-blue-400 "> Register </Link> </p>
          <p> <Link href="/forgot-password" className="text-blue-400  "> Forgot your password? </Link> </p>
          <p className="text-gray-400 text-xs"> By signing in, you agree to our  <Link href="/terms-and-conditions" className="underline hover:text-white"> Terms & Conditions  </Link> . </p>
        </div>
      </div>

      </section>
    </>
  )
}

export default ImageCom(Login)