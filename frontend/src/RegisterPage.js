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
    const [gender, setGender] = useState("");
    const [country, setCountry] = useState("");
    const [language_1, setLanguage1] = useState("");
    const [language_2, setLanguage2] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            email,
            password,
            name,
            matric_no,
            phone_no,
            school,
            gender,
            country,
            language_1,
            language_2
        };

        try {
            await axios.post("http://localhost:5000/register", data);
            alert("Your account has been registered!");
            navigate("/home");
            window.location.reload();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert('User already exists! Please use your email and password to login.');
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="App">
            <div className="auth-form-container">
            <h1 className="mt-2" align="center" >Mentor Registration</h1>
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

                    <label className="mb-1" htmlFor="gender">Gender</label>
                    <select
                    className="form-select mb-2"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    >
                    <option value="">Please select your gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    </select>

                    <label className="mb-1" htmlFor="country">Origin Country</label>
                    <select
                    className="form-select mb-2"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    >
                    <option value="">Please select your origin country...</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="China">China</option>
                    <option value="Iran">Iran</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Somalia">Somalia</option>
                    <option value="Iraq">Iraq</option>
                    <option value="India">India</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Libya">Libya</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Palestin">Palestin</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Sudan">Sudan</option>
                    <option value="United States of America">United States of America</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Syria">Syria</option>
                    <option value="Romania">Romania</option>
                    <option value="Maritius">Maritius</option>
                    <option value="Russia">Russia</option>
                    <option value="Philippines">Philippines</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Oman">Oman</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Bahrain">Bahrain</option>
                    </select>

                    <label className="mb-1" htmlFor="language_1">Language 1</label>
                    <select
                    className="form-select mb-2"
                    value={language_1}
                    onChange={(e) => setLanguage1(e.target.value)}
                >
                    <option value="">Please select your preferred language...</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Persian Farsi">Persian Farsi</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Thai">Thai</option>
                    <option value="Somali">Somali</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Malay">Malay</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Romanian">Romanian</option>
                    <option value="Creole">Creole</option>
                    <option value="Russian">Russian</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Cantonese">Cantonese</option>
                    <option value="Shona">Shona</option>
                    <option value="Swahili">Swahili</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Korean">Korean</option>
                    <option value="Burmese">Burmese</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Kurdish">Kurdish</option>
                    <option value="Berber">Berber</option>
                    <option value="Ndebele">Ndebele</option>
                    <option value="French">French</option>
                    <option value="Tamil">Tamil</option>
                </select>

                    <label className="mb-1" htmlFor="language_2">Language 2</label>
                    <select
                    className="form-select mb-2"
                    value={language_2}
                    onChange={(e) => setLanguage2(e.target.value)}
                >
                    <option value="">Please select your second preffered language...</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Persian Farsi">Persian Farsi</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Thai">Thai</option>
                    <option value="Somali">Somali</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Malay">Malay</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Romanian">Romanian</option>
                    <option value="Creole">Creole</option>
                    <option value="Russian">Russian</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Cantonese">Cantonese</option>
                    <option value="Shona">Shona</option>
                    <option value="Swahili">Swahili</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Korean">Korean</option>
                    <option value="Burmese">Burmese</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Kurdish">Kurdish</option>
                    <option value="Berber">Berber</option>
                    <option value="Ndebele">Ndebele</option>
                    <option value="French">French</option>
                    <option value="Tamil">Tamil</option>
                </select>
                    
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
        </div>
    )
}

export default Register