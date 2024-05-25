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
            setFeedback(response.data);
            setModalTitle(`Feedback Submitted`);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            alert('No feedback found for this match.');
        }
    };

    const handleClose = () => setShowModal(false);

    return (
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
                                    <button className='btn btn-success btn-sm' onClick={() => viewFile(match.matching_id)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link to="/matching-page">
                    <button
                        className='btn btn-primary mb-3 ms-3 fixed-bottom'
                    >Back</button>
                </Link>
            </div>
            
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Comment:</strong> {feedback.feedback_desc}</p>
                    <p><strong>Date:</strong> {feedback.feedback_date}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>
    )
}

export default MentorFeedback