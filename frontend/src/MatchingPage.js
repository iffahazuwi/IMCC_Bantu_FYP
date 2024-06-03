import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from './axios';
import { Modal, Button, Form } from 'react-bootstrap';

export default function MatchingPage() {

    const [userType, setUserType] = useState('');
    const [matches, setMatches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [modalTitle, setModalTitle] = useState('');
    const [matchDetails, setMatchDetails] = useState(null);
    const [matchingId, setMatchingId] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState({});
    const [newEvaluation, setNewEvaluation] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
            try {
                const userTypeResponse = await axios.get('http://localhost:5000/getUserRole', { withCredentials: true });
                setUserType(userTypeResponse.data.type);
    
                if (userTypeResponse.data.type === 'student') {
                    const matchingIdResponse = await axios.get('http://localhost:5000/get_student_matching_id', { withCredentials: true });
                    setMatchingId(matchingIdResponse.data.matching_id);

                    if (matchingIdResponse.data.matching_id){
                        const matchDetailsResponse = await axios.get(`http://localhost:5000/get_match_details/${matchingIdResponse.data.matching_id}`, { withCredentials: true });
                        setMatchDetails(matchDetailsResponse.data);
                    }
                }
    
                if (userTypeResponse.data.type === 'admin') {
                    const matchesResponse = await axios.get('http://localhost:5000/getMatches', { withCredentials: true });
                    setMatches(matchesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
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

    const handleEditClose = () => setShowEditModal(false);

    const handleEvaluationChange = (event) => {
        setNewEvaluation(event.target.value);
    };

    const saveEvaluation = async () => {
        if (!window.confirm('Are you sure you want to update this evaluation?')) {
            return;
        }
        try {
            await axios.post('http://localhost:5000/update-evaluation', {
                matching_id: selectedMatch.matching_id,
                evaluation: newEvaluation
            }, { withCredentials: true });
            alert("Evaluation updated successfully!")
            fetchData(); // Refresh the list
            handleEditClose();
        } catch (error) {
            console.error("Error updating evaluation:", error);
        }
    };

    const editEvaluation = (match) => {
        setSelectedMatch(match);
        setNewEvaluation(match.evaluation || '');
        setShowEditModal(true);
    };

    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>Matching Page</h1>
            </div>
            {userType === 'student' ? (
                <div>
                    {matchingId ? (  // Highlighted: Conditional rendering based on matchingId
                        matchDetails && (
                            <div>
                                <h4 className='mb-3'><strong>Current Status: </strong>In Progress</h4>
                                <hr />
                                <h5 className="mb-3">Matching process has completed!<br />
                                    Details of your resulted partner are provided below:</h5>
                                {matchDetails.is_mentor ? (
                                    <><div className="matching-partner-details border border-dark rounded">
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Client Name</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.client_name}</span></div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Client School</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.client_school}</span></div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Client Phone No.</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.client_phone_no}</span></div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Client Email Address</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.client_email}</span></div>
                                            </div>
                                        </h4>
                                    </div><hr/>
                                    <div className='mt-2' align='center'>
                                        <Link to="/matching-page/mentor-feedback">
                                            <button className='btn btn-primary'>View Matching History</button>
                                        </Link>
                                    </div>
                                    </>
                                ) : (
                                    <><div className="matching-partner-details border border-dark rounded">
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Mentor Name</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.mentor_name}</span></div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Mentor School</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.mentor_school}</span></div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Mentor Phone No.</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.mentor_phone_no}</span></div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Mentor Email Address</strong></div>
                                                <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{matchDetails.mentor_email}</span></div>
                                            </div>
                                        </h4>
                                    </div>
                                    <hr />
                                    <div align="center">
                                        <Link to="/matching-page/feedback-form">
                                            <button className='btn btn-success'>Submit Feedback</button>
                                        </Link>
                                    </div></>
                                )}
                            </div>
                        )
                    ) : (
                        <div>  {/* Highlighted: No matchingId case */}
                            <h4 className='mb-3'><strong>Current Status: </strong>No Pending Matching</h4>
                            <hr />
                            <h5 className="mb-3">No matching in progress recorded.</h5>
                            {/* <div className='mt-4' align='center'>
                                <Link to="/matching-page/mentor-feedback">
                                    <button className='btn btn-primary'>View Matching History</button>
                                </Link>
                            </div> */}
                            {/* <div className='mt-4' align='center'>
                                <Link to="/matching-page/request-mentor">
                                    <button className='btn btn-success'>Request Mentor</button>
                                </Link>
                            </div> */}
                        </div>
                    )}
                </div>
            ) : (
                <div className='row'>
                    <div className='col'><h2 className="mb-2" align="left">Matching History List</h2></div>
                    <div className='col' align="right">
                        <Link to="/matching-page/assign-mentor">
                            <button className='btn btn-primary'>Assign Mentor</button>
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
                                    <th style={{ textAlign: 'center' }}>Evaluation</th>
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
                                            {match.evaluation === 'Good' || match.evaluation === 'Neutral' || match.evaluation === 'Bad' ? (
                                                match.evaluation
                                            ) : (
                                                <button className='btn btn-primary btn-sm' 
                                                onClick={() => editEvaluation(match)}>Update</button>
                                            )}
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
                </div>
            )}
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

            <Modal show={showEditModal} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Evaluate Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Evaluation</Form.Label>
                            <Form.Control as="select" value={newEvaluation} onChange={handleEvaluationChange}>
                                <option value="">Select Status</option>
                                <option value="Good">Good</option>
                                <option value="Neutral">Neutral</option>
                                <option value="Bad">Bad</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveEvaluation} disabled={newEvaluation === ''}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}