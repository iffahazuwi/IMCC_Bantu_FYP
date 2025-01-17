import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const ApplicationForm = (props) => {

    const navigate = useNavigate();

    const [app_gender, setGender] = useState("");
    const [app_country, setCountry] = useState("");
    const [app_language, setLanguage] = useState("");
    const [app_language_2, setLanguage2] = useState("");
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
        formData.append('app_language_2', app_language_2);
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
        <div className="App">
            <div className="feedback-form-container">
            <h1 className="mb-2" align="left" >Mentor Application Form</h1>

            <div className="mt-2">
                <label htmlFor="app_gender" className="form-label">Gender</label>
                    <input type="text"
                        value={app_gender}
                        className="form-control"
                        placeholder="State you gender"
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
                </select> */}
                
                <label htmlFor="app_country" className="form-label mt-3">Origin Country</label>
                <input type="text"
                        value={app_country}
                        className="form-control"
                        placeholder="State you origin country"
                        onChange={(e) => setCountry(e.target.value)}
                    />
                {/* <select
                    className="form-select"
                    value={app_country}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Select Origin Country</option>
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
                </select> */}
                
                <label htmlFor="app_language" className="form-label mt-3">Language 1</label>
                <input type="text"
                        value={app_language}
                        className="form-control"
                        placeholder="State you first language"
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                {/* <select
                    className="form-select"
                    value={app_language}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Select First Preffered Language</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Persian Farsi">Persian Farsi</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Thai">Thai</option>
                    <option value="Somali">Somali</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Malay">Malay</option>
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
                </select> */}

                <label htmlFor="app_language_2" className="form-label mt-3">Language 2</label>
                <input type="text"
                        value={app_language_2}
                        className="form-control"
                        placeholder="State you second language"
                        onChange={(e) => setLanguage2(e.target.value)}
                    />
{/* <select
                    className="form-select"
                    value={app_language_2}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Select Second Preffered Language</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Persian Farsi">Persian Farsi</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Thai">Thai</option>
                    <option value="Somali">Somali</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Malay">Malay</option>
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
                </select> */}

                <label htmlFor="app_skill" className="form-label mt-3">Skill(s)</label>
                    <input type="text"
                        value={app_skill}
                        className="form-control"
                        placeholder="State the skills you are capable of"
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
                            className='btn btn-secondary mt-3'
                            //onClick={openFeedbackForm}
                        >Cancel</button>
                    </Link>
                </div>
                <div className='col' align="right">
                    <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)} >Submit</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default ApplicationForm