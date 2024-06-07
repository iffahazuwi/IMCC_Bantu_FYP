import React, { useEffect, useState } from 'react';
import axios from './axios';
import { Form, Button, Row, Col } from 'react-bootstrap';

const RewardsManagement = ({ onPointsUpdated }) => {
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [operation, setOperation] = useState('add');
    const [amount, setAmount] = useState('');

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
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedMentor || !amount) {
            alert('Please fill out all fields before submitting.');
            return;
        }
        if (!window.confirm('Are you sure you want to save this update?')) {
            return;
        }
        try {
            await axios.post('http://localhost:5000/update-reward-points', {
                student_id: selectedMentor,
                operation: operation,
                amount: parseInt(amount)
            }, { withCredentials: true });
            alert('Points updated successfully!');
            handleClear();
            onPointsUpdated(); // Refresh the mentor list
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const handleClear = () => {
        setSelectedMentor('');
        setOperation('add');
        setAmount('');
    };

    return (
        <div>
            <h2 className='my-4'>Rewards Management</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="mentorSelect" className="mb-3">
                    <Form.Label column sm={2}>Select Mentor</Form.Label>
                    <Col sm={10}>
                        <Form.Control as="select" value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                            <option value="">Select Mentor</option>
                            {mentors.map((mentor) => (
                                <option key={mentor.id} value={mentor.id}>
                                    {mentor.name} ({mentor.matric_no})
                                </option>
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="operationSelect" className="mb-3">
                    <Form.Label column sm={2}>Operation</Form.Label>
                    <Col sm={10}>
                        <Form.Control as="select" value={operation} onChange={(e) => setOperation(e.target.value)}>
                            <option value="add">Add</option>
                            <option value="subtract">Subtract</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="amountInput" className="mb-3">
                    <Form.Label column sm={2}>Amount</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                        />
                    </Col>
                </Form.Group>
                <div className="mt-3">
                    <Button variant="secondary" onClick={handleClear} className='me-2'>
                        Clear
                    </Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default RewardsManagement;