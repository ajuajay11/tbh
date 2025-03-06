"use client"
import { registerUser } from "../../../services/Services";
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter()

  const registerData = {
    email: "ss@gmail.com",
    firstname: "aj",
    lastname: "kri",
    profilePicture: "",
    age: "11",
    gender: "male",
    password: "Ajay@123"
  }
  
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const res = await registerUser(registerData);
      if (res) {
        console.log('User registered successfully');
        router.push('/auth/login')
      }
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <>
      <div className="mt-5 vh-100 container-fluid">
        <div className="row justify-content-center">
          <div className="col-5">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" onChange={(e) => (registerData.email = e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">firstname</label>
                <input type="text" className="form-control" id="firstname" placeholder="Enter password" onChange={(e) => (registerData.firstname = e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">lastname</label>
                <input type="text" className="form-control" id="lastname" placeholder="Enter password" onChange={(e) => (registerData.lastname = e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Age</label>
                <input type="text" className="form-control" id="age" placeholder="Enter age" onChange={(e) => (registerData.age = e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Gender</label>
                <select id="gender" value={registerData.gender} onChange={(e) => (registerData.gender = e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter Password" onChange={(e) => (registerData.password = e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}