import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import axios from './axios';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ApplicationList() {

    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState({});
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
    try {
        const response = await axios.get('http://localhost:5000/get-applications', { withCredentials: true });
        setApplications(response.data);
        } catch (error) {
        console.error("Error fetching applications:", error);
    }
    };

    const viewFile = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    const handleEditClose = () => setShowEditModal(false);

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const saveStatus = async () => {
        if (!window.confirm('Are you sure you want to update this status?')) {
            return;
        }
        try {
            await axios.post('http://localhost:5000/update-application-status', {
                app_id: selectedApplication.app_id,
                status: newStatus
            }, { withCredentials: true });
            alert("Status updated successfully!")
            fetchApplications(); // Refresh the list
            handleEditClose();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const editStatus = (application) => {
        setSelectedApplication(application);
        setNewStatus(application.app_status || '');
        setShowEditModal(true);
    };

    return (
        <div className='App'>
            <div className="feedback-form-container">
                <h1 className="mb-2" align="left" >Mentor Application List</h1>
                <div className='col-12 mt-3'>
                        <table className="table table-bordered border-dark">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>No.</th>
                                    <th style={{ textAlign: 'center' }}>Name</th>
                                    <th style={{ textAlign: 'center' }}>Matric No.</th>
                                    <th style={{ textAlign: 'center' }}>School</th>
                                    <th style={{ textAlign: 'center' }}>Phone No.</th>
                                    <th style={{ textAlign: 'center' }}>Email</th>
                                    <th style={{ textAlign: 'center' }}>Form</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app, index) => (
                                    <tr key={app.app_id}>
                                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                        <td style={{ textAlign: 'center' }}>{app.user_name}</td>
                                        <td style={{ textAlign: 'center' }}>{app.matric_no}</td>
                                        <td style={{ textAlign: 'center' }}>{app.school}</td>
                                        <td style={{ textAlign: 'center' }}>{app.phone_no}</td>
                                        <td style={{ textAlign: 'center' }}>{app.email}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className='btn btn-success btn-sm' 
                                            onClick={() => viewFile(app)}>View File</button>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {app.app_status === 'Approved' || app.app_status === 'Rejected' ? (
                                                app.app_status
                                            ) : (
                                                <button className='btn btn-primary btn-sm' 
                                                onClick={() => editStatus(app)}>Update</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                <Link to="/user-page">
                    <button
                        className='btn btn-secondary mb-3 ms-3 fixed-bottom'
                    >Back</button>
                </Link>
            </div>
            
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Application Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Gender:</strong> {selectedApplication.app_gender}</p>
                    <p><strong>Country:</strong> {selectedApplication.app_country}</p>
                    <p><strong>Language:</strong> {selectedApplication.app_language}</p>
                    <p><strong>Skill:</strong> {selectedApplication.app_skill}</p>
                    {/* <p><strong>Certificate:</strong> <a href={`http://localhost:5000/uploads/${selectedApplication.app_filedata}`} target="_blank" rel="noopener noreferrer">{selectedApplication.app_filename}</a></p> */}
                    <p><strong>Date:</strong> {selectedApplication.app_date}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Application Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" value={newStatus} onChange={handleStatusChange}>
                                <option value="">Select Status</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveStatus} disabled={newStatus === ''}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}