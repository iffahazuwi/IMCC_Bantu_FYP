import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const NotificationCenter = (props) => {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-notifications');
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="feedback-form-container">
            <h1 className="mb-2" align="left" >Notification List</h1>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        {notification.noti_message} - <small>{notification.noti_date}</small>
                    </li>
                ))}
            </ul>
            <Link to="/user-page">
                <button
                    className='btn btn-secondary mb-3 ms-3 fixed-bottom'
                    //onClick={openFeedbackForm}
                >Back</button>
            </Link>
        </div>
    )
}

export default NotificationCenter