import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from './axios';

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
    const [statusFilter, setStatusFilter] = useState('All');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsModalTitle, setDetailsModalTitle] = useState('');
    const [detailsModalData, setDetailsModalData] = useState({});

    const [currentPage, setCurrentPage] = useState(0);
    //const [matches, setMatches] = useState([]);
    const itemsPerPage = 10;

    // Get current page matches
    // const filteredMatches = matches.filter((match) => {
    //     if (statusFilter === 'All') {
    //         return true; // Show all matches
    //     } else {
    //         return match.matching_status === statusFilter;
    //     }
    // });

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Render pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 0; i < totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </button>
            );
        }
        return buttons;
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (matchingId, newStatus) => {
        if (!window.confirm('Are you sure you want to update the status of this match?')) {
            return;
        }
        try {
            await axios.post(`http://localhost:5000/update-match-status/${matchingId}`, {
                status: newStatus
            }, { withCredentials: true });
            alert("Status updated successfully!")
            fetchData(); // Refresh the list
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

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
            const responseData = response.data;
    
            // Check if all values in the response data are null
            const allNullValues = Object.values(responseData).every(value => value === null);
    
            if (allNullValues) {
                alert('No feedback submitted for this matching.');
            } else {
                setFeedback(responseData);
                setModalTitle(`Feedback Submitted`);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            alert('Error fetching feedback. Please try again.');
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

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const filteredMatches = matches.filter((match) => {
        if (statusFilter === 'All') {
            return true; // Show all matches
        } else {
            return match.matching_status === statusFilter;
        }
    });

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

    const checkFeedbackSubmission = async (matchingId) => {
        try {
            const response = await axios.get(`http://localhost:5000/getFeedback/${matchingId}`, { withCredentials: true });
            const responseData = response.data;
            const allNullValues = Object.values(responseData).every(value => value === null);
            return !allNullValues; // Return true if feedback has been submitted, false otherwise
        } catch (error) {
            console.error('Error checking feedback submission:', error);
            alert('Error checking feedback submission. Please try again.');
            return false;
        }
    };

    const handleFeedbackButtonClick = async () => {
        if (await checkFeedbackSubmission(matchingId)) {
            alert('Feedback has been submitted for this matching.');
        } else {
            navigate("/matching-page/feedback-form");
        }
    };

    const handleNameClick = (role, name, school, phone, email) => {
        setDetailsModalTitle(`${role} Details`);
        setDetailsModalData({ name, school, phone, email });
        setShowDetailsModal(true);
    };
    
    const handleDetailsModalClose = () => setShowDetailsModal(false);

     // Calculate total pages
    // Calculate total pages based on filtered matches
    const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

    // Get current page matches
    const currentMatches = filteredMatches.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);


    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1><strong>Matching Platform</strong></h1>
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
                                                <div className='col-md-9'><strong>: </strong>
                                                    <span style={{ marginLeft: '10px' }}>
                                                        <a href={`tel:${matchDetails.client_phone_no}`}>{matchDetails.client_phone_no}</a>
                                                    </span>
                                                </div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Client Email Address</strong></div>
                                                <div className='col-md-9'><strong>: </strong>
                                                    <span style={{ marginLeft: '10px' }}>
                                                        <a href={`mailto:${matchDetails.client_email}`}>{matchDetails.client_email}</a>
                                                    </span>
                                                </div>
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
                                                <div className='col-md-9'><strong>: </strong>
                                                    <span style={{ marginLeft: '10px' }}>
                                                        <a href={`tel:${matchDetails.mentor_phone_no}`}>{matchDetails.mentor_phone_no}</a>
                                                    </span>
                                                </div>
                                            </div>
                                        </h4>
                                        <h4>
                                            <div className='row'>
                                                <div className='col-md-3'><strong>Mentor Email Address</strong></div>
                                                <div className='col-md-9'><strong>: </strong>
                                                    <span style={{ marginLeft: '10px' }}>
                                                        <a href={`mailto:${matchDetails.mentor_email}`}>{matchDetails.mentor_email}</a>
                                                    </span>
                                                </div>
                                            </div>
                                        </h4>
                                    </div>
                                    <hr />
                                    <div align='center'>
                                        <br />
                                        <Button variant="primary" className='col-md-4' onClick={handleFeedbackButtonClick}>Submit Feedback</Button> {/* Use the new handler */}
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
                    <div className='col'><h2 className="mb-2" align="left">Matching List</h2></div>
                    <div className='col' align="right">
                        <Link to="/matching-page/assign-mentor">
                            <button className='btn btn-primary'>Assign Mentor</button>
                        </Link>
                    </div>
                    <div>
                    <Form.Group controlId="statusFilter" className="mb-1">
                        <Form.Label><strong>Filter by Status</strong></Form.Label>
                        <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange}>
                            <option value="All">All</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </Form.Control>
                    </Form.Group>
                    </div>
                    <div className="mt-3">
                        {renderPaginationButtons()}
                    </div>
                    <div className='col-12 mt-3'>
                        <table className="table table-striped table-bordered table-hover">
                            <thead className='thead-dark'>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>No.</th>
                                    <th style={{ textAlign: 'center' }}>Client Name</th>
                                    <th style={{ textAlign: 'center' }}>Client Matric No.</th>
                                    <th style={{ textAlign: 'center' }}>Mentor Name</th>
                                    <th style={{ textAlign: 'center' }}>Mentor Matric No.</th>
                                    <th style={{ textAlign: 'center' }}>Feedback Form</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                    {/* <th style={{ textAlign: 'center' }}>Evaluation</th> */}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMatches.map((match, index) => (
                                    <tr key={match.matching_id}>
                                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span onClick={() => handleNameClick('Client', match.client_name, match.client_school, match.client_phone_no, match.client_email)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                                {match.client_name}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{match.client_matric_no}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span onClick={() => handleNameClick('Mentor', match.mentor_name, match.mentor_school, match.mentor_phone_no, match.mentor_email)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                                {match.mentor_name}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{match.mentor_matric_no}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                            className={`btn btn-sm ${getButtonColor(match.overall_rating)}`}
                                            onClick={() => viewFile(match.matching_id)}>View</button>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Form.Control as="select" value={match.matching_status} onChange={(e) => updateStatus(match.matching_id, e.target.value)}>
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                            </Form.Control>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className='btn btn-danger btn-sm' onClick={() => deleteMatch(match.matching_id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
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
            <Modal show={showDetailsModal} onHide={handleDetailsModalClose} centered>
    <Modal.Header closeButton>
        <Modal.Title>{detailsModalTitle}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <div className="matching-partner-details border border-dark rounded">
            <h4>
                <div className='row'>
                    <div className='col-md-3'><strong>Name</strong></div>
                    <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{detailsModalData.name}</span></div>
                </div>
            </h4>
            <h4>
                <div className='row'>
                    <div className='col-md-3'><strong>School</strong></div>
                    <div className='col-md-9'><strong>: </strong><span style={{ marginLeft: '10px' }}>{detailsModalData.school}</span></div>
                </div>
            </h4>
            <h4>
                <div className='row'>
                    <div className='col-md-3'><strong>Phone No.</strong></div>
                    <div className='col-md-9'><strong>: </strong>
                        <span style={{ marginLeft: '10px' }}>
                            <a href={`tel:${detailsModalData.phone}`}>{detailsModalData.phone}</a>
                        </span>
                    </div>
                </div>
            </h4>
            <h4>
                <div className='row'>
                    <div className='col-md-3'><strong>Email Address</strong></div>
                    <div className='col-md-9'><strong>: </strong>
                        <span style={{ marginLeft: '10px' }}>
                            <a href={`mailto:${detailsModalData.email}`}>{detailsModalData.email}</a>
                        </span>
                    </div>
                </div>
            </h4>
        </div>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleDetailsModalClose}>
            Close
        </Button>
    </Modal.Footer>
</Modal>
        </div>
    );
}