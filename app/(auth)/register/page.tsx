'use client';
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ Correct client-side hook
import { useState, ChangeEvent, FormEvent } from "react";
import OtpBox from "@/app/components/OtpBox"
export default function Register() {
    const router = useRouter(); // ✅ Initialize the router
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
                setSteps(2)
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
            {modalOpen ? <div className="mb-3 position-relative" style={{ background: '#000' }}>
                <OtpBox />
            </div> : null}
            <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl backdrop-blur-md border border-white/30 shadow-lg text-black">
                {steps == 1 ? <form onSubmit={sendMail} className="space-y-4">

                    <div>
                        <label htmlFor="email" className="block  font-medium">Email:</label>
                        <input type="email" id="email" name="email" value={register.email} onChange={handleChange} required className="w-full p-2 rounded /20 backdrop-blur " />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600  font-bold py-2 px-4 rounded"> Register </button>
                </form> : <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstname" className="block  font-medium">Firstname:</label>
                        <input type="text" id="firstname" name="firstname" value={register.firstname} onChange={handleChange} required className="w-full p-2 rounded backdrop-blur " />
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block  font-medium">Lastname:</label>
                        <input type="text" id="lastname" name="lastname" value={register.lastname} onChange={handleChange} required className="w-full p-2 rounded backdrop-blur " />
                    </div>
                    <div>
                        <label htmlFor="email" className="block  font-medium">Email:</label>
                        <input type="email" id="email" name="email" disabled value={register.email} required className="w-full p-2 rounded /20 backdrop-blur " />
                    </div>
                    <div>
                        <label htmlFor="password" className="block  font-medium">Password:</label>
                        <input type="password" id="password" name="password" value={register.password} onChange={handleChange} required className="w-full p-2 rounded backdrop-blur " />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block  font-medium">Gender:</label>
                        <select id="gender" name="gender" value={register.gender} onChange={handleChange} className="w-full p-2 rounded backdrop-blur ">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="age" className="block  font-medium">Age:</label>
                        <input type="number" id="age" name="age" value={register.age} onChange={handleChange} required className="w-full p-2 rounded backdrop-blur " />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600  font-bold py-2 px-4 rounded"> Register </button>
                </form>}
            </div>
        </>
    )
}

