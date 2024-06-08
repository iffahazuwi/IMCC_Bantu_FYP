import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const Login = (props) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/login",
                { email, password });
            navigate("/home");
            window.location.reload();
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Your email or password are invalid! Please try again.');
            }
        }
    }

    return (
        <div className="App">
            <div className="mt-4" align="right">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdx7CIqp4sqOx4XE5o-x47-tGETkf3F6oHx1PXexMWZ77Phzw/viewform" target="_blank" rel="noopener noreferrer" className="link-btn">Submit Mentor Feedback</a>
            </div>
            {/* <div align="center">
                <img src="./helping-hands.png" alt="" className="logo" />
            </div> */}
            <div className="auth-form-container">
            <h1 className="mt-2" align="center" >Log In</h1>
            <div className="p-3">
                <form className="login-form" onSubmit={handleSubmit}>
            
                    <label className="mb-1" htmlFor="email">USM Email</label>
                    <input  className="mb-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your USM email" id="email" name="email" />
            
                    <label className="mb-1" htmlFor="password">Password</label>
                    <input className="mb-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" id="password" name="password" />

                    <div align="center">
                        <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)}>Login</button>
                    </div>
                
                </form>
                <div className="mt-4" align="center">
                    <Link to="/register" className="link-btn">Click here for Mentor Registration</Link>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Login