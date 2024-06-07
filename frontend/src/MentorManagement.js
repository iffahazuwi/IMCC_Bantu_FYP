import React from 'react';
import MentorList from './MentorList';
import ApplicationList from './ApplicationList';
import { Tab, Tabs } from 'react-bootstrap';

const MentorManagement = () => {
    return (
        <div className='App pb-2'>
            <h1>Mentor Management</h1>
            <Tabs defaultActiveKey="registered-mentors" id="mentor-management-tabs">
                <Tab eventKey="registered-mentors" title="List of Registered Mentors">
                    <MentorList />
                </Tab>
                <Tab eventKey="mentor-applications" title="Mentor Application List">
                    <ApplicationList />
                </Tab>
            </Tabs>
        </div>
    );
}

export default MentorManagement;