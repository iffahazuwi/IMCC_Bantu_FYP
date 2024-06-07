import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from './axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';

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
        <div>
            <h2 className="my-4">Mentor Application List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Matric No.</th>
                        <th>School</th>
                        <th>Phone No.</th>
                        <th>Email</th>
                        <th>Form</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                <tbody>
                    {applications.map((app, index) => (
                        <tr key={app.app_id}>
                            <td>{index + 1}</td>
                            <td>{app.user_name}</td>
                            <td>{app.matric_no}</td>
                            <td>{app.school}</td>
                            <td>{app.phone_no}</td>
                            <td>{app.email}</td>
                            <td>
                                <button className='btn btn-success btn-sm' onClick={() => viewFile(app)}>View File</button>
                            </td>
                            <td>
                                {app.app_status === 'Approved' || app.app_status === 'Rejected' ? (
                                    app.app_status
                                ) : (
                                    <button className='btn btn-primary btn-sm' onClick={() => editStatus(app)}>Update</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* <Link to="/user-page">
                <Button className='btn-secondary mb-3 ms-3 fixed-bottom'>Back</Button>
            </Link> */}

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Application Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Gender:</strong> {selectedApplication.app_gender}</p>
                    <p><strong>Country:</strong> {selectedApplication.app_country}</p>
                    <p><strong>Language:</strong> {selectedApplication.app_language}, {selectedApplication.app_language_2}</p>
                    <p><strong>Skill:</strong> {selectedApplication.app_skill}</p>
                    <p><strong>Certificate:</strong> <a href={`http://localhost:5000/uploads/${selectedApplication.app_filedata}`} target="_blank" rel="noopener noreferrer">{selectedApplication.app_filename}</a></p>
                    <p><strong>Date:</strong> {selectedApplication.app_date}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
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
                    <Button variant="secondary" onClick={handleEditClose}>Close</Button>
                    <Button variant="primary" onClick={saveStatus} disabled={newStatus === ''}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}