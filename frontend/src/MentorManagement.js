import React, { useState } from 'react';
import MentorList from './MentorList';
import ApplicationList from './ApplicationList';
import RewardsManagement from "./RewardsManagement";
import { Tab, Tabs, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MentorManagement = () => {
    const [refreshMentorList, setRefreshMentorList] = useState(false);
    const [activeTab, setActiveTab] = useState('registered-mentors');

    const handlePointsUpdated = () => {
        setRefreshMentorList(prev => !prev);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'registered-mentors':
                return <MentorList refresh={refreshMentorList} />;
            case 'mentor-applications':
                return <ApplicationList />;
            // Uncomment if you want to add the rewards-management tab
            // case 'rewards-management':
            //     return <RewardsManagement onPointsUpdated={handlePointsUpdated} />;
            default:
                return null;
        }
    };

    return (
        <div className='App pb-2'>
            <h1>Mentor Management</h1>
            <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
                <div className="container-fluid px-0">
                    <div className="navbar-nav w-100 d-flex justify-content-between">
                        <button
                            className={`nav-link text-center flex-fill custom-nav-link ${activeTab === 'registered-mentors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('registered-mentors')}
                        >
                            List of Registered Mentors
                        </button>
                        {/* Uncomment if you want to add the rewards-management tab
                        <button
                            className={`nav-link text-center flex-fill custom-nav-link ${activeTab === 'rewards-management' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rewards-management')}
                        >
                            Rewards Management
                        </button>
                        */}
                        <button
                            className={`nav-link text-center flex-fill custom-nav-link ${activeTab === 'mentor-applications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mentor-applications')}
                        >
                            Mentor Application List
                        </button>
                    </div>
                </div>
            </nav>
            <div className="tab-content">
                {renderContent()}
            </div>
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