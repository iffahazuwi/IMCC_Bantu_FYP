import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const FeedbackForm = (props) => {

    const navigate = useNavigate();

    const [feedback_desc, setFeedbackDesc] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/submit-feedback",
                { feedback_desc });
            alert("Feedback submitted.")

            navigate("/matching-page");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Your comments are invalid! Please try again.');
            }
        }
    }

    return (
        <div className="feedback-form-container">
            <h1 className="mb-2" align="left" >Feedback Form</h1>
            <label htmlFor="feedback_desc" className="form-label mt-2">Comments:</label>
                    <textarea
                        rows="5"
                        value={feedback_desc}
                        className="form-control"
                        placeholder="Please leave your commments here..."
                        onChange={(e) => setFeedbackDesc(e.target.value)}
                    />
            <div className="row">
                <div className='col' align="left">
                    {/* <button className="btn btn-primary mt-3" onClick={(e) => handleSubmit(e)} >Cancel</button> */}
                    <Link to="/matching-page">
                        <button
                            className='btn btn-primary mt-3'
                            //onClick={openFeedbackForm}
                        >Cancel</button>
                    </Link>
                </div>
                <div className='col' align="right">
                    <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)} >Submit</button>
                </div>
            </div>
        </div>
    )
}

export default FeedbackForm

// import React, { useState, useEffect } from 'react'
// import APIService from './components/APIService'

// export default function FeedbackForm() {
//     <h1>Feedback Form Test</h1>
// }

// function FeedbackForm(props){

//     const [comment, setComment] = useState('')

//     useEffect(() => {
//         setComment(props.feedback.comment)
//     }, [props.feedback])

//     const submitFeedback = () => {
//         APIService.SubmitFeedback({ comment })
//             .then(resp => props.submitFeedback(resp))
//             .catch(error => console.log(error))
//     }

//     return (
//         <div>
//             {props.feedback ? (
//                 <div className="mb-3">

//                     <label htmlFor="comment" className="form-label mt-2">Overall Comment</label>
//                     <textarea
//                         rows="5"
//                         value={comment}
//                         className="form-control"
//                         placeholder="Please Enter Comment for This Mentor"
//                         onChange={(e) => setComment(e.target.value)}
//                     />
//                     <div align='center'>
//                         <button
//                             className="btn btn-success mt-3"
//                             onClick={submitFeedback}
//                         >Submit</button>
//                     </div>
//                 </div>
//             ) : null}
//         </div>
//     )
// }

