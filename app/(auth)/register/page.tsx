'use client';
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ Correct client-side hook
import { useState, ChangeEvent, FormEvent } from "react";
import OtpBox from "@/app/components/authentication/OtpBox"
 export default function Register() {
    const router = useRouter(); // ✅ Initialize the router
    const [register, setRegister] = useState({
        firstname: "",
        lastname: "",
        age: 0,
        email: "neymar@gmail.com",
        gender: "",
        password: ""
    });
    const closeButton = ()=>{        
        setModalOpen(false);
    }
    const [steps, setSteps] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegister(prev => ({
            ...prev,
            [name]: name === 'age' ? Number(value) : value
        }));
    };
    const sendMail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/sendOtp', {
                email: register.email,
            }   , {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(res.status == 200);
            if (res.status === 200) {
                
                setModalOpen(true);
            }
        } catch (error) {
            console.log(error);

        }
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/register', register, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(response);
            if (response.status == 200) {
                router.push('/login'); // ✅ Correct client-side navigation
            }
        } catch (error) {
            console.log(error, 'error');
        }
    }
    return (
       <>
  {/* OTP Modal */}
  {modalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-sm mx-auto p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl">
        <OtpBox closeBtn={closeButton} email={register.email} setSteps={setSteps} />
      </div>
    </div>
  )}

  {/* Registration Form */}
  <div className="max-w-md mx-auto mt-10 p-8 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl text-black">
    {steps === 1 ? (
      <form onSubmit={sendMail} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={register.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg shadow transition">
          Register
        </button>
      </form>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="firstname" className="block text-white font-medium mb-1">Firstname:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={register.firstname}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-white font-medium mb-1">Lastname:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={register.lastname}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter your last name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={register.email}
            disabled
            required
            className="w-full p-3 rounded-lg bg-white/40 text-black placeholder:text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-white font-medium mb-1">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={register.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Create a password"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-white font-medium mb-1">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={register.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/70 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="age" className="block text-white font-medium mb-1">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={register.age}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter your age"
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg shadow transition">
          Register
        </button>
      </form>
    )}
  </div>
</>

    )
}

