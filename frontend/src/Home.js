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

    // document.addEventListener("DOMContentLoaded", function(){
    //     var element = document.getElementById('background');
    //     element.style.backgroundImage = "url(C:/Users/USER/IMCC_Bantu_FYP/frontend/public/1-37d4acdd.jpeg)";
    //     element.style.backgroundSize = "cover";
    //     element.style.backgroundPosition = "center";
    //     element.style.backgroundRepeat = "no-repeat";
    // })

    return (
        <div className="app-home">
            <div className='col'>
            <h1 className="mb-3 mt-3" align='center'>Home</h1>
            <div className="p-4">
                <h2 className="welcome-page" align='center'>
                    {userType === 'student' && isMentor ? (
                        <div>
                            WELCOME TO IMCC BANTU!<br/>
                            <h6>Congratulations! You have been selected as a mentor!
                            Your registration as a mentor have been successful.<br/>
                            You can access the system now.</h6>
                        </div>
                    ) : (
                        <div>
                            WELCOME TO IMCC BANTU!<br/>
                            <h6>You can access the system now.</h6>
                        </div>
                    )}
                    
                    {/* IMCC Bantu: Match Made in Heaven is a system developed to help international students of USM
                    to connect with volunteers among the USM students as the mentors. The aim of developing
                    this system is to guide international students solving their problems and let them have
                    a great experience studying in USM. */}
                </h2>
                <p align='center'>
                    Visit
                    <a className="ms-1 me-1" href="https://imcc.usm.my/" target="_blank">https://imcc.usm.my/</a>
                    for more info!
                </p>
            </div>
        </div>
        </div>
    )
}