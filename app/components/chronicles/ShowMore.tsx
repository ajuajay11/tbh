'use client';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';

export default function ShowMore() {
 const token = Cookies.get('token');
       const router = useRouter();

    const submit =()=>{
        if(!token){
            alert("poi login chyada myre")
        }else{
            router.push('/getAllChronicles');
        }
    }
  return (
    <>
      <div>
        <button className="border p-4" onClick={submit}>ShowMore</button>
      </div>
    </>
  )
}
