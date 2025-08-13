import ImageVariation from "../components/authentication/ImageVariation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col lg:flex-row h-full min-h-screen w-full max-w-[1600px]">
        {/* Image Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2">
          <ImageVariation />
        </div>
        
        {/* Content Section */}
        <div className="w-full lg:w-3/5 xl:w-1/2 h-full min-h-screen bg-[#030303]">
          <main className="flex items-center justify-center lg:justify-start h-full min-h-screen px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}