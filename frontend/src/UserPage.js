import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import axios from './axios';

const UserPage = () => {

    const [userType, setUserType] = useState('');
    const [userData, setUserData] = useState(null);

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

    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>User Page</h1>
            </div>
            <div>
                <div className='row'>
                    {userType === 'student' ? (<div className="mb-4 col" align='left'>
                        <Link to="/user-page/application-form">
                            <button
                                className='btn btn-success'
                                // onClick={openForm}
                            >Mentor Application Form</button>
                        </Link>
                    </div>) : (<div className="mb-4 col" align='left'>
                        <Link to="/user-page/application-list">
                            <button
                                className='btn btn-success'
                                // onClick={openForm}
                            >View Mentor Application</button>
                        </Link>
                    </div>)}
                    
                    <div className="mb-4 col" align='right'>
                        <Link to="/user-page/notifications">
                            <button
                                className='btn btn-primary'
                                // onClick={openForm}
                            >Notification</button>
                        </Link>   
                    </div>
                </div>
                <div className='mb-4 border border-dark rounded p-3' align='center'>
                    <img className='border border-dark mb-4' src="./user-128.png" alt="" width={120} height={120} />
                    {userData && (
                        <>
                            <h4><strong>Name:</strong> {userData.name}</h4>
                            {userType === 'student' && 
                            (<div><h4><strong>Matric Number:</strong> {userData.matric_no}</h4>
                            <h4><strong>School:</strong> {userData.school}</h4></div>)}
                            <h4><strong>Contact Number:</strong> {userData.phone_no}</h4>
                            <h4><strong>Email Address:</strong> {userData.email}</h4>
                            {userType === 'student' && <div><h4><strong>Mentor Status:</strong> {userData.is_mentor ? 'Yes' : 'No'}</h4></div>}
                        </>
                    )}
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

// import './App.css';
// import { Link } from "react-router-dom"

// export default function UserPage(props) {
//     return (
//         <div className="App">
//             {props.users && props.users.map(user => {
//                 return (
//                     <div key={user.id}>
                    
//                     <div className='col mb-3' align='center'>
//                         <h1>User Page</h1>
//                     </div>
//                     <div className='col'/>
//                         <div className="mb-4" align='right'>
//                             <Link to="/user-page/notifications">
//                             <button
//                                 className='btn btn-primary'
//                                 // onClick={openForm}
//                             >Notification</button>
//                             </Link>   
//                         </div>
//                     <div className='mb-4' align='center'>
//                         <img className='border mb-4' src="./user-128.png" alt="" width={120} height={120} />
//                         <h3>Name: {user.name}</h3>
//                         <h3>Matric Number: {user.matric_no}</h3>
//                         <h3>Contact Number: {user.phone_no}</h3>
//                         <h3>Email Address: {user.email}</h3>
//                         <h3>School: {user.school}</h3>
//                     </div>
//                     <hr />
//                     <div className="mb-2" align='center'>
//                         <Link to="/user-page/application-form">
//                         <button
//                             className='btn btn-success'
//                             // onClick={openForm}
//                         >Mentor Application Form</button>
//                         </Link>
//                     </div>
//                 </div>
//                 )
//             })}  
//         </div>
//     )
// }