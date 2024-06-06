import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import axios from './axios';
import EditProfile from './EditProfile';

const UserPage = () => {

    const [userType, setUserType] = useState('');
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const logoutUser = async () => {
        await axios.post("//localhost:5000/logout");
        window.location.href = "/";
    }

    useEffect(() => {

        async function fetchUserProfile() {
            try {
                const resp = await axios.get("//localhost:5000/@me");
                setUserData(resp.data);
              } catch (error) {
                console.log("Not authenticated");
              }
        }

        const fetchUserRole = async () => {
            try{
                const response = await axios.get('http://localhost:5000/getUserRole', {withCredentials: true});
                setUserType(response.data.type);
            } catch (error){
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
        fetchUserProfile();

    }, []);

    const handleSave = async (updatedData) => {
        if (!window.confirm('Are you sure you want save changes?')) {
            return;
        }
        try {
            const response = await axios.put("//localhost:5000/updateUser", updatedData);
            setUserData(response.data.user);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>User Page</h1>
            </div>
            <div>
                <div className='row'>
                    {userType === 'student' ? (<div className="mb-4 col" align='left'>
                        {userData && !userData.is_mentor && (
                            <Link to="/user-page/application-form">
                            <button
                                className='btn btn-success'
                            >Mentor Application Form</button>
                            </Link>
                        )}
                    </div>) : (<div className="mb-4 col" align='left'>
                        <Link to="/user-page/application-list">
                            <button
                                className='btn btn-success'
                            >View Mentor Application</button>
                        </Link>
                    </div>)}
                    
                    {/* <div className="mb-4 col" align='right'>
                        <Link to="/user-page/notifications">
                            <button
                                className='btn btn-primary'
                                // onClick={openForm}
                            >Notification</button>
                        </Link>   
                    </div> */}
                </div>
                <div align='center'>
                <div className='user-profile border border-dark rounded' align='center'>
                    {/* <img className='border border-dark mb-4' src="./user-128.png" alt="" width={120} height={120} /> */}
                    {isEditing ? (
                            <EditProfile userData={userData} onSave={handleSave} onCancel={handleCancel} />
                        ) : (
                            userData && (
                                <>
                                    <h4><strong>Name:</strong> {userData.name}</h4>
                                    {userType === 'student' && 
                                    (<div><h4><strong>Matric Number:</strong> {userData.matric_no}</h4>
                                    <h4><strong>School:</strong> {userData.school}</h4></div>)}
                                    <h4><strong>Contact Number:</strong> {userData.phone_no}</h4>
                                    <h4><strong>Email Address:</strong> {userData.email}</h4>
                                    {userType === 'student' && 
                                    <div><h4><strong>Gender:</strong> {userData.gender}</h4>
                                    <h4><strong>Origin Country:</strong> {userData.country}</h4>
                                    <h4><strong>Language(s):</strong> {userData.language_1}, {userData.language_2}</h4>
                                    <h4><strong>Mentor Status:</strong> {userData.is_mentor ? 'Yes' : 'No'}</h4></div>}
                                </>
                            )
                        )}
                        {!isEditing && (
                            <div className='mt-3' align='center'>
                                <button className='btn btn-link' onClick={() => setIsEditing(true)}>Edit Profile</button>
                            </div>
                        )}
                </div>
                </div>
                <hr />
                <div className="p-4" align='center'>
                    <button
                        className='btn btn-danger'
                        onClick={logoutUser}
                    >Log Out</button>
                </div>
            </div>
        </div>
    );
}

export default UserPage;