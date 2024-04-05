import './App.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Navigation from './Navigation';
import Home from './Home';
import MatchingPage from './MatchingPage';
import CommunityPage from './CommunityPage';
import UserPage from './UserPage'
import FeedbackForm from './components/FeedbackForm';
import ApplicationForm from './components/ApplicationForm'
import Notifications from './components/Notifications'
import LoginHeader from './LoginHeader';
import {BrowserRouter, Route, Routes} from "react-router-dom"


const App = () => {

    return (
        <>
            <BrowserRouter>
                <Navigation/>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/matching-page" element={<MatchingPage />} />
                    <Route path="/community-page" element={<CommunityPage />} />
                    <Route path="/user-page" element={<UserPage />} />
                    <Route path="/matching-page/feedback-form" element={<FeedbackForm />} />
                    <Route path="/user-page/application-form" element={<ApplicationForm />} />
                    <Route path="/user-page/notifications" element={<Notifications />} />
                </Routes>
            </BrowserRouter>
            {/* <Navigation />
            <div className='container'>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/matching-page" element={<MatchingPage />} />
                    <Route path="/community-page" element={<CommunityPage />} />
                    <Route path="/user-page" element={<UserPage />} />
                    <Route path="/matching-page/feedback-form" element={<FeedbackForm />} />
                    <Route path="/user-page/application-form" element={<ApplicationForm />} />
                    <Route path="/user-page/notifications" element={<Notifications />} />
                </Routes>
            </div> */}
        </>
    )
}

export default App;
