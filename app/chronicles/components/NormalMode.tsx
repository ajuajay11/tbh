 
import { Chronicle } from "@/app/types/chronicle";
interface NormalNodeProps {
  chronicle: Chronicle | null;
}
export default function NormalMode({ chronicle }: NormalNodeProps) {
  return (
     <>
     {chronicle ? (
       <div>
         <h2>{chronicle._id}</h2>
        </div>
     ) : (
       <p>No chronicle found</p>
     )}
     </>
  )
}

 