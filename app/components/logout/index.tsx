"use client";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import SuccessMsg from "@/app/components/SuccessMsg";

export default function Index() {
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const logout = () => {
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      Cookies.remove(name, { path: "/" }); // must match original path
      setSuccess("user logout Successfully")
    });
    location.reload();
  };

  return (
    <>
    <SuccessMsg successMsg={success} />
     <div className="mock" onClick={()=>setOpenModal(prev => !prev)}><LogOut/></div>
    {openModal && createPortal(
  <div className="openModal">
  <h3 className=" font_two mb-1">Confirm Logout</h3>
  <p className="modal_message">Are you sure you want to log out?</p>
  <div className="pt-10 flex justify-end gap-4">
    <button onClick={logout} className="tbh_button logout_btn">Logout</button>
    <button onClick={() => setOpenModal(false)} className="bg-sky cancel_btn border px-3">Cancel</button>
  </div>
</div>,
  document.body
)}
    
    </>
  );
}
