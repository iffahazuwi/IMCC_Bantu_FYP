import React, { useEffect, useState } from 'react';
import axios from './axios';
import { Table, Button, ButtonGroup } from 'react-bootstrap';

const MentorList = ({ refresh }) => {
    const [mentors, setMentors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const mentorsPerPage = 5;

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

    // Calculate the indices of the first and last mentors on the current page
    const indexOfLastMentor = currentPage * mentorsPerPage;
    const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
    const currentMentors = mentors.slice(indexOfFirstMentor, indexOfLastMentor);

    // Calculate the total number of pages
    const totalPages = Math.ceil(mentors.length / mentorsPerPage);

    return (
        <div>
            <h2 className='my-4'>Mentor List</h2>
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
                        <th>Matric Number</th>
                        <th>School</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Country</th>
                        <th>Languages</th>
                        {/* <th>Accumulated Points</th> */}
                    </tr>
                </thead>
                <tbody>
                    {currentMentors.map((mentor, index) => (
                        <tr key={mentor.id}>
                            <td>{indexOfFirstMentor + index + 1}</td>
                            <td>{mentor.name}</td>
                            <td>{mentor.matric_no}</td>
                            <td>{mentor.school}</td>
                            <td><a href={`mailto:${mentor.email}`}>{mentor.email}</a></td>
                            <td>{mentor.phone_no}</td>
                            <td>{mentor.gender}</td>
                            <td>{mentor.country}</td>
                            <td>{mentor.language_1}, {mentor.language_2}</td>
                            {/* <td>{mentor.acc_points}</td> */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MentorList;