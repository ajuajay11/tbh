import styles from "../../page.module.css";
import img from "./../../../../public/hero.png";
import Image from "next/image";
import Link from "next/link";
export default function Hero() {
  return (
    <>
       
      <div className="d-flex align-items-center justify-content-center py-5">
        <h1 className="text-dark text-center" style={{ fontSize: 'clamp(40px, 4vw, 80px)' }}>
          Unleashing the power of thoughts & emotions
        </h1>
      </div>
    </>
  );
}
