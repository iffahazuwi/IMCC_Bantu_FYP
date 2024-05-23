import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import CommunityPage from './CommunityPage';
import FeedbackForm from "./FeedbackForm";
import Home from './Home';
import LoginPage from './LoginPage';
import MatchingPage from './MatchingPage';
import Navigation from './Navigation';
import RegisterPage from './RegisterPage';
import UserPage from './UserPage';
import ApplicationForm from './ApplicationForm';
import Notifications from './Notifications';
import MyBookmarks from "./Bookmarks";
import CreatePost from "./CreatePost";
import ApplicationList from "./ApplicationList";
import CreateMatch from "./CreateMatch";


const App = () => {

    return (
        <>
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/matching-page" element={<MatchingPage />} />
                    <Route path="/community-page" element={<CommunityPage />} />
                    <Route path="/user-page" element={<UserPage />} />
                    <Route path="/matching-page/feedback-form" element={<FeedbackForm />} />
                    <Route path="/user-page/application-form" element={<ApplicationForm />} />
                    <Route path="/user-page/application-list" element={<ApplicationList />} />
                    <Route path="/user-page/notifications" element={<Notifications />} />
                    <Route path="/community-page/bookmarks" element={<MyBookmarks />} />
                    <Route path="/community-page/create-post" element={<CreatePost />} />
                    <Route path="/matching-page/create-match" element={<CreateMatch />} />
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
