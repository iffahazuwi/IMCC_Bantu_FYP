import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const FeedbackForm = (props) => {

    const navigate = useNavigate();

    const [feedback_desc, setFeedbackDesc] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [ratings, setRatings] = useState({
        accessibility_rating: "",
        initiation_rating: "",
        communication_rating: "",
        knowledge_rating: "",
        behavior_rating: "",
        friendliness_rating: "",
        effort_rating: "",
        overall_rating: ""
    });

    const handleRatingChange = (question, value) => {
        setRatings({ ...ratings, [question]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Check if any of the rating fields are empty
        const isRatingEmpty = Object.values(ratings).some(value => value === "");
        
        if (isRatingEmpty) {
            alert("Please rate all aspects.");
            return;
        }
    
        try {
            await axios.post("http://localhost:5000/submit-feedback", {
                feedback_desc,
                ...ratings,
                matching_id: props.matchingId
            });
            alert("Feedback submitted.")
            navigate("/matching-page");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Your comments are invalid! Please try again.');
            }
        }
    }    

    return (
        <div className="App">
            <div className="feedback-form-container">
                <h1 className="mb-2" align="left">Feedback Form</h1>
                <h6 className="mb-4">**1 = Strongly Disagree, 5 = Strongly Agree</h6><hr/>
                <div className="rating-container">
                    <div className="row">
                        <div className="col"><label>1. My mentor is accessible and available most of the time.</label></div>
                        <div className="col">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="accessibility_rating" value={value} checked={ratings.accessibility_rating === value} onChange={() => handleRatingChange("accessibility_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className="col"><label>2. My mentor always initiate interactions and reach out to me first.</label></div>
                        <div className="col">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="initiation_rating" value={value} checked={ratings.initiation_rating === value} onChange={() => handleRatingChange("initiation_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className="col"><label>3. My mentor has a good communication skills.</label></div>
                        <div className="col">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="communication_rating" value={value} checked={ratings.communication_rating === value} onChange={() => handleRatingChange("communication_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className="col"><label>4. My mentor is knowledgeable and managed to assist me well with my problems.</label></div>
                        <div className="col">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="knowledge_rating" value={value} checked={ratings.knowledge_rating === value} onChange={() => handleRatingChange("knowledge_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className="col"><label>5. My mentor has a good behavior and attitude.</label></div>
                        <div className="col">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="behavior_rating" value={value} checked={ratings.behavior_rating === value} onChange={() => handleRatingChange("behavior_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className="col"><label>6. My mentor is a kind and friendly person, and I had no pressure being around him/her.</label></div>
                        <div className="col">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="friendliness_rating" value={value} checked={ratings.friendliness_rating === value} onChange={() => handleRatingChange("friendliness_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div><br/>
                    <div className="row">
                        <div className="col"><label>7. My mentor put a lot of effort to try and help me with my concerns.</label></div>
                        <div className="col">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="effort_rating" value={value} checked={ratings.effort_rating === value} onChange={() => handleRatingChange("effort_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div><br/><hr/>
                    <div className="row">
                        <div className="col mt-2"><label><strong>OVERALL RATING: </strong></label></div>
                        <div className="col mt-2">
                        <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} style={{ marginRight: '10px' }}> {/* Add margin-right */}
                                <input type="radio" name="overall_rating" value={value} checked={ratings.overall_rating === value} onChange={() => handleRatingChange("overall_rating", value)} />
                                {value}
                            </label>
                        ))}
                        </div>
                        </div>
                    </div>
                </div>
                <label htmlFor="feedback_desc" className="form-label mt-3">Comments:</label>
                <textarea
                    rows="5"
                    value={feedback_desc}
                    className="form-control"
                    placeholder="Please leave your comments here..."
                    onChange={(e) => setFeedbackDesc(e.target.value)}
                />
                <div className="row">
                    <div className='col' align="left">
                        <Link to="/matching-page">
                            <button
                                className='btn btn-secondary mt-3'
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
        </div>
    )
}

export default FeedbackForm