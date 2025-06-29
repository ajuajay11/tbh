import Link from "next/link";
import Logout from "@/app/components/logout"
export default function page() {
  return (
    <>
    <section>
        <div className="card p-4 border">
            <Link href="/dashboard/my-profile">My Profile</Link>
        </div>
        <div className="card p-4 border">
            <Link href="/dashboard/mychronicles">My Chronicles</Link>
        </div>
        <div className="card p-4 border">Settings</div>
        <div className="card p-4 border">Inclusion</div>
        <Logout/>
    </section>
    </>
  )
}
 