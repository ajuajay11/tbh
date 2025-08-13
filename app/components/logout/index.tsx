"use client";
import Cookies from "js-cookie";

export default function Index() {
  const logout = () => {
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      Cookies.remove(name, { path: "/" }); // must match original path
    });
    location.reload();
  };

  return (
    <div onClick={logout} className="card p-4 cursor-pointer">
      Logout
    </div>
  );
}
