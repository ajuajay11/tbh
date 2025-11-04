'use client'
import axios from "axios";
 import { useState, FormEvent, useRef, Dispatch, SetStateAction, useEffect } from "react";
import SuccessMsg from "../../../components/SuccessMsg";
import ErrorMessage from "../../../components/ErrorMessage";
 import Styles from "../../auth.module.css";
import { X } from 'lucide-react';

type OtpBoxProps = { closeBtn: () => void; 
  email: string;
  setSteps: Dispatch<SetStateAction<number>>;
};
export default function OtpBox(props: OtpBoxProps) {
  // const [timer, seTimer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fillOtp, setFillOtp] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
  })
  const [timer, setTimer] = useState(59);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, index: number) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    setFillOtp((prev) => ({ ...prev, [key]: value }));

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };
 useEffect(() => {
    if (timer === 0) return;
   const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

    const resendOtp = async () => {
      setTimer(59);
     try {
      const response = await axios.post('/api/user/sendOtp', { email: props.email });
      console.log(response,'responseresponse');
      
      if (response.status === 200) {
        const successMsg = response?.data?.message;
        setSuccess(successMsg)
        console.log(successMsg,'response');
      }
    } catch (err: unknown) {
       let message = 'Unexpected error';
       if (axios.isAxiosError(err)) {
         message = err.response?.data?.message || err.message;
       } else if (err instanceof Error) {
         message = err.message;
       }
       setError(message);
     }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    // Combine OTP digits
    const otp = fillOtp.one + fillOtp.two + fillOtp.three + fillOtp.four;

    if (otp.length < 4) {
      alert("Please enter a 4-digit OTP");
      return;
    }
     try {
      const response = await fetch("/api/user/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otp, email: props.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "OTP verification failed"}`);
        return;
      }

      const data = await response.json();
      console.log("OTP verified:", data);
      // Optionally close or notify parent
      props.closeBtn();
      props.setSteps((prev) => prev + 1);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong while verifying OTP.");
    }
  };

  return (
    <>
     <SuccessMsg successMsg={success}/>
    <div className={`${Styles.otpBox} ease-in-expo`}>
      <div className="flex items-center justify-end">
        <button className="p-3" onClick={props?.closeBtn}><X/></button>
      </div>
      <div className="flex flex-col justify-center items-center h-full text-dark">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center">
            {Object.entries(fillOtp).map(([key, value], index) => (
            <input key={key} ref={(el: HTMLInputElement | null) => { inputsRef.current[index] = el;  }} type="text"
              maxLength={1}  value={value} inputMode="numeric" onChange={(e) => handleChange(e, key, index)} className="bg-transparent border p-4 text-center w-12 rounded"  required/>
          ))}
          </div>
          <span className="text-green-700 capitalize">{success}</span>
          <button className="tbh_button">Submit</button>
        </form>
         <div className="flex justify-between gap-20 pt-5">
            <span className=" p-2 rounded-xl">{timer} s</span>
            {timer === 0 ? (
              <button onClick={resendOtp} className="text-white-600 underline">Resend OTP</button>
            ) : (
              <span className="text-gray-500">Resend OTP</span>
            )}
          </div>
          <ErrorMessage message={error} />
      </div>
      
    </div>
    </>
  )
}