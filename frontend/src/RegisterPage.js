import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const Register = (props) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [matric_no, setMatricNumber] = useState("");
    const [phone_no, setPhoneNumber] = useState("");
    const [school, setSchool] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/register",
                { email, password, name, matric_no, phone_no, school});
            alert("Your account has been registered!")

            navigate("/home");
        } catch (err) {
            if (err.response && err.response.status === 400) {
                alert('User already exist! Please use your email and password to login.');
            }
        }
    }; 

    return (
        <div className="auth-form-container">
            <h1 className="mt-2" align="center" >Register New User</h1>
            <div className="p-3">
                <form className="register-form">

                    <label className="mb-1" htmlFor="name">Full Name</label>
                    <input className="mb-2"value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Please enter your full name..." />
            
                    <label className="mb-1" htmlFor="matric_no">Matric Number</label>
                    <input className="mb-2" value={matric_no} onChange={(e) => setMatricNumber(e.target.value)} id="matric_no" placeholder="Please enter your matric number..." />
            
                    <label className="mb-1" htmlFor="school">School</label>
                    <input className="mb-2" value={school} onChange={(e) => setSchool(e.target.value)} id="school" placeholder="Please enter your school..." />
                    
                    <label className="mb-1" htmlFor="phone_no">Phone Number</label>
                    <input className="mb-2"value={phone_no} onChange={(e) => setPhoneNumber(e.target.value)} id="phone_no" placeholder="Please enter your phone number..." />
                    
                    <label className="mb-1" htmlFor="email">USM Student Email</label>
                    <input className="mb-2" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Please enter your student email..." />
            
                    <label className="mb-1" htmlFor="password">Password</label>
                    <input className="mb-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Please enter your password..." />

                    <div align="center">
                        <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)} >Register</button>
                    </div>
                    
                </form>
                <div className="mt-4" align="center">
                    <Link to="/" className="link-btn" >Return to Login Page</Link>
                </div>
            </div>
        </div>
    )
}

export default Register