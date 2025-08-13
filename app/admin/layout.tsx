 import Sidenav from "./Sidenav"
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidenav />
      {children}
    </>
  )
}
 