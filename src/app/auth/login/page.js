"use client"
import Cookies from 'js-cookie';
import { loginUser } from "../../../services/Services";
import Link from 'next/link';

export default function Login() {
  const loginData = {
    email: "",
    password: ""
  }
  const handleSubmit = async (event) => {
    try {
      event.preventDefault(); // Prevent default form submission
      const res = await loginUser(loginData);
      if (res) {
        Cookies.set('token', res.user.token, { expires: 12 }); // Expires in 7 days
      } else {
        // Handle login error
        console.error('Login failed');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <main>
        <div className="container-fluid vh-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-5 d-flex flex-column align-items-center justify-content-center">
              <h2>Hei Champ..</h2>
              <p>Welcome back, human. Let's create some videos.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input name="email" type="email" className="form-control bg-transparent" id="email"
                    aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => (loginData.email = e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input name="password" type="password" className="form-control bg-transparent" id="password" aria-describedby="passwordHelp"
                    placeholder="Enter password" onChange={(e) => (loginData.password = e.target.value)} // Update email
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
              <div> <Link href="/auth/register">register</Link></div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}