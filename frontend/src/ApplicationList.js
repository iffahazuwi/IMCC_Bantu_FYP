import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import axios from './axios';

export default function ApplicationList() {

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
    try {
        const response = await axios.get('http://localhost:5000/get-applications', { withCredentials: true });
        setApplications(response.data);
        } catch (error) {
        console.error("Error fetching applications:", error);
    }
    };

    const viewFile = (filename) => {
        window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
    };

    return (
        <div>
            <div className="feedback-form-container">
                <h1 className="mb-2" align="left" >Mentor Application List</h1>
                <div >
                    {applications.map((app) => (
                    <h5 className='mt-2' key={app.app_id}>
                        {app.user_name} - {app.app_date}
                        <button className='btn btn-success btn-sm' onClick={() => viewFile(app.app_filename)}>View File</button>
                    </h5>
                    ))}
                </div>
                    
                <Link to="/user-page">
                    <button
                        className='btn btn-primary mb-3 ms-3 fixed-bottom'
                        //onClick={openFeedbackForm}
                    >Back</button>
                </Link>
            </div>
        </div>
    );
}