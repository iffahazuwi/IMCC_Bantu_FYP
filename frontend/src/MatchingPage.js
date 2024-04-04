// import './App.css';
// import { useState } from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import FeedbackForm from './components/FeedbackForm';
import { Route } from 'react-router-dom'

export default function MatchingPage() {
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
            <div className='row'>
                <h3 className='mb-3'>Current Status: </h3>
            </div>
            <hr />
            <div>
                <h5 className="mb-3">Matching process has completed!<br />
                    Details of your resulted partner is provided as below:</h5>
                <div className="border p-3">
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
            </div>
            {/* <div align='center'>
                <button
                    className='btn btn-success'
                    //onClick={openFeedbackForm}
                >Submit Feedback</button>
            </div> */}
        </div>
    );
}