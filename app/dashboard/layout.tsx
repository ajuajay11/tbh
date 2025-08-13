
import ImageVariation from "../components/authentication/ImageVariation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-y-auto scrollYTBH">
      <div className="flex h-full w-full max-w-[1600px]">
        <div className="w-1/3 hidden lg:block">
        <ImageVariation />
        </div>
        <div className="w-full lg:w-2/3 h-full px-4 lg:px-8">
          <main className="flex items-center lg:items-start justify-center min-h-full ">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}