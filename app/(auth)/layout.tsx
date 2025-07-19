export default function DashboardLayout({children}: { children: React.ReactNode }) {
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#22223b] via-[#000] to-[#9a8c98]">
        <main>{children}</main>
     </div>
      
  )
}