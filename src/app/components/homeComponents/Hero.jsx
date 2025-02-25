import styles from "../../page.module.css";
import img from "./../../../../public/hero.png";
import Image from "next/image";
import Link from "next/link";
export default function Hero() {
  return (
    <>
      <div className={`${styles.heroSection} position-relative mt-5 col-12 rounded-3 shadow d-flex align-items-center justify-content-center`}>
        <div className="d-flex flex-column align-items-center">
          <h1 className={`${styles.fs_one} fw-bold mb-5`}> Unleashing the power of thoughts & emotions </h1>
          <Link href={'/'} className="d-inline-block btn text-center bg-dark text-white px-4"> Get Started </Link>
        </div>
        <span style={{ right: 0, bottom: 0 }} className="position-absolute">
          <Image src={img} alt="Description" width={190} height={180} />
        </span>
      </div>
    </>
  );
}
