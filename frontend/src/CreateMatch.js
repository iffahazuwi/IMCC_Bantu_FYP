import React, { useState, useEffect  } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const CreateMatch = (props) => {

    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    // const [mentors, setMentors] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedMentor, setSelectedMentor] = useState('');

    useEffect(() => {
        const fetchClientsAndMentors = async () => {
            try {
                const clientsResponse = await axios.get('http://localhost:5000/get-clients', { withCredentials: true });
                setClients(clientsResponse.data);

                // const mentorsResponse = await axios.get('http://localhost:5000/get-mentors', { withCredentials: true });
                // setMentors(mentorsResponse.data);
            } catch (error) {
                console.error('Error fetching clients and mentors:', error);
            }
        };

        fetchClientsAndMentors();
    }, []);

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

            <label htmlFor="client" className="form-label mt-2">Client Name</label>
            <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="form-control"
            >
                <option value="">Select a client</option>
                {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name} ({client.matric_no})</option>
                ))}
            </select>

            <div align='center'>
                <button className="btn btn-primary mt-2">Find Matches</button>
            </div>
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