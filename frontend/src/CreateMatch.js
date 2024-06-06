import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const CreateMatch = (props) => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [clientDetails, setClientDetails] = useState(null);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsResponse = await axios.get('http://localhost:5000/get-clients', { withCredentials: true });
                setClients(clientsResponse.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    const fetchClientDetails = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:5000/get-client-details/${clientId}`, { withCredentials: true });
            setClientDetails(response.data);
        } catch (error) {
            console.error('Error fetching client details:', error);
        }
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        setSelectedClient(clientId);
        if (clientId) {
            fetchClientDetails(clientId);
        } else {
            setClientDetails(null);
        }
    };

    const handleFindMatches = async () => {
        if (clientDetails) {
            try {
                const response = await axios.post("http://localhost:5000/match", clientDetails, { withCredentials: true });
                setMentors(response.data);
                alert("List of compatible mentors successfully generated.");
            } catch (error) {
                console.error('Error finding matches:', error);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/insert-match", { client_id: selectedClient, mentor_id: selectedMentor });
            alert("Match created successfully!");
            navigate("/matching-page");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Details you entered are invalid! Please try again.');
            }
        }
    };

    return (
        <div className="App pb-1">
            <div className="container mt-4">
                <div className="card shadow-sm p-4">
                    <h1 className="mb-4">Assign Mentor</h1>
                    <p className="mb-4 text-muted">**Select client's name to generate a list of compatible mentors.**</p>

                    <label htmlFor="client" className="form-label">Client Name (Client Matric No.)</label>
                    <select value={selectedClient} onChange={handleClientChange} className="form-control mb-3">
                        <option value="">Select a client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name} ({client.matric_no})</option>
                        ))}
                    </select>

                    {clientDetails && (
                        <div className="client-details mb-4">
                            <h5>Client Details:</h5>
                            <div className="row">
                                <div className="col"><strong>Gender:</strong> {clientDetails.gender}</div>
                                <div className="col"><strong>Country:</strong> {clientDetails.country}</div>
                                <div className="col"><strong>School:</strong> {clientDetails.school}</div>
                            </div>
                            <div className="row">
                                <div className="col"><strong>Language 1:</strong> {clientDetails.language_1}</div>
                                <div className="col"><strong>Language 2:</strong> {clientDetails.language_2}</div>
                                <div className="col"></div>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-primary mt-3" onClick={handleFindMatches}>Find Matches</button>
                            </div>
                        </div>
                    )}

                    {mentors.length > 0 && (
                        <div className="mentor-selection">
                            <label htmlFor="mentor" className="form-label">Mentor Name</label>
                            <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)} className="form-control mb-4">
                                <option value="">Select a mentor</option>
                                {mentors.map(mentor => (
                                    <option key={mentor.id} value={mentor.id}>
                                        {mentor.name} (Similarity: {mentor.Similarity.toFixed(2)}%)
                                    </option>
                                ))}
                            </select>

                            <div className="mentor-details">
                                <h5 className="mb-4">Top 3 Compatible Mentors:</h5>
                                <div className="row">
                                    {mentors.slice(0, 3).map(mentor => (
                                        <div key={mentor.id} className="col-md-4 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <h4 className="card-title">{mentor.name} ({mentor.matric_no})</h4><hr/>
                                                    <p className="card-text"><strong>Gender:</strong> {mentor.gender}</p>
                                                    <p className="card-text"><strong>Country:</strong> {mentor.country}</p>
                                                    <p className="card-text"><strong>School:</strong> {mentor.school}</p>
                                                    <p className="card-text"><strong>Language 1:</strong> {mentor.language_1}</p>
                                                    <p className="card-text"><strong>Language 2:</strong> {mentor.language_2}</p>
                                                    <p className="card-text"><strong>Similarity:</strong> {mentor.Similarity.toFixed(2)}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row mt-4">
                        <div className="col">
                            <Link to="/matching-page">
                                <button className="btn btn-secondary">Cancel</button>
                            </Link>
                        </div>
                        <div className="col text-end">
                            <button className="btn btn-success" onClick={handleSubmit} disabled={selectedClient === '' || selectedMentor === ''}>
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateMatch;