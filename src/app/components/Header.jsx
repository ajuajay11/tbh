
"use client"
import Link from "next/link";
import img from "./../../../public/tbh.png";
import Image from "next/image";
import { motion } from "framer-motion";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

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
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(Cookies.get('token'));
  }, []);
  return (
    <>
      <nav style={{ position: "absolute", top: 0, left: 0 }} className="w-100">
        <div className="container-fluid container-lg position-sticky">
          <div className="row py-3 align-items-center">
            <div className="col-4 d-flex justify-content-start">
              <div>
                <h1>
                <Link href={'/chronicles'}>Chronicles</Link></h1>
              </div>
            </div>
            <div className="col-4 d-flex justify-content-center">
              <motion.div variants={fadeUpVariant} initial="initial" animate="animate" >
                <Link href={'/'}>
                  <Image src={img} alt="Description" width={90} height={80} />
                </Link>
              </motion.div>
            </div>
            <div className="col-4 d-flex justify-content-end">
              {!token ? <Link href="/auth/login">Login</Link> : <Link href="/dashboard">profile</Link>}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}