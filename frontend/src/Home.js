import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import axios from './axios';

export default function Home() {

    const [userType, setUserType] = useState('');
    const [isMentor, setIsMentor] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try{
                const response = await axios.get('http://localhost:5000/getUserRole', {withCredentials: true});
                setUserType(response.data.type);
                setIsMentor(response.data.is_mentor);
            } catch (error){
                console.error('Error fetching user role:', error);
            }
        };
    
        fetchUserRole();
    }, []);

    return (
        <div className="app-home">
            <div className="container">
                <h1 align='center'>Home</h1>
                <div className="p-4">
                    <h2 align='center'>
                        {userType === 'student' && isMentor ? (
                            <div>
                                WELCOME TO IMCC BANTU!<br/>
                                <h6>Congratulations! You have been selected as a mentor!
                                Your registration as a mentor has been successful.<br/>
                                You can access the system now.</h6>
                            </div>
                        ) : (
                            <div>
                                WELCOME TO IMCC BANTU!<br/>
                                <h6>You can access the system now.</h6>
                            </div>
                        )}
                    </h2>
                    <p align='center'>
                        Visit
                        <a className="ms-1 me-1" href="https://imcc.usm.my/" target="_blank" rel="noopener noreferrer">https://imcc.usm.my/</a>
                        for more info!
                    </p>
                </div>
            </div>
        </div>
    )
}