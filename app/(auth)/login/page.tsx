"use client"
import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from 'js-cookie';
import Link from "next/link";
 
export default function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: ""
  })
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/login', login, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      // console.log(response,'response.data.user.id');
      if (response) {
        Cookies.set('token', response.data.user.token, { expires: 12 });
        Cookies.set('isAuthenticated', 'true', { expires: 12 });
        Cookies.set('userId', response.data.user.id, { expires: 12 });
      }
      location.reload();
      console.log(response, 'response');

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <section className="w-full max-w-sm p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/20">
    <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow">Login to Chronicles</h2>
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
          type="text"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
          autoComplete="email"
        />
      </div>
      <div>
        <input
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
          autoComplete="current-password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition"
      >
        Login
      </button>
    </form>
    <Link href="/register">Register</Link>
  </section>
    </>
  )
}