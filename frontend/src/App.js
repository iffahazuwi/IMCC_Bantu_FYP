import './App.css';
import Navigation from './Navigation';
import Home from './Home';
import MatchingPage from './MatchingPage';
import CommunityPage from './CommunityPage';
import UserPage from './UserPage'
import FeedbackForm from './components/FeedbackForm';
import ApplicationForm from './components/ApplicationForm'
import Notifications from './components/Notifications'
import {Route, Routes} from "react-router-dom"

function App() {
    return (
        <>
            <Navigation />
            <div className='container'>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/matching-page" element={<MatchingPage />} />
                    <Route path="/community-page" element={<CommunityPage />} />
                    <Route path="/user-page" element={<UserPage />} />
                    <Route path="/matching-page/feedback-form" element={<FeedbackForm />} />
                    <Route path="/user-page/application-form" element={<ApplicationForm />} />
                    <Route path="/user-page/notifications" element={<Notifications />} />
                </Routes>
            </div>
        </>
    )
}

export default App;
