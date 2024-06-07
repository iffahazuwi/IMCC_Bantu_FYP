import React, { useState, useEffect } from 'react';
import axios from './axios';

const EditProfile = ({ userData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...userData });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/updateUser`, formData, { withCredentials: true });
            onSave(response.data);
            alert("Profile updated successfully!")
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>
            <div className='col'>
            <label className='row'>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            {formData.matric_no && (
                <>
                    <label className='row'>
                        Matric Number:
                        <input type="text" name="matric_no" value={formData.matric_no} onChange={handleChange} />
                    </label>
                    <label className='row'>
                        School:
                        <input type="text" name="school" value={formData.school} onChange={handleChange} />
                    </label>
                    <label className='row'>
                        Gender:
                        <select
                        name='gender'
                        className="form-select mb-2"
                        value={formData.gender}
                        onChange={handleChange}
                        >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        </select>
                    </label>
                    <label className='row'>
                        Country:
                        <select
                        name='country'
                        className="form-select mb-2"
                        value={formData.country}
                        onChange={handleChange}
                    >
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
                    </label>
                    <label className='row'>
                        Language 1:
                        <select
                        name='language_1'
                        className="form-select mb-2"
                        value={formData.language_1}
                        onChange={handleChange}
                >
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
                    </label>
                    <label className='row'>
                        Language 2:
                        <select
                        name='language_2'
                    className="form-select mb-2"
                    value={formData.language_2}
                    onChange={handleChange}
                >
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
                    </label>
                </>
            )}
            <label className='row'>
                Phone Number:
                <input type="text" name="phone_no" value={formData.phone_no} onChange={handleChange} />
            </label>
            <label className='row'>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            </div>
            <div className='row mt-3'>
                <div className='col'><button type="button" className='btn btn-secondary' onClick={onCancel}>Cancel</button></div>
                <div className='col'><button type="submit" className='btn btn-success'>Save</button></div>
            </div>
        </form>
    );
};

export default EditProfile;