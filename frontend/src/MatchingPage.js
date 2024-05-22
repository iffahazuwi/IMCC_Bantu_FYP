// import './App.css';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from './axios';

export default function MatchingPage() {

    const [userType, setUserType] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try{
                const response = await axios.get('http://localhost:5000/getUserRole', {withCredentials: true});
                setUserType(response.data.type);
            } catch (error){
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);
    // const [feedbacks, submitFeedbacks] = useState([])

    // useEffect(() => {
    //     fetch('http://127.0.0.1:5000/community-page/get', {
    //         'method': 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(resp => resp.json())
    //         .then(resp => setArticles(resp))
    //         .catch(error => console.log(error))
    // }, [])

    // const openForm = () => {
    //     submitFeedbacks({ comment: '' })
    // }

    // const insertedFeedback = (feedback) => {
    //     const new_feedbacks = [...feedbacks, feedback]
    //     submitFeedbacks(new_feedbacks)
    // }

    // const openFeedbackForm = () => {
    //     <FeedbackForm />
    // }

    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>Matching Page</h1>
            </div>
            {userType === 'student' ? (<div>
            <div className='row'>
                <h3 className='mb-3'>Current Status: </h3>
            </div>
            <hr />
            <div>
                <h5 className="mb-3">Matching process has completed!<br />
                    Details of your resulted partner is provided as below:</h5>
                <div className="border border-dark rounded p-3">
                    <h3>Name: </h3>
                    <h3>School: </h3>
                    <h3>Contact Number: </h3>
                    <h3>Email Address: </h3>
                </div>
            </div>
            <hr />
            <div align="center">
                <Link to="/matching-page/feedback-form">
                    <button
                        className='btn btn-success'
                    //onClick={openFeedbackForm}
                    >Submit Feedback</button>
                </Link>
            </div></div>) : (<div className='feedback-form-container'>
                <h2 className="mb-2" align="left" >Matching History List</h2></div>)}
            
            {/* <div align='center'>
                <button
                    className='btn btn-success'
                    //onClick={openFeedbackForm}
                >Submit Feedback</button>
            </div> */}
        </div>
    );
}