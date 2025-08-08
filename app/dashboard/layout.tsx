
 import ImageVariation from "../components/authentication/ImageVariation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex h-full w-full max-w-[1600px]">
        
        <div className="w-3/3 h-full">
          <main className="flex mt-20 h-full overflow-y-scroll scrollYTBH">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}