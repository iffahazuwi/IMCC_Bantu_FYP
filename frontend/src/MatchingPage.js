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
    const [matchDetails, setMatchDetails] = useState(null);
    const [matchingId, setMatchingId] = useState('');

    // Fetch student matching ID
    // useEffect(() => {
    //     const getStudentMatchingId = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/get_student_matching_id', { withCredentials: true });
    //             console.log('Response:', response); // Log the entire response object
    //             if (response.data && response.data.matching_id) {
    //                 setMatchingId(response.data.matching_id);
    //             } else {
    //                 console.error('No matching_id found in the response:', response);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching student matching ID:', error);
    //         }
    //     };
    
    //     getStudentMatchingId();
    // }, []);
    

    // // Define fetchMatches function
    // const fetchMatches = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/getMatches', { withCredentials: true });
    //         setMatches(response.data);
    //     } catch (error) {
    //         console.error('Error fetching matches:', error);
    //     }
    // };

    // // Define viewMatchDetails function
    // const viewMatchDetails = async (matchingId) => {
    //     try {
    //         const response = await axios.get(`http://localhost:5000/get_match_details/${matchingId}`, { withCredentials: true });
    //         setMatchDetails(response.data);
    //     } catch (error) {
    //         console.error('Error fetching match details:', error);
    //     }
    // };    

    // useEffect(() => {
    //     const fetchUserRole = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/getUserRole', { withCredentials: true });
    //             setUserType(response.data.type);
    //         } catch (error) {
    //             console.error('Error fetching user role:', error);
    //         }
    //     };

    //     fetchUserRole();
    //     fetchMatches();
    //     viewMatchDetails();
    // }, []);

    // useEffect(() => {
    //     if (userType === 'student' && matches.length > 0) {
    //         viewMatchDetails(matches[0].matching_id);
    //     }
    // }, [userType, matches]);

    // useEffect(() => {
    //     if (userType === 'student' && matchingId !== '' && matches.length > 0) {
    //         viewMatchDetails(matchingId);
    //     }
    // }, [userType, matches, matchingId]);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userTypeResponse = await axios.get('http://localhost:5000/getUserRole', { withCredentials: true });
                setUserType(userTypeResponse.data.type);
    
                if (userTypeResponse.data.type === 'student') {
                    const matchingIdResponse = await axios.get('http://localhost:5000/get_student_matching_id', { withCredentials: true });
                    setMatchingId(matchingIdResponse.data.matching_id);
    
                    const matchDetailsResponse = await axios.get(`http://localhost:5000/get_match_details/${matchingIdResponse.data.matching_id}`, { withCredentials: true });
                    setMatchDetails(matchDetailsResponse.data);
                }
    
                if (userTypeResponse.data.type === 'admin') {
                    const matchesResponse = await axios.get('http://localhost:5000/getMatches', { withCredentials: true });
                    setMatches(matchesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
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
            {matchDetails && (
            <div>
                <h4 className='mb-3'><strong>Current Status: </strong></h4>
                <hr />
                <h5 className="mb-3">Matching process has completed!<br />
                    Details of your resulted partner are provided below:</h5>
            {matchDetails.is_mentor ? (  // Added conditional rendering
                <><div className="border border-dark rounded p-3">
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
                </div><hr /></>
            ) : (
                <><div className="border border-dark rounded p-3">
                    <div>
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
                    </div>
                    <hr />
                    <div align="center">
                        <Link to="/matching-page/feedback-form">
                            <button
                                className='btn btn-success'
                            >Submit Feedback</button>
                        </Link>
                    </div></>)}
        </div>)}
            </div>) : (<div className='row'>
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