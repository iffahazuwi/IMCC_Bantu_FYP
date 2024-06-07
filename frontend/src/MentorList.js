import React, { useEffect, useState } from 'react';
import axios from './axios';
import { Table } from 'react-bootstrap';

const MentorList = ({ refresh }) => {
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-mentors', { withCredentials: true });
                setMentors(response.data);
            } catch (error) {
                console.error('Error fetching mentors:', error);
            }
        };
        fetchMentors();
    }, [refresh]); // Re-fetch mentors when 'refresh' changes

    return (
        <div>
            <h2 className='my-4'>Mentor List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Matric Number</th>
                        <th>School</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Country</th>
                        <th>Languages</th>
                        <th>Accumulated Points</th>
                    </tr>
                </thead>
                <tbody>
                    {mentors.map((mentor, index) => (
                        <tr key={mentor.id}>
                            <td>{index + 1}</td>
                            <td>{mentor.name}</td>
                            <td>{mentor.matric_no}</td>
                            <td>{mentor.school}</td>
                            <td>{mentor.email}</td>
                            <td>{mentor.phone_no}</td>
                            <td>{mentor.gender}</td>
                            <td>{mentor.country}</td>
                            <td>{mentor.language_1}, {mentor.language_2}</td>
                            <td>{mentor.acc_points}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MentorList;