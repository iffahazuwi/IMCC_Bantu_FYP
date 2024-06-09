import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplyForm = () => {
    const [formData, setFormData] = useState({
        form_name: '',
        form_ic: '',
        form_matric_no: '',
        form_programme: '',
        form_school: '',
        form_country: '',
        form_languages: '',
        form_phone_no: '',
        form_email: '',
        form_allergies: ''
    });

    const [isValid, setIsValid] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const isFormFilled = Object.values(formData).every(value => value.trim() !== '');
        const isMatricNoValid = /^\d{6}$/.test(formData.form_matric_no);
        const isPhoneNoValid = formData.form_phone_no.startsWith('+');
        const isEmailValid = formData.form_email.endsWith('@student.usm.my');
        
        setIsValid(isFormFilled && isMatricNoValid && isPhoneNoValid && isEmailValid);
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) {
            alert('Please fill in all fields correctly.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/submit-form', formData);
            alert(response.data.message);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to submit form');
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className='App pb-1'>
            <div className="container mt-5">
                <div className="card">
                    <div className="card-header">
                        <h2>Mentor Application Form</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="form_name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_name"
                                    name="form_name"
                                    value={formData.form_name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_ic">IC</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_ic"
                                    name="form_ic"
                                    value={formData.form_ic}
                                    onChange={handleChange}
                                    placeholder="Enter your IC"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_matric_no">Matric No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_matric_no"
                                    name="form_matric_no"
                                    value={formData.form_matric_no}
                                    onChange={handleChange}
                                    placeholder="Enter your matric number"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_programme">Programme</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_programme"
                                    name="form_programme"
                                    value={formData.form_programme}
                                    onChange={handleChange}
                                    placeholder="Enter your programme"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_school">School</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_school"
                                    name="form_school"
                                    value={formData.form_school}
                                    onChange={handleChange}
                                    placeholder="Enter your school"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_country">Country</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_country"
                                    name="form_country"
                                    value={formData.form_country}
                                    onChange={handleChange}
                                    placeholder="Enter your country"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_languages">Languages</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_languages"
                                    name="form_languages"
                                    value={formData.form_languages}
                                    onChange={handleChange}
                                    placeholder="Enter languages you speak"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_phone_no">Phone No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_phone_no"
                                    name="form_phone_no"
                                    value={formData.form_phone_no}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    onBlur={(e) => {
                                        if (!formData.form_phone_no.startsWith('+')) {
                                            setFormData({ ...formData, form_phone_no: '+' + formData.form_phone_no });
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="form_email"
                                    name="form_email"
                                    value={formData.form_email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="form_allergies">Allergies</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="form_allergies"
                                    name="form_allergies"
                                    value={formData.form_allergies}
                                    onChange={handleChange}
                                    placeholder="Enter any allergies"
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                <button type="submit" className="btn btn-success" disabled={!isValid}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyForm;