"use client"
import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from 'js-cookie';
 
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
      <section>
        <div>
           
          <form onSubmit={handleSubmit}>
            <div>
              <input value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} type="text" placeholder="name" />
            </div>
            <div>
              <input value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} type="text" placeholder="password" />
            </div>
            <input type="submit" name="login here" />
          </form>
        </div>
      </section>
    </>
  )
}