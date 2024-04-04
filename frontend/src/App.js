import './App.css';
import Navigation from './Navigation';
import Home from './Home';
import MatchingPage from './MatchingPage';
import CommunityPage from './CommunityPage';
import UserPage from './UserPage'
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
                </Routes>
            </div>
        </>
    )
}

export default App;
