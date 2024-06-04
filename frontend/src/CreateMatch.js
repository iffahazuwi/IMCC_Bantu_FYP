import React, { useState, useEffect  } from "react";
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
            } catch (error) {
                console.error('Error finding matches:', error);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/insert-match",
                { client_id: selectedClient, mentor_id: selectedMentor });
            alert("Match created successfully!")
            navigate("/matching-page");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Details you entered are invalid! Please try again.');
            }
        }
    }

    return (
        <div className="App">
            <div className="feedback-form-container">
            <h1 className="mb-3" align="left" >Assign Mentor</h1>
            {/* <h4>**Notes: When admin select a client's name, the system will automatically print out
                5 mentors with highest level of similarities between them. Then, when admin click 
                'Assign' button, the match will be added in the matching list.**
            </h4> */}
            <h6>**Select client's name to generate list of compatible mentors.</h6>

            <label htmlFor="client" className="form-label mt-2">Client Name (Client Matric No.)</label>
                <select
                    value={selectedClient}
                    onChange={handleClientChange}
                    className="form-control"
                >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name} ({client.matric_no})</option>
                    ))}
                </select>

            {clientDetails && (
                <div className="client-details">
                    <div className="mt-3 mb-3"><h5>Client Details:</h5></div>
                    <div className="row">
                        <div className="col"><p><strong>Gender:</strong> {clientDetails.gender}</p></div>
                        <div className="col"><p><strong>Country:</strong> {clientDetails.country}</p></div>
                        <div className="col"><p><strong>School:</strong> {clientDetails.school}</p></div>
                    </div>
                    <div className="row">
                        <div className="col"><p><strong>Language 1:</strong> {clientDetails.language_1}</p></div>
                        <div className="col"><p><strong>Language 2:</strong> {clientDetails.language_2}</p></div>
                        <div className="col"></div>
                    </div>
                    <div align='center'>
                        <button className="btn btn-primary mt-2" onClick={handleFindMatches}>Find Matches</button>
                    </div>
                </div>
            )}

            {mentors.length > 0 && (
                    <div className="mentor-selection mt-3">
                        <label htmlFor="mentor" className="form-label mt-2">Mentor Name</label>
                        <select
                            value={selectedMentor}
                            onChange={(e) => setSelectedMentor(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Select a mentor</option>
                            {mentors.map(mentor => (
                                <option key={mentor.id} value={mentor.id}>
                                    {mentor.name} (Similarity: {mentor.Similarity.toFixed(2)}%)
                                </option>
                            ))}
                        </select>

                        <div className="mentor-details mt-3">
                            <div className="mt-3 mb-3"><h5>Top 3 Compatible Mentors:</h5></div>
                            <hr/>
                            {mentors.map(mentor => (
                                <div key={mentor.id}>
                                    <p><strong>Name:</strong> {mentor.name}</p>
                                    <div></div>
                                    <div className="row">
                                        <div className="col"><p><strong>Gender:</strong> {mentor.gender}</p></div>
                                        <div className="col"><p><strong>Country:</strong> {mentor.country}</p></div>
                                        <div className="col"><p><strong>School:</strong> {mentor.school}</p></div>
                                    </div>
                                    <div className="row">
                                        <div className="col"><p><strong>Language 1:</strong> {mentor.language_1}</p></div>
                                        <div className="col"><p><strong>Language 2:</strong> {mentor.language_2}</p></div>
                                        <div className="col"><p><strong>Similarity:</strong> {mentor.Similarity.toFixed(2)}%</p></div>
                                    </div>
                                    <hr/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            {/* <label htmlFor="mentor" className="form-label mt-2">Mentor Name</label>
            <select
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                className="form-control"
            >
                <option value="">Select a mentor</option>
                {mentors.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                ))}
            </select> */}

            <div className="row fixed-bottom p-3">
                <div className='col' align="left">
                    <Link to="/matching-page">
                        <button
                            className='btn btn-secondary mt-3'
                        >Cancel</button>
                    </Link>
                </div>
                <div className='col' align="right">
                    <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)} 
                    disabled={selectedClient === '' || selectedMentor === ''}>Assign</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default CreateMatch