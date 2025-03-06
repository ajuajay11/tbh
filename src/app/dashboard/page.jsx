"use client"
import Cookies from 'js-cookie';

export default function page() {
    const logout = () => {
        Cookies.remove('token');
      };
  return (
    <>
    <div className='mt-5'>
        <button className='mt-5' onClick={logout}>logout</button>
    </div>
    </>
  )
}