
 import ImageVariation from "../components/authentication/ImageVariation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-y-auto scrollYTBH">
      <div className="flex h-full w-full max-w-[1600px]">
        <div className="w-1/3 hidden lg:block">
        <ImageVariation />
        </div>
        <div className="w-3/3 lg:w-2/3 h-full px-2 lg:px-0">
          <main className="flex mt-20 justify-start h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}