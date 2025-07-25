import pImage from "../../public/pexels-phael-2401442.png";
import Image from "next/image";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex h-full w-full max-w-[1600px]">
        <div className="w-2/3">
          <Image src={pImage} alt="Profile preview" className="object-cover w-100 h-full" />
        </div>
        <div className="w-2/3 h-full">
          <main className="flex items-center justify-start h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}