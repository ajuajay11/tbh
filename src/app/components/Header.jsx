
"use client"
import Link from "next/link";
import img from "./../../../public/tbh.png";
import Image from "next/image";
import { motion } from "framer-motion"
const fadeUpVariant = {
  initial: { opacity: 0, y: 100 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};
export default function Header() {
  return (
    <>
      <div className="container-fluid container-lg">
        <div className="row py-3 align-items-center">
          <div className="col-4 d-flex justify-content-start">
            
              <div>
                <h1>Chronicles</h1>
              </div>
           </div>

          <div className="col-4 d-flex justify-content-center">
          <motion.div
              variants={fadeUpVariant}
              initial="initial"
              animate="animate"
            >
            <Link href={'/'}>
              <Image src={img} alt="Description" width={90} height={80} />
            </Link>
            </motion.div>
          </div>
          <div className="col-4 d-flex justify-content-end">
            <h2>Login</h2>
          </div>
        </div>
      </div>
    </>
  );
}