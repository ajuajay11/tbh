export default function DashboardLayout({children}: { children: React.ReactNode }) {
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#22223b] via-[#4a4e69] to-[#9a8c98]">
        <main>{children}</main>
     </div>
      
  )
}