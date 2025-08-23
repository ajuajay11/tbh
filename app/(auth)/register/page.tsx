'use client';

import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect, Suspense } from "react";
import ErrorMessage from "@/app/components/ErrorMessage";
import OtpBox from "@/app/(auth)/components/authentication/OtpBox";
import ImageCom from "../../components/ImageCom";
import ToggleEyes from "../components/ToggleEyes";
import ButtonLoading from "@/app/components/ButtonLoading";
import Styles from "../auth.module.css"


// Inner component that uses useSearchParams
function RegisterForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("e");
  const router = useRouter();
  const [eyes, setEyes] = useState(false); // false = password hidden, true = visible

  const [error, setError] = useState<string | null>(null);
  const [register, setRegister] = useState({
    firstname: "",
    lastname: "",
    age: 0,
    email: "",
    gender: "",
    password: ""
  });
  const [steps, setSteps] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegister(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const closeButton = () => {
    setModalOpen(false);
    console.log('dd');

  }
  const sendMail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post(`/api/user/sendOtp`, { email: register.email });
      if (res.status === 200) {
        setModalOpen(true);
      }
    } catch (err: unknown) {
      let message = 'Unexpected error';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (email) {
      setRegister((prev) => ({ ...prev, email }));

      const triggerMail = async () => {
        setLoader(true);
        try {
          const res = await axios.post('/api/user/sendOtp', { email });
          if (res.status === 200) {
            setModalOpen(true);
          }
        } catch (error: unknown) {
          const err = error as AxiosError<{ message?: string }>;
          setError(err.response?.data?.message || err.message || 'Unexpected error');
        } finally {
          setLoader(false);
        }
      };
      triggerMail();
    }
  }, [email]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/register', register);
      if (response.status === 200) {
        router.push('/login');
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      setError(err.response?.data?.message || err.message || 'Unexpected error');
    }
  };

  return (
    <>
      {modalOpen && (

        <OtpBox closeBtn={closeButton} email={register.email} setSteps={setSteps} />

      )}
      <div className="lg:me-60 p-4">
        {steps === 1 ? (
          <section className={`${Styles.glassCard} backdrop-blur-md`}>
            <form onSubmit={sendMail} className="space-y-3 lg:space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Step 1: Verify Your Email</h2>
              <p className="text-sm text-gray-300 text-center"> Please enter your email address. We&apos;ll send you a verification code. </p>
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-1">Email address</label>
                <input type="email" id="email" name="email" value={register.email} onChange={handleChange} required className="w-full p-3 customBox" placeholder="you@example.com" />
              </div>
              <ErrorMessage message={error} />
              {loader ? <ButtonLoading /> : <button type="submit" className="tbh_button"> Send Verification Code </button>}
            </form>
          </section>
        ) : (
          <section className={`${Styles.glassCard} `}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstname" className="block text-white font-medium mb-1">Firstname:</label>
                <input type="text" id="firstname" name="firstname" value={register.firstname} onChange={handleChange} required className="w-full p-3 customBox" placeholder="Enter your first name" />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-white font-medium mb-1">Lastname:</label>
                <input type="text" id="lastname" name="lastname" value={register.lastname} onChange={handleChange} required className="w-full p-3 customBox" placeholder="Enter your last name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-1">Email:</label>
                <input type="email" id="email" name="email" value={register.email} disabled required className="w-full p-3 rounded-lg customBox" />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-white font-medium mb-1">Password:</label>
                <input type="password" id="password" name="password" value={register.password} onChange={handleChange} required
                  className="w-full p-3 customBox"
                  placeholder="Create a password"
                />
                <ToggleEyes eyes={eyes} setEyes={setEyes} />
              </div>
              <div>
                <label htmlFor="gender" className="block text-white font-medium mb-1">Gender:</label>
                <select id="gender" name="gender" value={register.gender} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/70 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="age" className="block text-white font-medium mb-1">Age:</label>
                <input type="number" id="age" name="age"
                  value={register.age} onChange={handleChange} required
                  className="w-full p-3 customBox"
                  placeholder="Enter your age"
                />
              </div>
              <button type="submit" className="tbh_button">
                Register
              </button>
              <ErrorMessage message={error} />
            </form>
          </section>

        )}
      </div>
    </>
  );
}
// Main Register component with Suspense
function Register() {
  return (
    <Suspense fallback={<div className="text-white text-center p-4">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

// Export with HOC
export default ImageCom(Register);
