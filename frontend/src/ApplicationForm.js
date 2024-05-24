import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const ApplicationForm = (props) => {

    const navigate = useNavigate();

    const [app_gender, setGender] = useState("");
    const [app_country, setCountry] = useState("");
    const [app_language, setLanguage] = useState("");
    const [app_skill, setSkill] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('app_gender', app_gender);
        formData.append('app_country', app_country);
        formData.append('app_language', app_language);
        formData.append('app_skill', app_skill);
        formData.append('file', file);

        try {
            await axios.post("http://localhost:5000/submit-application", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Mentor Application has been submitted!");

            navigate("/user-page");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Unauthorized! Please log in.');
            } else {
                console.error(err);
                alert('An error occurred. Please try again later.');
            }
        }
    }

    return (
        <div className="feedback-form-container">
            <h1 className="mb-2" align="left" >Mentor Application Form</h1>

            <div className="mt-2">
                <label htmlFor="app_gender" className="form-label">Gender</label>
                    <input type="text"
                        value={app_gender}
                        className="form-control"
                        placeholder="Please enter your gender..."
                        onChange={(e) => setGender(e.target.value)}
                    />
                    {/* <select
                    className="form-select"
                    value={app_gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select> */}
                
                <label htmlFor="app_country" className="form-label mt-3">Origin Country</label>
                    <input type="text"
                        value={app_country}
                        className="form-control"
                        placeholder="Please enter your origin country..."
                        onChange={(e) => setCountry(e.target.value)}
                    />
                
                <label htmlFor="app_language" className="form-label mt-3">Language(s)</label>
                    <input type="text"
                        value={app_language}
                        className="form-control"
                        placeholder="Please enter your language(s) used..."
                        onChange={(e) => setLanguage(e.target.value)}
                    />

<               label htmlFor="app_skill" className="form-label mt-3">Skill(s)</label>
                    <input type="text"
                        value={app_skill}
                        className="form-control"
                        placeholder="Please enter your skill(s)..."
                        onChange={(e) => setSkill(e.target.value)}
                    />

                <label htmlFor="file" className="form-label mt-3">Upload your certificate here:</label>
                    <div className="mb-2">
                        <input className="ml-3" type="file" onChange={handleFileChange}></input>
                    </div>
                    
            </div>

            <div className="row mb-3">
                <div className='col' align="left">
                    {/* <button className="btn btn-primary mt-3" onClick={(e) => handleSubmit(e)} >Cancel</button> */}
                    <Link to="/user-page">
                        <button
                            className='btn btn-primary mt-3'
                            //onClick={openFeedbackForm}
                        >Cancel</button>
                    </Link>
                </div>
                <div className='col' align="right">
                    <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)} >Submit</button>
                </div>
            </div>
        </div>
    )
}

export default ApplicationForm