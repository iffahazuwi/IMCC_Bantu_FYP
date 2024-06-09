import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from './axios';
import { Modal, Button, Form, Table, ButtonGroup } from 'react-bootstrap';

export default function ApplicationList() {

    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState({});
    const [newStatus, setNewStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const mentorsPerPage = 5;

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
                form_id: selectedApplication.form_id,
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
        setNewStatus(application.form_status || '');
        setShowEditModal(true);
    };
    
    // Calculate the indices of the first and last mentors on the current page
    const indexOfLastApplication = currentPage * mentorsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - mentorsPerPage;
    const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);

    // Calculate the total number of pages
    const totalPages = Math.ceil(applications.length / mentorsPerPage);

    return (
        <div>
            <h2 className="my-4">Mentor Application List</h2>
            <ButtonGroup className="mb-3">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? 'primary' : 'outline-primary'}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                </Button>
            </ButtonGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Matric No.</th>
                        <th>Email</th>
                        <th>Form</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                <tbody>
                    {currentApplications.map((app, index) => (
                        <tr key={app.form_id}>
                            <td>{indexOfFirstApplication + index + 1}</td>
                            <td>{app.form_name}</td>
                            <td>{app.form_matric_no}</td>
                            <td><a href={`mailto:${app.form_email}`}>{app.form_email}</a></td>
                            <td>
                                <button className='btn btn-success btn-sm' onClick={() => viewFile(app)}>View</button>
                            </td>
                            <td>
                                {app.form_status === 'Approved' || app.form_status === 'Rejected' ? (
                                    app.form_status
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
                    {/* <p><strong>Gender:</strong> {selectedApplication.app_gender}</p>
                    <p><strong>Country:</strong> {selectedApplication.app_country}</p>
                    <p><strong>Language:</strong> {selectedApplication.app_language}, {selectedApplication.app_language_2}</p>
                    <p><strong>Skill:</strong> {selectedApplication.app_skill}</p>
                    <p><strong>Certificate:</strong> <a href={`http://localhost:5000/uploads/${selectedApplication.app_filedata}`} target="_blank" rel="noopener noreferrer">{selectedApplication.app_filename}</a></p>
                    <p><strong>Date:</strong> {selectedApplication.app_date}</p> */}
                    <p><strong>Name:</strong> {selectedApplication.form_name}</p>
                    <p><strong>IC/Passport No.:</strong> {selectedApplication.form_ic}</p>
                    <p><strong>Matric No.:</strong> {selectedApplication.form_matric_no}</p>
                    <p><strong>Programme:</strong> {selectedApplication.form_programme}</p>
                    <p><strong>School:</strong> {selectedApplication.form_school}</p>
                    <p><strong>Country:</strong> {selectedApplication.form_country}</p>
                    <p><strong>Languages:</strong> {selectedApplication.form_languages}</p>
                    <p><strong>Phone No.:</strong> {selectedApplication.form_phone_no}</p>
                    <p><strong>Email:</strong> {selectedApplication.form_email}</p>
                    <p><strong>Allergies:</strong> {selectedApplication.form_allergies}</p>
                    <p><strong>Date Submitted:</strong> {selectedApplication.form_date}</p>
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