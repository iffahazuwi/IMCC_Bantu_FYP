import { useEffect, useState } from 'react';
import axios from './axios';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

export default function Home() {
    const [userType, setUserType] = useState('');
    const [isMentor, setIsMentor] = useState(false);
    const [mentorCount, setMentorCount] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const [averageRating, setAverageRating] = useState(0.0);
    const [matchStatusDistribution, setMatchStatusDistribution] = useState([]);
    // const [mentorRatingsDistribution, setMentorRatingsDistribution] = useState([]);
    // const [matchesOverTime, setMatchesOverTime] = useState([]);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getUserRole', {withCredentials: true});
                setUserType(response.data.type);
                setIsMentor(response.data.is_mentor);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        const fetchMentorCount = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getMentorCount', {withCredentials: true});
                setMentorCount(response.data.mentor_count);
            } catch (error) {
                console.error('Error fetching mentor count:', error);
            }
        };

        const fetchMatchingStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getMatchingStats', {withCredentials: true});
                setTotalMatches(response.data.total_matches);
                setAverageRating(parseFloat(response.data.average_rating));
            } catch (error) {
                console.error('Error fetching matching stats:', error);
            }
        };

        const fetchMatchStatusDistribution = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getMatchStatusDistribution', { withCredentials: true });
                setMatchStatusDistribution(response.data);
            } catch (error) {
                console.error('Error fetching match status distribution:', error);
            }
        };

        // const fetchMentorRatingsDistribution = async () => {
        //     try {
        //         const response = await axios.get('http://localhost:5000/getMentorRatingsDistribution', { withCredentials: true });
        //         setMentorRatingsDistribution(response.data);
        //     } catch (error) {
        //         console.error('Error fetching mentor ratings distribution:', error);
        //     }
        // };

        // const fetchMatchesOverTime = async () => {
        //     try {
        //         const response = await axios.get('http://localhost:5000/getMatchesOverTime', { withCredentials: true });
        //         setMatchesOverTime(response.data);
        //     } catch (error) {
        //         console.error('Error fetching matches over time:', error);
        //     }
        // };

        fetchUserRole();
        fetchMentorCount();
        fetchMatchingStats();
        fetchMatchStatusDistribution();
        // fetchMentorRatingsDistribution();
        // fetchMatchesOverTime();
    }, []);

    const matchStatusData = {
        labels: matchStatusDistribution.map(item => item.status),
        datasets: [
            {
                data: matchStatusDistribution.map(item => item.count),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0'
                ]
            }
        ]
    };

    // const mentorRatingsData = {
    //     labels: mentorRatingsDistribution.map(item => item.rating),
    //     datasets: [
    //         {
    //             label: 'Number of Mentors',
    //             data: mentorRatingsDistribution.map(item => item.count),
    //             backgroundColor: '#36A2EB'
    //         }
    //     ]
    // };

    // const matchesOverTimeData = {
    //     labels: matchesOverTime.map(item => item.date),
    //     datasets: [
    //         {
    //             label: 'Number of Matches',
    //             data: matchesOverTime.map(item => item.count),
    //             fill: false,
    //             borderColor: '#FF6384'
    //         }
    //     ]
    // };

    return (
        <div className="app-home">
            <div className="left-side">
                <div className="welcome-section">
                    <h1><strong>Home</strong></h1>
                    <div className="container-home">
                        <h2>
                            {userType === 'student' && isMentor ? (
                                <div>
                                    WELCOME TO IMCC BANTU!<br/>
                                    <h6>Congratulations! You have been selected as a mentor!
                                    Your registration as a mentor has been successful.<br/>
                                    You can access the system now.</h6>
                                </div>
                            ) : (
                                <div>
                                    WELCOME TO IMCC BANTU!<br/>
                                    <h6>You can access the system now.</h6>
                                </div>
                            )}
                        </h2>
                        <p>
                            Visit
                            <a className="link-imcc" href="https://imcc.usm.my/" target="_blank" rel="noopener noreferrer">https://imcc.usm.my/</a>
                            for more info!
                        </p>
                    </div>
                </div>
                <div className="dashboard">
                <h3 className="mb-3" align='center'>General Statistics</h3>
                    <div className="dashboard-stats">
                        <div className="dashboard-card">
                            <h3 align='center'>Number of Mentors Registered</h3>
                            <p align='center'>{mentorCount}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3 align='center'>Total Matches Made</h3>
                            <p align='center'>{totalMatches}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3 align='center'>Average Match Rating</h3>
                            <p align='center'>{averageRating.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-side">
                <h3 align='center'>Match Status Distribution</h3>
                <div className="chart-container">
                    <Pie data={matchStatusData} />
                </div>
            </div>
            {/* <div className='down-side'>
            <h3 align='center'>Mentor Ratings Distribution</h3>
                <div className="chart-container">
                    <Bar data={mentorRatingsData} />
                </div>
                <h3 align='center'>Matches Over Time</h3>
                <div className="chart-container">
                    <Line data={matchesOverTimeData} />
                </div>
            </div> */}
        </div>
    );
}