import React, { useState, useEffect  } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';
import { Modal, Button, Form } from 'react-bootstrap';

const MentorFeedback = (props) => {

    const [userType, setUserType] = useState('');
    const [mentorMatches, setMentorMatches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [modalTitle, setModalTitle] = useState('');
    const [matchingId, setMatchingId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userTypeResponse = await axios.get('http://localhost:5000/getUserRole', { withCredentials: true });
            setUserType(userTypeResponse.data.type);
    
            // Assuming userTypeResponse.data.type contains 'mentor'
            if (userTypeResponse.data.type === 'student') {
                const matchesResponse = await axios.get(`http://localhost:5000/getMentorMatches?mentor_id=${userTypeResponse.data.id}`, { withCredentials: true });
                setMentorMatches(matchesResponse.data);
            }
    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };    

    const viewFile = async (matchingId) => {
        try {
            const response = await axios.get(`http://localhost:5000/getFeedback/${matchingId}`, { withCredentials: true });
            const allNullValues = Object.values(response.data).every(value => value === null);
    
            if (allNullValues) {
                alert('No feedback submitted from this client.');
            } else {
                setFeedback(response.data);
                setModalTitle(`Feedback Submitted`);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            alert('No feedback found for this match.');
        }
    };

    const handleClose = () => setShowModal(false);

    const getBadgeColor = (rating) => {
        switch (rating) {
            case 1:
                return 'bg-danger'; // red
            case 2:
                return 'bg-orange'; // orange
            case 3:
                return 'bg-yellow'; // yellow (Bootstrap doesn't have a default yellow class, you might need to add custom CSS)
            case 4:
                return 'bg-green'; // light green
            case 5:
                return 'bg-success'; // dark green (Bootstrap doesn't have a default dark green class, you might need to add custom CSS)
            default:
                return 'bg-secondary';
        }
    };

    const getButtonColor = (rating) => {
        switch (rating) {
            case 1:
                return 'btn-danger'; // red
            case 2:
                return 'btn-danger'; // orange
            case 3:
                return 'btn-warning'; // yellow (Bootstrap doesn't have a default yellow class, you might need to add custom CSS)
            case 4:
                return 'btn-success'; // light green
            case 5:
                return 'btn-success'; // dark green (Bootstrap doesn't have a default dark green class, you might need to add custom CSS)
            default:
                return 'btn-secondary';
        }
    };

    return (
        <div className="App">
            <div className="feedback-form-container">
            <div className='row'>
            <div><h2 className="mb-2" align="left">Matching History List</h2></div>
            <div className='col-12 mt-3'>
                <table className="table table-bordered border-dark">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>No.</th>
                            <th style={{ textAlign: 'center' }}>Client Name</th>
                            <th style={{ textAlign: 'center' }}>Client Matric No.</th>
                            <th style={{ textAlign: 'center' }}>Client Phone No.</th>
                            <th style={{ textAlign: 'center' }}>Client Email</th>
                            <th style={{ textAlign: 'center' }}>Feedback Form</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mentorMatches.map((match, index) => (
                            <tr key={match.matching_id}>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ textAlign: 'center' }}>{match.client_name}</td>
                                <td style={{ textAlign: 'center' }}>{match.client_matric_no}</td>
                                <td style={{ textAlign: 'center' }}>{match.client_phone_no}</td>
                                <td style={{ textAlign: 'center' }}>{match.client_email}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        className={`btn btn-sm ${getButtonColor(match.overall_rating)}`}
                                        onClick={() => viewFile(match.matching_id)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link to="/matching-page">
                    <button
                        className='btn btn-secondary mb-3 ms-3 fixed-bottom'
                    >Back</button>
                </Link>
            </div>
            
            <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="">
                    {[{
                        question: '1. My mentor is accessible and available most of the time:',
                        rating: feedback.accessibility_rating,
                    }, {
                        question: '2. My mentor always initiate interactions and reach out to me first:',
                        rating: feedback.initiation_rating,
                    }, {
                        question: '3. My mentor has a good communication skills:',
                        rating: feedback.communication_rating,
                    }, {
                        question: '4. My mentor is knowledgeable and managed to assist me well with my problems:',
                        rating: feedback.knowledge_rating,
                    }, {
                        question: '5. My mentor has a good behavior and attitude:',
                        rating: feedback.behavior_rating,
                    }, {
                        question: '6. My mentor is a kind and friendly person, and I had no pressure being around him/her:',
                        rating: feedback.friendliness_rating,
                    }, {
                        question: '7. My mentor put a lot of effort to try and help me with my concerns:',
                        rating: feedback.effort_rating,
                    }].map(({ question, rating }, index) => (
                        <div className="row mb-3" key={index}>
                            <div className="col-md-10">
                                <strong>{question}</strong>
                            </div>
                            <div className="col-md-2 text-end">
                                <span className="badge bg-primary">{rating}/5</span>
                            </div>
                        </div>
                    ))}
                    <hr />
                    <div className="row mb-3">
                        <div className="col-md-10">
                            <strong>OVERALL RATING:</strong>
                        </div>
                        <div className="col-md-2 text-end">
                            <span className={`badge ${getBadgeColor(feedback.overall_rating)}`}>{feedback.overall_rating}/5</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <p><strong>Comment:</strong> {feedback.feedback_desc}</p>
                    </div>
                    <div>
                        <p><strong>Date:</strong> {feedback.feedback_date}</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
        </div>
        </div>
    )
}

export default MentorFeedback