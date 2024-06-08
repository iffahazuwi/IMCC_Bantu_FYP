import React, { useState } from 'react';
import MentorList from './MentorList';
import ApplicationList from './ApplicationList';
import RewardsManagement from "./RewardsManagement";
import { Tab, Tabs, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MentorManagement = () => {
    const [refreshMentorList, setRefreshMentorList] = useState(false);

    const handlePointsUpdated = () => {
        setRefreshMentorList(prev => !prev);
    };

    return (
        <div className='App pb-2'>
            <h1>Mentor Management</h1>
            <Tabs defaultActiveKey="registered-mentors" id="mentor-management-tabs">
                <Tab eventKey="registered-mentors" title="List of Registered Mentors">
                    <MentorList refresh={refreshMentorList} />
                </Tab>
                {/* <Tab eventKey="rewards-management" title="Rewards Management">
                    <RewardsManagement onPointsUpdated={handlePointsUpdated} />
                </Tab> */}
                <Tab eventKey="mentor-applications" title="Mentor Application List">
                    <ApplicationList />
                </Tab>
            </Tabs>
            <div className="mb-2 ms-2 fixed-bottom" style={{ textAlign: 'left' }}>
                <Link to="/user-page">
                    <Button variant="secondary">
                        Back
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default MentorManagement;