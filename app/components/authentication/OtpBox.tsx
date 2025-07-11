'use client'
import "./auth.css";
import { useState, FormEvent, useRef, Dispatch, SetStateAction } from "react";
 
type OtpBoxProps = {
  closeBtn: () => void;
  email: string;
  setSteps: Dispatch<SetStateAction<number>>;
};
export default function OtpBox(props: OtpBoxProps) {

  const [fillOtp, setFillOtp] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
  })
  // Create refs for each input
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, index: number) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    setFillOtp((prev) => ({ ...prev, [key]: value }));

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('hei');

    // Combine OTP digits
    const otp = fillOtp.one + fillOtp.two + fillOtp.three + fillOtp.four;

    if (otp.length < 4) {
      alert("Please enter a 4-digit OTP");
      return;
    }

    try {
      const response = await fetch("/api/user/sendOtp", {
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
    <div className="otpBox ease-in-expo">
      <div className="flex items-center justify-end">
        <button onClick={props?.closeBtn}>handleClose</button>
      </div>
      <div className="flex justify-center items-center h-full text-dark">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            {Object.entries(fillOtp).map(([key, value], index) => (
            <input
              key={key}
              ref={(el: HTMLInputElement | null) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={value}
              inputMode="numeric"
              onChange={(e) => handleChange(e, key, index)}
              className="bg-transparent border p-4 text-center w-12 rounded"
            />
          ))}
          </div>
          <button className="btn">hello</button>
        </form>
      </div>
    </div>
  )
}