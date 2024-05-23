import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from './axios';
import { Modal, Button } from 'react-bootstrap';

export default function MatchingPage() {

    const [userType, setUserType] = useState('');
    const [matches, setMatches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try{
                const response = await axios.get('http://localhost:5000/getUserRole', {withCredentials: true});
                setUserType(response.data.type);
            } catch (error){
                console.error('Error fetching user role:', error);
            }
        };

        const fetchMatches = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getMatches', { withCredentials: true });
                setMatches(response.data);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        fetchUserRole();
        fetchMatches();
    }, []);

    const handleClose = () => setShowModal(false);

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

    const deleteMatch = async (matchingId) => {
        if (!window.confirm('Are you sure you want to delete this match?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/delete-match/${matchingId}`, { withCredentials: true });
            setMatches(matches.filter(match => match.matching_id !== matchingId));
            alert('Match deleted.');
        } catch (error) {
            console.error('Error deleting match:', error);
            alert('Error deleting match. Please try again.');
        }
    };

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
                    >Submit Feedback</button>
                </Link>
            </div></div>) : (<div className='row'>
                <div className='col'><h2 className="mb-2" align="left" >Matching History List</h2></div>
                <div className='col' align="right">
                    <Link to="/matching-page/create-match">
                        <button
                            className='btn btn-primary'
                        >Create Match</button>
                    </Link>
                </div>
                <div className='col-12 mt-3'>
                        <table className="table table-bordered border-dark">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>No.</th>
                                    <th style={{ textAlign: 'center' }}>Client Name</th>
                                    <th style={{ textAlign: 'center' }}>Client Matric No.</th>
                                    <th style={{ textAlign: 'center' }}>Mentor Name</th>
                                    <th style={{ textAlign: 'center' }}>Mentor Matric No.</th>
                                    <th style={{ textAlign: 'center' }}>Feedback Form</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((match, index) => (
                                    <tr key={match.matching_id}>
                                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                        <td style={{ textAlign: 'center' }}>{match.client_name}</td>
                                        <td style={{ textAlign: 'center' }}>{match.client_matric_no}</td>
                                        <td style={{ textAlign: 'center' }}>{match.mentor_name}</td>
                                        <td style={{ textAlign: 'center' }}>{match.mentor_matric_no}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className='btn btn-success btn-sm' 
                                            onClick={() => viewFile(match.matching_id)}>View</button>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className='btn btn-danger btn-sm'
                                            onClick={() => deleteMatch(match.matching_id)}>Del</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>)}
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
    );
}