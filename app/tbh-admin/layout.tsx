import Sidenav from "./Sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen flex">
      {/* Sidebar */}
      <div className="h-full w-60 text-white">
        <Sidenav />
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-[#98000033] p-6 rounded-3xl">
        {children}
      </main>
    </section>
  );
}
