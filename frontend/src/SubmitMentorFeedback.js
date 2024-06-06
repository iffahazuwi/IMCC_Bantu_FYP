import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const SubmitMentorFeedback = (props) => {
    const navigate = useNavigate();

    const [feedback_comment, setFeedbackComment] = useState("");
    const [clients, setClients] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedMentor, setSelectedMentor] = useState("");
    const [ratings, setRatings] = useState({
        accessibility: 1,
        initiation: 1,
        communication: 1,
        knowledge: 1,
        behavior: 1,
        friendliness: 1,
        effort: 1,
        overall: 1,
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        
    }, []);

    const handleRatingChange = (e) => {
        const { name, value } = e.target;
        setRatings((prevRatings) => ({
            ...prevRatings,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/submit-mentor-feedback", {
                feedback_comment,
                matching_id: props.matchingId,
                ratings,
            });
            alert("Feedback submitted.");
            setSubmitted(true);
            navigate("/");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Your comments are invalid! Please try again.');
            }
        }
    };

    return (
        <div className="App">
            <div className="feedback-form-container">
                <h1 className="mb-2" align="left">Feedback Form</h1>
                <label htmlFor="client" className="form-label mt-2">Client:</label>
                <input type="text"
                    // value={fb_client}
                    className="form-control"
                    placeholder="Insert student's name"
                />
                <label htmlFor="mentor" className="form-label mt-2">Mentor:</label>
                <input type="text"
                    // value={fb_mentor}
                    className="form-control"
                    placeholder="Insert mentor's name"
                />

                {["My mentor is accessible and available most of the time.",
                 "My mentor always initiate interactions and reach out to me first.", 
                 "My mentor has a good communication skills.", 
                 "My mentor is knowledgable and managed to assist me well with my problems.", 
                 "My mentor has a good behavior and attitude.", 
                 "My mentor is a kind and friendly person, and I had no pressure being around him/her.", 
                 "My mentor put a lot of effort to try and help me with my concerns.", 
                 "Overall Rating"].map((rating) => (
    <div key={rating} className="form-group mt-3">
        <label htmlFor={rating} className="form-label">
            {` ${
                rating === "overall" ? "Overall" : rating.charAt(0) + rating.slice(1)
            }`}
        </label>
        <div className="rating-scale">
            {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="radio-inline">
                    <input
                        type="radio"
                        name={rating}
                        value={num}
                        checked={ratings[rating] === num}
                        onChange={handleRatingChange}
                    /> {num}
                </label>
            ))}
        </div>
    </div>
))}

                <label htmlFor="feedback_comment" className="form-label mt-2">Comments:</label>
                <textarea
                    rows="5"
                    value={feedback_comment}
                    className="form-control"
                    placeholder="Please leave your comments here..."
                    onChange={(e) => setFeedbackComment(e.target.value)}
                />
                <div className="row">
                    <div className='col' align="left">
                        <Link to="/">
                            <button className='btn btn-secondary mt-3'>Cancel</button>
                        </Link>
                    </div>
                    <div className='col' align="right">
                        <button className="btn btn-success mt-3" onClick={handleSubmit} disabled={submitted}>
                            {submitted ? "Submitted" : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitMentorFeedback;
