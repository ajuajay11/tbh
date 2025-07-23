"use client"
import Cookies from "js-cookie"
export default function index() {
     const logout =()=>{
        Cookies.remove('token');
        Cookies.remove('isAuthenticated');
        Cookies.remove('userId');
        setTimeout(() => {
            location.reload()
        }, 1000);
    }
  return (
    <>
       <div onClick={logout} className="card p-4">Logout</div>
    </>
  )
}

 