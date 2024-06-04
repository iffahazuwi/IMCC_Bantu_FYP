import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const SubmitMentorFeedback = (props) => {
    const navigate = useNavigate();

    const [feedback_desc, setFeedbackDesc] = useState("");
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
        // Fetch clients and mentors
        const fetchClientsAndMentors = async () => {
            const clientsResponse = await axios.get("/get-clients");
            const mentorsResponse = await axios.get("/get-mentors");
            setClients(clientsResponse.data);
            setMentors(mentorsResponse.data);
        };
        fetchClientsAndMentors();
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
                feedback_desc,
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
                <select
                    id="client"
                    className="form-control"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="mentor" className="form-label mt-2">Mentor:</label>
                <select
                    id="mentor"
                    className="form-control"
                    value={selectedMentor}
                    onChange={(e) => setSelectedMentor(e.target.value)}
                >
                    <option value="">Select Mentor</option>
                    {mentors.map((mentor) => (
                        <option key={mentor.id} value={mentor.id}>
                            {mentor.name}
                        </option>
                    ))}
                </select>

                {[
                    "accessibility",
                    "initiation",
                    "communication",
                    "knowledge",
                    "behavior",
                    "friendliness",
                    "effort",
                    "overall"
                ].map((rating) => (
                    <div key={rating} className="form-group mt-3">
                        <label htmlFor={rating} className="form-label">
                            {`My mentor is ${
                                rating === "overall" ? "Overall" : rating.charAt(0).toUpperCase() + rating.slice(1)
                            }`}
                        </label>
                        <select
                            id={rating}
                            name={rating}
                            className="form-control"
                            value={ratings[rating]}
                            onChange={handleRatingChange}
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                <label htmlFor="feedback_desc" className="form-label mt-2">Comments:</label>
                <textarea
                    rows="5"
                    value={feedback_desc}
                    className="form-control"
                    placeholder="Please leave your comments here..."
                    onChange={(e) => setFeedbackDesc(e.target.value)}
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
