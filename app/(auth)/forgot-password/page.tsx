'use client';

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, Suspense } from "react";
import ErrorMessage from "@/app/components/ErrorMessage";
import OtpBox from "@/app/(auth)/components/authentication/OtpBox";
import ImageCom from "../../components/ImageCom";
import ToggleEyes from "../components/ToggleEyes";
import ButtonLoading from "@/app/components/ButtonLoading";
import Styles from "../auth.module.css"
import { getBaseUrl } from "@/lib/getBaseUrl";


// Inner component that uses useSearchParams
function FormatPasswordForm() {
   const router = useRouter();
  const [eyes, setEyes] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState({
    password: "",
    email:"",
    type:"forgot-password"
  });
  const [steps, setSteps] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const closeButton = () => {
    setModalOpen(false);
 
  }
  const sendMail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post(`${getBaseUrl()}/api/user/sendOtp`, { email: password.email, type:password.type });
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // password.remove(password.email);
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/forget-password', password);
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

        <OtpBox closeBtn={closeButton} email={password.email} setSteps={setSteps} />

      )}
      <div className="lg:me-60 p-4">
        {steps === 1 ? (
          <section className={`${Styles.glassCard} backdrop-blur-md`}>
            <form onSubmit={sendMail} className="space-y-3 lg:space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Step 1: Verify Your Email</h2>
              <p className="text-sm text-gray-300 text-center"> Please enter your email address. We&apos;ll send you a verification code. </p>
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-1">Email address</label>
                <input type="email" id="email" name="email" value={password.email} onChange={handleChange} required className="w-full p-3 customBox" placeholder="you@example.com" />
              </div>
              <ErrorMessage message={error} />
              {loader ? <ButtonLoading /> : <button type="submit" className="tbh_button"> Send Verification Code </button>}
            </form>
          </section>
        ) : (
          <section className={`${Styles.glassCard} `}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="password" className="block text-white font-medium mb-1">New Password:</label>
                <input type="password" id="password" name="password" value={password.password} onChange={handleChange} required
                  className="w-full p-3 customBox"
                  placeholder="Create a password"
                />
                <ToggleEyes eyes={eyes} setEyes={setEyes} />
              </div>
              <button type="submit" className="tbh_button">
                submit
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
function ForgotPassword() {
  return (
    <Suspense fallback={<div className="text-white text-center p-4">Loading...</div>}>
      <FormatPasswordForm />
    </Suspense>
  );
}

// Export with HOC
export default ImageCom(ForgotPassword);
