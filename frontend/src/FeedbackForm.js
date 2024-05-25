import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const FeedbackForm = (props) => {

    const navigate = useNavigate();

    const [feedback_desc, setFeedbackDesc] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/submit-feedback",
                { feedback_desc, matching_id: props.matchingId });  // Pass matching_id along with feedback
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
                    <Link to="/matching-page">
                        <button
                            className='btn btn-primary mt-3'
                        >Cancel</button>
                    </Link>
                </div>
                <div className='col' align="right">
                    <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)} disabled={submitted}>
                        {submitted ? "Submitted" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FeedbackForm